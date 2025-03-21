package controllers

import (
	"library-management/models"
	"library-management/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var input struct {
			Email    string `json:"email" binding:"required"`
			Password string `json:"password" binding:"required"`
		}

		// Validation of the incoming JSON-data
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var user models.User
		if err := db.Where("email = ? AND deleted_at IS NULL", input.Email).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			}
			return
		}

		// Compare passwords
		if input.Password != user.Password {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		// JWT token generation
		token, err := utils.GenerateJWT(user.ID, user.Role)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
			return
		}

		// Include libraries if the user is not an "owner"
		userResponse := gin.H{
			"role":  user.Role,
			"token": token,
		}

		// Fetch libraries if the user is not an owner
		if user.Role != "owner" {
			// Load user's libraries
			var libraries []models.Library
			if err := db.Model(&user).Association("Library").Find(&libraries); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching libraries"})
				return
			}

			// Construct user response including library data
			userResponse["user"] = gin.H{
				"ID":        user.ID,
				"Name":      user.Name,
				"Email":     user.Email,
				"Contact":   user.Contact,
				"Role":      user.Role,
				"Libraries": libraries, // Include libraries here
			}
		} else {
			// For owners, you can leave it empty or add more relevant data as needed
			userResponse["user"] = gin.H{
				"ID":      user.ID,
				"Name":    user.Name,
				"Email":   user.Email,
				"Contact": user.Contact,
				"Role":    user.Role,
			}
		}

		c.JSON(http.StatusOK, userResponse)
	}
}
