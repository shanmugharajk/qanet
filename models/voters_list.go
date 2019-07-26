package models

// VotersList is the model for voters_list table.
type VotersList struct {
	ID           int64  `json:"id"`
	VoterID      string `json:"voterId"`
	QuestionID   int64  `json:"questionId" gorm:"default:'NULL'" sql:"default:null"`
	Vote         int    `json:"vote"`
	VoteDetail   string `json:"voteDetail"`
	VoteDetailID int64  `json:"voteDetailId"`
	Base
}

// TableName sets the name as 'voters_list'
func (VotersList) TableName() string {
	return "voters_list"
}
