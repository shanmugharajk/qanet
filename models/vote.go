package models

import (
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
	"github.com/jinzhu/gorm"
)

type VoteType int

const (
	Upvote             VoteType = 1
	Downvote           VoteType = -1
	AcceptAnswer       VoteType = 5
	SelfAcceptedAnswer VoteType = 0
)

// Vote is the model for votes table.
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
	Result  string `josn:"result"`
	Message string `json:"message"`
}

// Validate - validates the question details.
func (q *Vote) Validate() *validate.Errors {
	return validate.Validate(
		&validators.StringIsPresent{Field: q.VoterID, Name: "VoterID"},
	)
}

// To write query for fetching answer post with 0 or 5 vote written this
// way to reuse the function. Since at a given point there will only
// a record with 0 or 5. So this query should always return one record.
func GetVoteDetail(
	tx *gorm.DB, postId int64, voterId string, postType PostType, inVotes []VoteType,
) (*Vote, error) {
	voteDetails := []Vote{}

	db := tx.Where(
		`post_id = ? AND voter_id = ? AND post_type = ? AND vote IN (?) `,
		postId, voterId, postType, inVotes,
	)

	db.Find(&voteDetails)

	if len(voteDetails) == 0 {
		return nil, nil
	}

	return &voteDetails[0], db.Error
}

func DeleteVoteByQuery(
	tx *gorm.DB, postId int64, voterId string, postType PostType, inVotes []VoteType,
) error {
	db := tx.Where(
		`post_id = ? AND voter_id = ? AND post_type = ? AND vote IN (?)`,
		postId, voterId, postType, inVotes,
	).Delete(Vote{})

	return db.Error
}
