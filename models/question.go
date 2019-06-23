package models

import "time"

// Question is the model for questions table.
type Question struct {
	ID                int64     `json:"id"`
	Title             string    `json:"title"`
	TitleSearch       string    `json:"-" gorm:"type:tsvector;column:title_search"`
	QuestionContent   string    `json:"questionContent"`
	Votes             int       `json:"votes"`
	CloseVotes        int       `josn:"closeVotes"`
	BountyPoints      int       `json:"bountyPoints"`
	BountyExpiryDate  time.Time `json:"bountyExpiryDate"`
	IsActive          bool      `json:"isActive"`
	IsClosed          bool      `json:"isClosed"`
	IsReopenRequested bool      `json:"isReopenRequested"`
	DeactivatedBy     string    `json:"deactivated_by"`
	Author            string    `json:"author"`
	CreatedBy         string    `json:"createdBy"`
	UpdatedBy         string    `json:"updatedBy"`

	Base
}
