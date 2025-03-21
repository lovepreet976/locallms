package models

import "gorm.io/gorm"

type IssueRegistry struct {
	gorm.Model
	ISBN               string `gorm:"not null" json:"isbn"`
	ReaderID           uint   `gorm:"not null" json:"reader_id"`
	IssueApproverID    uint   `gorm:"not null" json:"issue_approver_id"`
	IssueStatus        string `gorm:"type:varchar(50);not null" json:"issue_status"`
	IssueDate          int64  `gorm:"not null" json:"issue_date"`
	ExpectedReturnDate int64  `gorm:"not null" json:"expected_return_date"`
	ReturnDate         int64  `gorm:"default:0" json:"return_date"`
	ReturnApproverID   uint   `gorm:"default:0" json:"return_approver_id"`
}