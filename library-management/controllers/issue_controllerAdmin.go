package controllers

import (
	"library-management/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ListIssueRequests retrieves all issue requests for admin's libraries
func ListIssueRequests(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		adminID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized request"})
			return
		}

		var adminLibraryIDs []uint
		if err := db.Table("user_libraries").Where("user_id = ?", adminID).Pluck("library_id", &adminLibraryIDs).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch admin libraries"})
			return
		}

		if len(adminLibraryIDs) == 0 {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin is not associated with any library"})
			return
		}

		var requests []models.RequestEvent
		if err := db.
			Joins("JOIN books ON request_events.book_id = books.isbn").
			Where("books.library_id IN (?)", adminLibraryIDs).
			Find(&requests).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch issue requests"})
			return
		}

		formattedRequests := make([]gin.H, len(requests))
		for i, request := range requests {
			formattedRequests[i] = gin.H{
				"id":            request.ID,
				"book_id":       request.BookID,
				"user_id":       request.ReaderID,
				"request_type":  request.RequestType,
				"status":        request.Status,
				"request_date":  request.RequestDate,
				"approval_date": request.ApprovalDate,
				"approver_id":   request.ApproverID,
			}
		}
		c.JSON(http.StatusOK, gin.H{"requests": formattedRequests})
	}
}

// ApproveIssue allows an admin to approve a book issue request
func ApproveIssue(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.Param("id")
		var request models.RequestEvent

		if err := db.First(&request, requestID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Issue request not found"})
			return
		}

		adminID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized request"})
			return
		}

		if request.Status != "Pending" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request is already processed"})
			return
		}

		now := time.Now().Unix()
		request.ApprovalDate = &now
		request.ApproverID = new(uint)
		*request.ApproverID = adminID.(uint)
		request.Status = "Approved"

		if err := db.Save(&request).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not approve request"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Issue request approved", "status": request.Status})
	}
}

// DisapproveIssue allows an admin to reject an issue request
func DisapproveIssue(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.Param("id")
		var request models.RequestEvent

		if err := db.First(&request, requestID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Issue request not found"})
			return
		}

		if request.Status != "Pending" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request is already processed"})
			return
		}

		request.Status = "Disapproved" // ✅ Update Status instead of deleting

		if err := db.Save(&request).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not disapprove request"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Issue request disapproved", "status": request.Status})
	}
}

// 📚 Issue a book to a user (Prevents re-issuing)
func IssueBookToUser(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		isbn := c.Param("isbn")

		adminID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized request"})
			return
		}

		var input struct {
			UserID    uint `json:"user_id"`
			LibraryID uint `json:"library_id"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
			return
		}

		var book models.Book
		if err := db.Where("isbn = ? AND library_id = ?", isbn, input.LibraryID).First(&book).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found in this library"})
			return
		}

		if book.AvailableCopies == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No available copies to issue"})
			return
		}

		// ✅ Check if the book has already been issued
		var existingIssue models.IssueRegistry
		if err := db.Where("isbn = ? AND reader_id = ?", isbn, input.UserID).First(&existingIssue).Error; err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "This book has already been issued to the user"})
			return
		}

		// ✅ Reduce available copies
		book.AvailableCopies--
		db.Save(&book)

		issueDate := time.Now()
		expectedReturnDate := issueDate.AddDate(0, 0, 14)

		issueRecord := models.IssueRegistry{
			ISBN:               isbn,
			ReaderID:           input.UserID,
			IssueApproverID:    adminID.(uint),
			IssueStatus:        "Issued",
			IssueDate:          issueDate.Unix(),
			ExpectedReturnDate: expectedReturnDate.Unix(),
			ReturnDate:         0,
			ReturnApproverID:   0,
		}

		if err := db.Create(&issueRecord).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not issue book"})
			return
		}

		// ✅ Update RequestEvent status to "Issued"
		db.Model(&models.RequestEvent{}).
			Where("book_id = ? AND reader_id = ?", isbn, input.UserID).
			Update("status", "Issued")

		c.JSON(http.StatusOK, gin.H{"message": "Book issued successfully"})
	}
}
