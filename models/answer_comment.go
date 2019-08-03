package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	customvalidators "github.com/shanmugharajk/qanet/models/validators"
)

// AnswerComment is the model for answer_comments table.
type AnswerComment struct {
	ID            int64  `json:"id"`
	Comment       string `json:"comment"`
	AnswerID      int64  `json:"answerId"`
	CloseVotes    int    `json:"closeVotes"`
	IsClosed      bool   `json:"isClosed"`
	IsActive      bool   `json:"isActive"`
	DeactivatedBy string `json:"deactivatedBy" gorm:"default:'NULL'" sql:"default:null"`
	CreatedBy     string `json:"createdBy"`
	UpdatedBy     string `json:"updatedBy"`

	Base
}

// Validate - validates the question details.
func (a *AnswerComment) Validate() *validate.Errors {
	return validate.Validate(
		&customvalidators.Int64IsPresent{Field: a.AnswerID, Name: "AnswerId"},
		&validators.StringIsPresent{Field: a.Comment, Name: "Comment"},
	)
}
