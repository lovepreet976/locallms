package middleware

import (
	"fmt"
	"library-management/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware verifies JWT and checks user role
func AuthMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			c.Abort()
			return
		}

		// Ensure "Bearer " prefix is present
		tokenParts := strings.Split(tokenString, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		tokenString = tokenParts[1] // Extract actual token

		// Validate JWT using utils.ValidateJWT
		userID, userRole, err := utils.ValidateJWT(tokenString)
		if err != nil {
			fmt.Println("JWT Validation Error:", err) 
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// If a role is required, check access
		if requiredRole != "" {
			allowedRoles := strings.Split(requiredRole, "|")
			roleAllowed := false
			for _, role := range allowedRoles {
				if userRole == role {
					roleAllowed = true
					break
				}
			}

			if !roleAllowed {
				c.JSON(http.StatusForbidden, gin.H{
					"error":        "Access denied",
					"requiredRole": requiredRole,
					"yourRole":     userRole,
				})
				c.Abort()
				return
			}
		}

		// Store user details in context for later use
		c.Set("userID", userID)
		c.Set("userRole", userRole)
		c.Next()
	}
}