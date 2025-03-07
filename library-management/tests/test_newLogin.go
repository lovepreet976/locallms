package tests

import (
	"library-management/controllers"

	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// ✅ Test Register Owner (Only Owner Can Create Another Owner)
func TestRegisterOwnerNew(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/owner", controllers.RegisterOwnerNew(TestDB))

	// ✅ Mock Insert Query
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "users"`).
		WithArgs(sqlmock.AnyArg(), "new_owner@example.com", "password123", "owner").
		WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	// ✅ Valid Owner Registration Test
	requestBody := `{"email": "new_owner@example.com", "password": "password123", "role": "owner"}`
	req, _ := http.NewRequest(http.MethodPost, "/owner", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "New owner registered successfully")

	// ✅ Role Validation Test (Only "owner" is allowed)
	requestBody = `{"email": "user@example.com", "password": "password123", "role": "user"}`
	req, _ = http.NewRequest(http.MethodPost, "/owner", strings.NewReader(requestBody))
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Invalid role, must be 'owner'")
}

// ✅ Test Register Admin (Only Owner Can Create Admins)
func TestRegisterAdmin(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/admin", controllers.RegisterAdmin(TestDB))

	// ✅ Mock Owner Lookup
	mock.ExpectQuery(`SELECT \* FROM "users" WHERE id = \$1`).
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{"id", "role"}).AddRow(1, "owner"))

	// ✅ Mock Insert Query for Admin
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "users"`).
		WithArgs(sqlmock.AnyArg(), "admin@example.com", "password123", "admin").
		WillReturnResult(sqlmock.NewResult(2, 1))
	mock.ExpectCommit()

	// ✅ Mock Library Association
	mock.ExpectQuery(`SELECT \* FROM "libraries" WHERE id = \$1`).
		WithArgs(100).
		WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(100))

	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "user_libraries"`).
		WithArgs(2, 100).
		WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	// ✅ Valid Admin Registration Test
	requestBody := `{"name": "Admin User", "email": "admin@example.com", "password": "password123", "library_ids": [100]}`
	req, _ := http.NewRequest(http.MethodPost, "/admin", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "1") // Simulating Owner's JWT token

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "Admin registered successfully")

	// ✅ Unauthorized Role Test (Only Owner Can Create Admin)
	mock.ExpectQuery(`SELECT \* FROM "users" WHERE id = \$1`).
		WithArgs(2).
		WillReturnRows(sqlmock.NewRows([]string{"id", "role"}).AddRow(2, "user"))

	requestBody = `{"name": "New Admin", "email": "admin2@example.com", "password": "password123", "library_ids": [100]}`
	req, _ = http.NewRequest(http.MethodPost, "/admin", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "2") // Simulating Non-Owner User

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "Only an owner can create an admin")
}

// ✅ Test Register User (Only Admin Can Create Users)
func TestRegisterUser(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/user", controllers.RegisterUser(TestDB))

	// ✅ Mock Admin Lookup
	mock.ExpectQuery(`SELECT \* FROM "users" WHERE id = \$1`).
		WithArgs(10).
		WillReturnRows(sqlmock.NewRows([]string{"id", "role"}).AddRow(10, "admin"))

	// ✅ Mock Admin Libraries
	mock.ExpectQuery(`SELECT library_id FROM "user_libraries" WHERE user_id = \$1`).
		WithArgs(10).
		WillReturnRows(sqlmock.NewRows([]string{"library_id"}).AddRow(200))

	// ✅ Mock Insert Query for User
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "users"`).
		WithArgs(sqlmock.AnyArg(), "user@example.com", "password123", "user").
		WillReturnResult(sqlmock.NewResult(3, 1))
	mock.ExpectCommit()

	// ✅ Mock Library Association
	mock.ExpectBegin()
	mock.ExpectExec(`INSERT INTO "user_libraries"`).
		WithArgs(3, 200).
		WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	// ✅ Valid User Registration Test
	requestBody := `{"name": "New User", "email": "user@example.com", "password": "password123", "library_ids": [200]}`
	req, _ := http.NewRequest(http.MethodPost, "/user", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "10") // Simulating Admin's JWT token

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "User registered successfully")

	// ✅ Unauthorized Role Test (Only Admin Can Create Users)
	mock.ExpectQuery(`SELECT \* FROM "users" WHERE id = \$1`).
		WithArgs(20).
		WillReturnRows(sqlmock.NewRows([]string{"id", "role"}).AddRow(20, "user"))

	requestBody = `{"name": "Another User", "email": "another@example.com", "password": "password123", "library_ids": [200]}`
	req, _ = http.NewRequest(http.MethodPost, "/user", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("userID", "20") // Simulating Non-Admin User

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "Only admins can create users")
}
