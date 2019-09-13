package models

// VotersList is the model for voters_list table.
type VotersList struct {
	PostID  int64  `json:"postId"`
	VoterID string `json:"voterId"`
	Vote    int    `json:"vote"`
	Base
}

// TableName sets the name as 'voters_list'
func (VotersList) TableName() string {
	return "voters_list"
}
