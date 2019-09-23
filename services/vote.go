package services

import (
	"github.com/jinzhu/gorm"
	m "github.com/shanmugharajk/qanet/models"
)

// VoteResponse is the response object for Vote handler.
type VoteResponse struct {
	Vote    int    `json:"vote"`
	Result  string `josn:"result"`
	Message string `json:"message"`
}

// UpdateVote updates the post vote, user points accordingly.
func UpdateVote(tx *gorm.DB, newVote m.Vote, undo bool) VoteResponse {
	// TODO: Place holder for now
	return VoteResponse{}
}
