package models

import "github.com/jinzhu/gorm"

type PostType int

const (
	QuestionPost = 1
	AnswerPost   = 0
)

type Post interface {
	PostId() int64
	QuestionId() int64
	TotalVote() int
	Author() string
	UpdateVoteById(tx *gorm.DB, points int) error
}
