package tests

import (
	"encoding/json"
	"library-management/controllers"
	"library-management/models"

	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// ✅ Test CreateLibrary API
func TestCreateLibrary(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/library", controllers.CreateLibrary(TestDB))

	// ✅ Valid Library Creation
	mock.ExpectExec(`INSERT INTO "libraries"`).
		WillReturnResult(sqlmock.NewResult(1, 1))

	requestBody := `{"name": "Central Library", "location": "Downtown"}`
	req, _ := http.NewRequest(http.MethodPost, "/library", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), "Library created successfully")

	// ❌ Invalid Payload (Missing Name)
	requestBody = `{"location": "Downtown"}`
	req, _ = http.NewRequest(http.MethodPost, "/library", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "error")

	// ❌ Database Error
	mock.ExpectExec(`INSERT INTO "libraries"`).
		WillReturnError(assert.AnError)

	req, _ = http.NewRequest(http.MethodPost, "/library", strings.NewReader(requestBody))
	req.Header.Set("Content-Type", "application/json")

	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.Contains(t, w.Body.String(), "Could not create library")
}

// ✅ Test ListLibraries API
func TestListLibraries(t *testing.T) {
	SetupTestDatabase()
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/libraries", controllers.ListLibraries(TestDB))

	// ✅ Fetch Libraries Successfully
	mock.ExpectQuery(`SELECT \* FROM "libraries"`).
		WillReturnRows(sqlmock.NewRows([]string{"id", "name", "location"}).
			AddRow(1, "Central Library", "Downtown").
			AddRow(2, "Westside Library", "West Town"))

	req, _ := http.NewRequest(http.MethodGet, "/libraries", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	var response map[string][]models.Library
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &response))
	assert.Len(t, response["libraries"], 2)

	// ✅ Empty Library List
	mock.ExpectQuery(`SELECT \* FROM "libraries"`).
		WillReturnRows(sqlmock.NewRows([]string{"id", "name", "location"}))

	req, _ = http.NewRequest(http.MethodGet, "/libraries", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"libraries":[]`)

	// ❌ Database Error
	mock.ExpectQuery(`SELECT \* FROM "libraries"`).
		WillReturnError(assert.AnError)

	req, _ = http.NewRequest(http.MethodGet, "/libraries", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	assert.Contains(t, w.Body.String(), "Could not fetch libraries")
}
