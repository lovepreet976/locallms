package tests

import (
	"errors"
	"library-management/controllers"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// ✅ Test Login with Mocked DB
func TestLogin(t *testing.T) {
	SetupTestDatabase() // Ensure mock DB is set up

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/auth/login", controllers.Login(TestDB)) // Attach Login route

	// ✅ Mock successful login query
	mock.ExpectQuery(`SELECT * FROM users WHERE email = $1`).
		WithArgs("test@example.com").
		WillReturnRows(sqlmock.NewRows([]string{"id", "email", "password", "role"}).
			AddRow(1, "test@example.com", "password123", "user"))

	// ✅ Valid login test case
	requestBody := `{"email": "test@example.com", "password": "password123"}`
	req, _ := http.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), "token")

	// ❌ Invalid password test case
	requestBody = `{"email": "test@example.com", "password": "wrongpassword"}`
	req, _ = http.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid credentials")

	// ❌ User not found test case
	mock.ExpectQuery(`SELECT * FROM users WHERE email = $1`).
		WithArgs("unknown@example.com").
		WillReturnError(errors.New("record not found"))

	requestBody = `{"email": "unknown@example.com", "password": "password123"}`
	req, _ = http.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid credentials")

	// ❌ Database error test case
	mock.ExpectQuery(`SELECT * FROM users WHERE email = $1`).
		WithArgs("error@example.com").
		WillReturnError(errors.New("database failure"))

	requestBody = `{"email": "error@example.com", "password": "password123"}`
	req, _ = http.NewRequest(http.MethodPost, "/auth/login", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.Contains(t, w.Body.String(), "Database error")

	// ✅ Verify if all mock expectations were met
	err := mock.ExpectationsWereMet()
	assert.NoError(t, err, "There were unmet SQL mock expectations")
}
