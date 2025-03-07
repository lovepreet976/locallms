package tests

import (
	"encoding/json"
	"library-management/controllers"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// ✅ Test SearchBooks Function
func TestSearchBooks(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/books/search", controllers.SearchBooks(TestDB))

	// ✅ Mock user libraries
	mock.ExpectQuery(`SELECT library_id FROM "user_libraries" WHERE user_id = \$1`).
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{"library_id"}).AddRow(101).AddRow(102))

	// ✅ Mock book search query
	mock.ExpectQuery(`SELECT isbn, title, authors, publisher, available_copies, library_id FROM "books" WHERE library_id IN \(\$1, \$2\)`).
		WithArgs(101, 102).
		WillReturnRows(sqlmock.NewRows([]string{"isbn", "title", "authors", "publisher", "available_copies", "library_id"}).
			AddRow("123456", "Go Programming", "John Doe", "TechPress", 3, 101).
			AddRow("789012", "Python Mastery", "Jane Smith", "CodeWorld", 0, 102))

	// ✅ Valid search test
	req, _ := http.NewRequest(http.MethodGet, "/books/search", nil)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "1") // Simulate user authentication

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)

	books, exists := response["books"].([]interface{})
	assert.True(t, exists)
	assert.Len(t, books, 2)

	// ✅ Check for books with no available copies
	for _, book := range books {
		b := book.(map[string]interface{})
		if b["available_copies"].(float64) == 0 {
			assert.Contains(t, b, "next_available_date") // ✅ Fixed incorrect usage
		}
	}

	// ✅ Verify if all mock expectations were met
	err = mock.ExpectationsWereMet()
	assert.NoError(t, err, "There were unmet SQL mock expectations")
}

// ✅ Test RequestIssue Function
func TestRequestIssue(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/issue", controllers.RequestIssue(TestDB))

	// ✅ Mock user authentication
	mock.ExpectQuery(`SELECT \* FROM "books" WHERE isbn = \$1 AND library_id = \$2`).
		WithArgs("123456", 101).
		WillReturnRows(sqlmock.NewRows([]string{"isbn", "title", "available_copies", "library_id"}).
			AddRow("123456", "Go Programming", 3, 101))

	// ✅ Mock user library verification
	mock.ExpectQuery(`SELECT \* FROM "user_libraries" WHERE user_id = \$1 AND library_id = \$2`).
		WithArgs(1, 101).
		WillReturnRows(sqlmock.NewRows([]string{"user_id", "library_id"}).AddRow(1, 101))

	// ✅ Mock existing request check (No existing request)
	mock.ExpectQuery(`SELECT \* FROM "request_events" WHERE reader_id = \$1 AND book_id = \$2 AND library_id = \$3 AND approval_date IS NULL`).
		WithArgs(1, "123456", 101).
		WillReturnRows(sqlmock.NewRows([]string{})) // No results

	// ✅ Mock insert request
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "request_events"`).
		WithArgs("123456", 101, 1, sqlmock.AnyArg(), nil, nil, "issue").
		WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	// ✅ Valid book request test
	requestBody := `{"isbn": "123456", "libraryid": 101}`
	req, _ := http.NewRequest(http.MethodPost, "/issue", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "1") // Simulate user authentication

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "Issue request submitted")

	// ✅ Requesting a book from an unauthorized library
	mock.ExpectQuery(`SELECT \* FROM "user_libraries" WHERE user_id = \$1 AND library_id = \$2`).
		WithArgs(1, 102).                           // Unauthorized library
		WillReturnRows(sqlmock.NewRows([]string{})) // No results

	requestBody = `{"isbn": "789012", "libraryid": 102}`
	req, _ = http.NewRequest(http.MethodPost, "/issue", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "1")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "You can only request books from libraries you are registered in")

	// ✅ Requesting a book with no available copies
	mock.ExpectQuery(`SELECT \* FROM "books" WHERE isbn = \$1 AND library_id = \$2`).
		WithArgs("789012", 102).
		WillReturnRows(sqlmock.NewRows([]string{"isbn", "title", "available_copies", "library_id"}).
			AddRow("789012", "Python Mastery", 0, 102)) // No available copies

	requestBody = `{"isbn": "789012", "libraryid": 102}`
	req, _ = http.NewRequest(http.MethodPost, "/issue", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "1")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Book not available for issue")

	// ✅ Duplicate request check (Pending request exists)
	mock.ExpectQuery(`SELECT \* FROM "request_events" WHERE reader_id = \$1 AND book_id = \$2 AND library_id = \$3 AND approval_date IS NULL`).
		WithArgs(1, "123456", 101).
		WillReturnRows(sqlmock.NewRows([]string{"id", "book_id", "reader_id", "approval_date"}).
			AddRow(5, "123456", 1, nil)) // Pending request exists

	requestBody = `{"isbn": "123456", "libraryid": 101}`
	req, _ = http.NewRequest(http.MethodPost, "/issue", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "1")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.Contains(t, w.Body.String(), "You already have a pending request for this book in this library")
}
