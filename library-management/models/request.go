package models

import "gorm.io/gorm"

type RequestEvent struct {
	gorm.Model
	ID           uint   `gorm:"primaryKey"`
	BookID       string `gorm:"not null" json:"isbn"`
	LibraryID    uint   `gorm:"not null" json:"libraryid"`
	ReaderID     uint   `gorm:"not null"` // Reference to User (Reader)
	RequestDate  int64  `gorm:"not null"`
	ApprovalDate *int64 `gorm:"default:null"` // Default -1 (Not yet approved)
	ApproverID   *uint  `gorm:"default:null"` // Default 0 (Not yet approved)
	RequestType  string `gorm:"type:varchar(50);not null;check:request_type IN ('issue', 'return')"`
}
