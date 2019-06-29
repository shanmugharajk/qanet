package models

// QuestionVotersList is the model for question_voters_list table.
type QuestionVotersList struct {
	QuestionID int64  `json:"questionId"`
	VoterID    string `json:"voterId"`
	Vote       int    `json:"vote"`
	Base
}
