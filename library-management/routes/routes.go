package routes

import (
	controllers "library-management/controllers"
	"library-management/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Public routes (No authentication needed)
	auth := r.Group("/auth")
	{
		auth.POST("/login", controllers.Login(db))
	}

	// Protected API routes (needs authentication)
	api := r.Group("/api")
	{
		r.GET("/libraries", controllers.ListLibraries(db))
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "API is running"})
		})

		// Owner-Only Routes
		ownerRoutes := api.Group("", middleware.AuthMiddleware("owner"))
		{
			ownerRoutes.POST("/library", controllers.CreateLibrary(db))  // Owner can create a library
			ownerRoutes.POST("/admin", controllers.RegisterAdmin(db))    // Owner can create Admins
			ownerRoutes.POST("/owner", controllers.RegisterOwnerNew(db)) // Owner can create a new Owner
		}

		// Admin-Only Routes
		adminRoutes := api.Group("", middleware.AuthMiddleware("admin"))
		{

			// Book Management
			adminRoutes.POST("/book", controllers.AddBook(db))            // Admin can add books
			adminRoutes.PUT("/book/:isbn", controllers.UpdateBook(db))    // Admin can update book details (copies, title, etc.)
			adminRoutes.DELETE("/book/:isbn", controllers.RemoveBook(db)) // Admin can remove books

			// Issue Request Management
			adminRoutes.GET("/issues", controllers.ListIssueRequests(db))             // Admin can list issue requests
			adminRoutes.PUT("/issue/approve/:id", controllers.ApproveIssue(db))       // Admin can approve issue requests
			adminRoutes.PUT("/issue/disapprove/:id", controllers.DisapproveIssue(db)) // Admin can disapprove issue requests

			// Issue Books to Users
			adminRoutes.POST("/issue/book/:isbn", controllers.IssueBookToUser(db)) // Admin can issue books to a reader
		}

		api.POST("/user", controllers.RegisterUser(db))
		// User-Only Routes
		userRoutes := api.Group("", middleware.AuthMiddleware("user"))
		{
			// Book Search
			userRoutes.GET("/books/search", controllers.SearchBooks(db)) // Users can search books by title, author, publisher

			// Request a Book
			userRoutes.POST("/issue", controllers.RequestIssue(db)) // Users can request book issues

			userRoutes.GET("/issue/status", controllers.StatusIssue(db))
		}
	}

	return r
}
