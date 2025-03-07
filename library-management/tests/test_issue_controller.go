package tests

import (
	"encoding/json"
	"library-management/controllers"

	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestListIssueRequests(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/issues", controllers.ListIssueRequests(TestDB))

	mock.ExpectQuery(`SELECT library_id FROM user_libraries WHERE user_id = \$1`).
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{"library_id"}).AddRow(1001))

	mock.ExpectQuery(`SELECT \* FROM request_events`).
		WillReturnRows(sqlmock.NewRows([]string{"id", "book_id", "reader_id", "request_type", "request_date", "approval_date", "approver_id"}).
			AddRow(1, "12345", 2, "issue", 1700000000, nil, nil))

	req, _ := http.NewRequest(http.MethodGet, "/issues", nil)
	req.Header.Set("Authorization", "Bearer valid_token")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
}

func TestApproveIssue(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.PUT("/issue/approve/:id", controllers.ApproveIssue(TestDB))

	mock.ExpectQuery(`SELECT \* FROM request_events WHERE id = \$1`).
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{"id", "book_id", "reader_id", "approval_date", "approver_id"}).
			AddRow(1, "12345", 2, nil, nil))

	mock.ExpectQuery(`SELECT \* FROM books WHERE isbn = \$1`).
		WithArgs("12345").
		WillReturnRows(sqlmock.NewRows([]string{"isbn", "available_copies"}).AddRow("12345", 3))

	mock.ExpectExec(`UPDATE request_events SET approval_date = \$1 WHERE id = \$2`).
		WithArgs(sqlmock.AnyArg(), 1).
		WillReturnResult(sqlmock.NewResult(1, 1))

	req, _ := http.NewRequest(http.MethodPut, "/issue/approve/1", nil)
	req.Header.Set("Authorization", "Bearer valid_token")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Issue request approved")
}

func TestDisapproveIssue(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.PUT("/issue/disapprove/:id", controllers.DisapproveIssue(TestDB))

	mock.ExpectQuery(`SELECT \* FROM request_events WHERE id = \$1`).
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))

	mock.ExpectExec(`DELETE FROM request_events WHERE id = \$1`).
		WithArgs(1).
		WillReturnResult(sqlmock.NewResult(1, 1))

	req, _ := http.NewRequest(http.MethodPut, "/issue/disapprove/1", nil)
	req.Header.Set("Authorization", "Bearer valid_token")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "Issue request disapproved successfully")
}
