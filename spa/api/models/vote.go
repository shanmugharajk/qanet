package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
)

type VoteType int

const (
	Upvote           VoteType = 1
	Downvote         VoteType = -1
	AcceptAnswerVote VoteType = 5
)

type Vote struct {
	PostID   int64    `json:"postId"`
	VoterID  string   `json:"voterId"`
	Vote     VoteType `json:"vote"`
	PostType PostType `json:"PostType" gorm:"default:1" sql:"default:1"`
	Base

	// Dto purpose
	Undo bool `json:"undo" gorm:"-"`
}

// VoteResponse is the response object for Vote handler.
type VoteResponse struct {
	Vote    int    `json:"vote"`
	Result  string `json:"result"`
	Message string `json:"message"`
}

// Validate - validates the question details.
func (q *Vote) Validate() *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: q.VoterID, Name: "VoterID"},
	)
}
