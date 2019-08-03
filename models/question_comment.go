package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	customvalidators "github.com/shanmugharajk/qanet/models/validators"
)

// QuestionComment is the model for question_comments table.
type QuestionComment struct {
	ID            int64  `json:"id"`
	Comment       string `json:"comments"`
	QuestionID    int64  `json:"questionId"`
	CloseVotes    int    `json:"closeVotes"`
	IsActive      bool   `json:"isActive"`
	DeactivatedBy string `json:"deactivatedBy" gorm:"default:'NULL'" sql:"default:null"`
	CreatedBy     string `json:"createdBy"`
	UpdatedBy     string `json:"updatedBy"`

	Base
}

// Validate - validates the question details.
func (a *QuestionComment) Validate() *validate.Errors {
	return validate.Validate(
		&customvalidators.Int64IsPresent{Field: a.QuestionID, Name: "QuestionId"},
		&validators.StringIsPresent{Field: a.Comment, Name: "Comment"},
	)
}
