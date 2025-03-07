package routes

import (
	controllers "library-management/controllers"
	"library-management/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	// Public routes (No authentication required)
	auth := r.Group("/auth")
	{
		auth.POST("/login", controllers.Login(db))
	}

	// Protected API routes (Require authentication)
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
			adminRoutes.POST("/user", controllers.RegisterUser(db))

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

		// User-Only Routes
		userRoutes := api.Group("", middleware.AuthMiddleware("user"))
		{
			// Book Search
			userRoutes.GET("/books/search", controllers.SearchBooks(db)) // Users can search books by title, author, publisher

			// Request a Book
			userRoutes.POST("/issue", controllers.RequestIssue(db)) // Users can request book issues
		}
	}

	return r
}
