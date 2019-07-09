package models

// VotersList is the model for voters_list table.
type VotersList struct {
	ID      int64  `json:"id"`
	VoterID string `json:"voterId"`
	Vote    int    `json:"vote"`
	Base
}
