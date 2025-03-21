package models

type UserLibrary struct {
	UserID    uint `gorm:"primaryKey"`
	LibraryID uint `gorm:"primaryKey"`
}