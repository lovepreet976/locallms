package models

import "gorm.io/gorm"

type Book struct {
	gorm.Model
	ID              uint   `gorm:"primaryKey"`
	ISBN            string `gorm:"not null"`
	Title           string `gorm:"not null"`
	Authors         string
	Publisher       string
	Version         string
	TotalCopies     int
	AvailableCopies int
	LibraryID       uint `gorm:"index"`
}