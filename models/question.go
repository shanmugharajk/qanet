package models

import (
	"time"

	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
)

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
	DeactivatedBy     string    `json:"deactivated_by" gorm:"default:'NULL'" sql:"default:null"`
	Author            string    `json:"author"`
	CreatedBy         string    `json:"createdBy"`
	UpdatedBy         string    `json:"updatedBy"`

	Base

	Tags string `json:"tags" gorm:"-"`
}

// Validate - validates the question details.
func (q *Question) Validate() *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: q.Title, Name: "Title"},
		&validators.StringIsPresent{Field: q.QuestionContent, Name: "QuestionContent"},
		&validators.StringIsPresent{Field: q.Tags, Name: "Tags"},
	)
}
