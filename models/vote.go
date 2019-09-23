package models

// Vote is the model for votes table.
type Vote struct {
	PostID     int64  `json:"postId"`
	VoterID    string `json:"voterId"`
	Vote       int    `json:"vote"`
	IsQuestion bool   `json:"isQuestion" gorm:"default:false" sql:"default:0"`
	Base
}
