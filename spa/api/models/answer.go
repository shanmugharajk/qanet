package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
	customvalidators "github.com/shanmugharajk/qanet/models/validators"
)

type Answer struct {
	ID            int64  `json:"id"`
	AnswerContent string `json:"answerContent"`
	Votes         int    `json:"votes"`
	CloseVotes    int    `json:"closeVotes"`
	IsClosed      bool   `json:"isClosed"`
	IsActive      bool   `json:"isActive"`
	IsAccepted    bool   `json:"isAccepted"`
	CreatedBy     string `json:"createdBy"`
	UpdatedBy     string `json:"updatedBy"`
	DeactivatedBy string `json:"deactivatedBy" gorm:"default:'NULL'" sql:"default:null"`
	QuestionID    int64  `json:"questionId"`

	Base

	// Associations
	AnswerComments []AnswerComment `json:"comments"`

	// Dto purpose
	AuthorPoints   int `json:"authorPoints" gorm:"-"`
	SelfVote       int `json:"selfVote" gorm:"-"`
	SelfIsAccepted int `json:"selfIsAccepted" gorm:"-"`
}

// Validate - validates the question details.
func (a *Answer) Validate() *validate.Errors {
	return validate.Validate(
		&customvalidators.Int64IsPresent{Field: a.QuestionID, Name: "QuestionId"},
		&validators.StringIsPresent{Field: a.AnswerContent, Name: "AnswerContent"},
	)
}

// Post interface implemenation
func (a *Answer) PostId() int64 {
	return a.ID
}

func (a *Answer) QuestionId() int64 {
	return a.QuestionID
}

func (a *Answer) TotalVote() int {
	return a.Votes
}

func (a *Answer) Author() string {
	return a.CreatedBy
}

func (a *Answer) UpdateVoteById(tx *gorm.DB, points int) error {
	db := tx.Model(Answer{}).
		Where("id = ?", a.ID).
		UpdateColumn("votes", gorm.Expr("votes + ?", points))

	return db.Error
}
