package tests

import (
	"library-management/controllers"
	"strings"

	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// ✅ Test AddBook
func TestAddBook(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/book", controllers.AddBook(TestDB))

	// ✅ Mock admin authorization
	mock.ExpectQuery(`SELECT \* FROM "user_libraries" WHERE user_id = \$1 AND library_id = \$2`).
		WithArgs(1, 1).
		WillReturnRows(sqlmock.NewRows([]string{"user_id", "library_id"}).AddRow(1, 1))

	// ✅ Mock book creation
	mock.ExpectExec(`INSERT INTO "books" \("isbn", "title", "authors", "publisher", "total_copies", "available_copies", "library_id"`).
		WillReturnResult(sqlmock.NewResult(1, 1))

	requestBody := `{"isbn": "123456", "title": "Go Programming", "authors": "John Doe", "publisher": "TechPress", "totalcopies": 5, "libraryid": 1}`
	req, _ := http.NewRequest(http.MethodPost, "/book", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "Book added successfully")
}

// ✅ Test UpdateBook
func TestUpdateBook(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.PUT("/book/:isbn", controllers.UpdateBook(TestDB))

	// ✅ Mock admin authorization
	mock.ExpectQuery(`SELECT \* FROM "user_libraries" WHERE user_id = \$1 AND library_id = \$2`).
		WithArgs(1, 1).
		WillReturnRows(sqlmock.NewRows([]string{"user_id", "library_id"}).AddRow(1, 1))

	// ✅ Mock book existence
	mock.ExpectQuery(`SELECT \* FROM "books" WHERE isbn = \$1 AND library_id = \$2`).
		WithArgs("123456", 1).
		WillReturnRows(sqlmock.NewRows([]string{"isbn", "title", "authors", "publisher", "total_copies", "available_copies", "library_id"}).
			AddRow("123456", "Go Programming", "John Doe", "TechPress", 5, 3, 1))

	// ✅ Mock update
	mock.ExpectExec(`UPDATE "books" SET`).WillReturnResult(sqlmock.NewResult(1, 1))

	requestBody := `{"title": "Advanced Go", "authors": "Jane Smith", "publisher": "GoTech", "totalcopies": 10, "libraryid": 1}`
	req, _ := http.NewRequest(http.MethodPut, "/book/123456", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Book updated successfully")
}

// ✅ Test RemoveBook
func TestRemoveBook(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.DELETE("/book/:isbn", controllers.RemoveBook(TestDB))

	// ✅ Mock admin authorization
	mock.ExpectQuery(`SELECT \* FROM "user_libraries" WHERE user_id = \$1 AND library_id = \$2`).
		WithArgs(1, 1).
		WillReturnRows(sqlmock.NewRows([]string{"user_id", "library_id"}).AddRow(1, 1))

	// ✅ Mock book existence
	mock.ExpectQuery(`SELECT \* FROM "books" WHERE isbn = \$1 AND library_id = \$2`).
		WithArgs("123456", 1).
		WillReturnRows(sqlmock.NewRows([]string{"isbn", "title", "total_copies", "available_copies", "library_id"}).
			AddRow("123456", "Go Programming", 5, 5, 1))

	// ✅ Mock book deletion
	mock.ExpectExec(`DELETE FROM "books" WHERE`).WillReturnResult(sqlmock.NewResult(1, 1))

	requestBody := `{"libraryid": 1}`
	req, _ := http.NewRequest(http.MethodDelete, "/book/123456", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Book removed from inventory")
}
