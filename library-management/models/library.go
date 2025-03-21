package models

type Library struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"unique;not null"`
}