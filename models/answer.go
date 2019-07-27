package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	customvalidators "github.com/shanmugharajk/qanet/models/validators"
)

// Answers is the model for answers table
type Answers struct {
	ID            int64  `json:"id"`
	AnswerContent string `json:"answerContent"`
	Votes         int    `json:"votes"`
	CloseVotes    int    `json:"closeVotes"`
	IsClosed      bool   `json:"isClosed"`
	IsActive      bool   `json:"isActive"`
	IsAccepted    bool   `json:"isAccepted"`
	Author        string `json:"author"`
	CreatedBy     string `json:"createdBy"`
	UpdatedBy     string `json:"updatedBy"`
	DeactivatedBy string `json:"deactivatedBy" gorm:"default:'NULL'" sql:"default:null"`
	QuestionID    int64  `json:"questionId"`

	Base

	// Associations
	AnswerComments []AnswerComments `json:"comments"`

	// Dto purpose
	AuthorPoints int `json:"authorPoints" gorm:"-"`
	SelfVote     int `json:"selfVote" gorm:"-"`
}

// Validate - validates the question details.
func (a *Answers) Validate() *validate.Errors {
	return validate.Validate(
		&customvalidators.Int64IsPresent{Field: a.QuestionID, Name: "QuestionId"},
		&validators.StringIsPresent{Field: a.AnswerContent, Name: "AnswerContent"},
	)
}
