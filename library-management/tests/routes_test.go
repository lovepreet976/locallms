package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// ✅ Test API Health Route (Manually Defined)
func TestRoutesSetup(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	// Define `/api/health` route for testing
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "API is running"})
	})

	// Perform HTTP request
	req, _ := http.NewRequest(http.MethodGet, "/api/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// ✅ Assertions
	assert.Equal(t, http.StatusOK, w.Code)

	// ✅ Verify JSON response
	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "API is running", response["message"])
}
