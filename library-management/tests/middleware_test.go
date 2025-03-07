package tests

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// ✅ Mock Auth Middleware with Role Validation
func mockAuthMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")

		if token == "Bearer valid_token" {
			// Simulate extracting user role from token (hardcoded for test)
			userRole := "user"
			if requiredRole != "" && userRole != requiredRole {
				c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
				c.Abort()
				return
			}
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
		}
	}
}

// ✅ Test Valid Token
func TestAuthMiddlewareValidToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.Use(mockAuthMiddleware("user"))
	r.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Success"})
	})

	req, _ := http.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer valid_token")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

// ✅ Test Unauthorized Access (Invalid Token)
func TestAuthMiddlewareInvalidToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.Use(mockAuthMiddleware("user"))
	r.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Success"})
	})

	req, _ := http.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer invalid_token")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Unauthorized")
}

// ✅ Test Missing Token
func TestAuthMiddlewareNoToken(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.Use(mockAuthMiddleware("user"))
	r.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Success"})
	})

	req, _ := http.NewRequest(http.MethodGet, "/protected", nil)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Unauthorized")
}

// ✅ Test Role Restriction (Forbidden Access)
func TestAuthMiddlewareForbiddenRole(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.Use(mockAuthMiddleware("admin")) // Requires admin role
	r.GET("/admin-only", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Success"})
	})

	req, _ := http.NewRequest(http.MethodGet, "/admin-only", nil)
	req.Header.Set("Authorization", "Bearer valid_token") // Simulated "user" role

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "Forbidden")
}
