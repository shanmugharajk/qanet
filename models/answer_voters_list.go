package models

// AnswerVotersList is the model for the answer_voters_list table.
type AnswerVotersList struct {
	AnswerID int64  `json:"AnswerId"`
	VoterID  string `json:"voterId"`
	Vote     int    `json:"vote"`
	Base
}
