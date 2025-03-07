package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"not null"`
	Email    string `gorm:"unique;not null"`
	Contact  string
	Role     string    `gorm:"type:varchar(50);check:role IN ('owner', 'admin', 'user')"`
	Password string    `gorm:"not null"`
	Library  []Library `gorm:"many2many:UserLibrary;"`
}
