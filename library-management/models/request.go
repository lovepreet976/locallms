package models

import "gorm.io/gorm"

type RequestEvent struct {
	gorm.Model
	ID           uint   `gorm:"primaryKey"`
	BookID       string `gorm:"not null" json:"isbn"`
	LibraryID    uint   `gorm:"not null" json:"libraryid"`
	ReaderID     uint   `gorm:"not null"` // Reference to User (Reader)
	RequestDate  int64  `gorm:"not null"`
	ApprovalDate *int64 `gorm:"default:null"` // NULL means not yet approved
	ApproverID   *uint  `gorm:"default:null"` // NULL means not yet approved
	RequestType  string `gorm:"type:varchar(50);not null;check:request_type IN ('issue', 'return')"`
	Status       string `gorm:"type:varchar(20);not null;default:'Pending'" json:"status"` // New field for status
}
