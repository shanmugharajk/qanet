package actions

import (
	"strconv"

	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
)

const UPVOTE_NOT_ELIGIBLE = "You need minimum 15 votes to upvote a post"
const ERROR_IN_UPDATING = "Got an error in updating points"
const ACCEPT_ANSWER_NOT_ELIGIBLE = "You are not eligible to accept this answer"
const SELF_VOTE_ERROR = "Can't vote your own post"
const ALREADY_POSTED = "Already submitted"
const INVALID_VOTE = "Invalid vote"

type points struct {
	author int
	voter  int
	post   int
}

func VoteHandler(c buffalo.Context) error {
	paramPostId := c.Param("postID")
	postId, err := strconv.ParseInt(paramPostId, 10, 64)
	if err != nil {
		return c.Render(200, r.JSON(getErrorResponse(models.ERROR_IN_FETCHING)))
	}

	paramVoteStr := c.Param("vote")
	paramVote, err := strconv.Atoi(paramVoteStr)
	if err != nil {
		return c.Render(200, r.JSON(getErrorResponse(models.ERROR_IN_FETCHING)))
	}

	userId := c.Value("userId").(string)
	postType := c.Param("postType")
	tx, _ := c.Value("tx").(*gorm.DB)

	voteDetails := new(models.Vote)
	voteDetails.PostID = postId
	voteDetails.VoterID = userId
	voteDetails.Vote = models.VoteType(paramVote)
	voteDetails.Undo = len(c.Param("undo")) > 0
	if postType == "question" {
		voteDetails.PostType = 1
	}

	// TODO: Check the error and abort the transaction
	return c.Render(200, r.JSON(updateVote(tx, voteDetails)))
}

func updateVote(tx *gorm.DB, newVote *models.Vote) models.VoteResponse {
	var post models.Post
	var err error

	if post, err = validateVote(tx, newVote); err != nil {
		return getErrorResponse(err.Error())
	}

	// Fetch voter details
	voter := new(models.User)

	if err = models.GetById(tx, newVote.VoterID, voter); err != nil {
		return getErrorResponse(models.ERROR_IN_FETCHING)
	}

	switch newVote.Vote {
	case models.Upvote:
		if err = upvote(tx, newVote, post, voter); err != nil {
			return getErrorResponse(err.Error())
		}
		break
	case models.Downvote:
		if err = downvote(tx, newVote, post, voter); err != nil {
			return getErrorResponse(err.Error())
		}
		break
	case models.AcceptAnswerVote:
		if err = acceptAnswer(tx, newVote, post, voter); err != nil {
			return getErrorResponse(err.Error())
		}
		break
	default:
		return getErrorResponse(INVALID_VOTE)
	}

	return getPostVotes(tx, post.PostId(), newVote.PostType)
}

func upvote(tx *gorm.DB, newVote *models.Vote, post models.Post, voter *models.User) error {
	var err error
	var previous *models.Vote

	if previous, err = models.GetVoteDetail(
		tx, newVote.PostID, newVote.VoterID, newVote.PostType, []models.VoteType{-1},
	); err != nil {
		return err
	}

	points := getPointsForUpvote(newVote, previous)
	requiredPoints := 15

	if points.voter == 1 {
		requiredPoints = 14
	}

	if voter.Points < requiredPoints {
		return errors.New(UPVOTE_NOT_ELIGIBLE)
	}

	// Updates post, voter, author points
	if err = updatePoints(tx, points, post, voter.ID); err != nil {
		return err
	}

	return updateVoteDetails(tx, newVote, []models.VoteType{newVote.Vote, -1})
}

func downvote(tx *gorm.DB, newVote *models.Vote, post models.Post, voter *models.User) error {
	var err error
	var previous *models.Vote

	if previous, err = models.GetVoteDetail(
		tx, newVote.PostID, newVote.VoterID, newVote.PostType, []models.VoteType{1},
	); err != nil {
		return err
	}

	points := getPointsForDownvote(newVote, previous)

	if voter.Points < 150 {
		return errors.New(UPVOTE_NOT_ELIGIBLE)
	}

	// Updates post, voter, author points
	if err = updatePoints(tx, points, post, voter.ID); err != nil {
		return err
	}

	return updateVoteDetails(tx, newVote, []models.VoteType{newVote.Vote, 1})
}

func acceptAnswer(tx *gorm.DB, vote *models.Vote, post models.Post, voter *models.User) error {
	var err error

	if err = canAcceptAnswer(tx, post.QuestionId(), voter.ID); err != nil {
		return err
	}

	var prevVote *models.Vote
	var prevAnswer *models.Answer

	prevVote, prevAnswer, err = getPreviousAcceptedAnswerAndVote(tx, post.QuestionId(), vote)
	if err != nil {
		return err
	}
	// Special case for accepted answer since updatePoints didn't handle the below case.
	if err = revokePointsForPreviousAcceptedAnswerAuthor(tx, vote, prevVote, prevAnswer); err != nil {
		return err
	}

	if vote.Undo {
		if post.Author() != vote.VoterID {
			if err = models.UpdateUserPointsById(tx, post.Author(), -20); err != nil {
				return errors.New(ERROR_IN_UPDATING)
			}
		}

		if err = models.UndoAcceptedAnswer(tx, post.PostId(), post.QuestionId()); err != nil {
			return errors.New(ERROR_IN_UPDATING)
		}

		err = deleteVoteDetail(tx, vote.PostID, vote.VoterID, vote.PostType, vote.Vote)
		if err != nil {
			return errors.New(ERROR_IN_UPDATING)
		}
	} else {
		if post.Author() != vote.VoterID {
			if err = models.UpdateUserPointsById(tx, post.Author(), 20); err != nil {
				return errors.New(ERROR_IN_UPDATING)
			}
		}

		if err = models.AcceptAnswer(tx, post.PostId(), post.QuestionId()); err != nil {
			return errors.New(ERROR_IN_UPDATING)
		}
	}

	if prevVote != nil {
		err = deleteVoteDetail(tx, prevVote.PostID, prevVote.VoterID, prevVote.PostType, prevVote.Vote)
		if err != nil {
			return errors.New(ERROR_IN_UPDATING)
		}
	}

	if !vote.Undo {
		_, err = models.Add(tx, vote)
	}

	return err
}

func deleteVoteDetail(
	tx *gorm.DB, postId int64, voterId string, postType models.PostType, vote models.VoteType,
) error {
	db := tx.Where(
		`post_id = ? AND voter_id = ? AND post_type = ? AND vote IN (?)`,
		postId, voterId, postType, vote,
	).Delete(models.Vote{})

	return db.Error
}

func canAcceptAnswer(tx *gorm.DB, questionId int64, voterId string) error {
	question := new(models.Question)
	if err := models.GetById(tx, questionId, question); err != nil {
		return errors.New(models.ERROR_IN_FETCHING)
	}
	if question.CreatedBy != voterId {
		return errors.New(ACCEPT_ANSWER_NOT_ELIGIBLE)
	}
	return nil
}

func getPreviousAcceptedAnswerAndVote(
	tx *gorm.DB, questionId int64, newVote *models.Vote,
) (previVote *models.Vote, prevAnswer *models.Answer, err error) {
	prevAnswer, err = models.GetPreviousAcceptedAnswer(tx, questionId)

	if err != nil {
		err = errors.New(models.ERROR_IN_FETCHING)
		return
	}

	if prevAnswer == nil {
		return
	}

	previVote, err = models.GetVoteDetail(
		tx, prevAnswer.ID, newVote.VoterID, newVote.PostType, []models.VoteType{0, 5},
	)

	return
}

func updateVoteDetails(tx *gorm.DB, newVote *models.Vote, votesToClear []models.VoteType) error {
	var err error

	db := tx.Where(
		`post_id = ? AND voter_id = ? AND post_type = ? AND vote IN (?)`,
		newVote.PostID, newVote.VoterID, newVote.PostType, votesToClear,
	).Delete(models.Vote{})

	if db.Error != nil {
		return db.Error
	}

	if !newVote.Undo {
		_, err = models.Add(tx, newVote)
	}

	return err
}

func revokePointsForPreviousAcceptedAnswerAuthor(
	tx *gorm.DB, current *models.Vote, previous *models.Vote, prevPost models.Post,
) error {
	if previous == nil || current.Undo || prevPost.Author() == previous.VoterID {
		return nil
	}

	if err := models.UpdateUserPointsById(tx, prevPost.Author(), -20); err != nil {
		return errors.New(ERROR_IN_UPDATING)
	}

	return nil
}

func updatePoints(tx *gorm.DB, points *points, post models.Post, voterId string) error {
	if err := post.UpdateVoteById(tx, points.post); err != nil {
		return errors.New(ERROR_IN_UPDATING)
	}

	// Save author points
	if err := models.UpdateUserPointsById(tx, post.Author(), points.author); err != nil {
		return errors.New(ERROR_IN_UPDATING)
	}

	// Save voter points
	if err := models.UpdateUserPointsById(tx, voterId, points.voter); err != nil {
		return errors.New(ERROR_IN_UPDATING)
	}

	return nil
}

func getPostVotes(tx *gorm.DB, postId int64, postType models.PostType) models.VoteResponse {
	post, err := getPost(tx, postId, postType)
	if err != nil {
		return getErrorResponse(ERROR_IN_UPDATING)
	}
	return models.VoteResponse{Vote: post.TotalVote(), Result: "SUCCESS"}
}

func getPost(tx *gorm.DB, id int64, postType models.PostType) (models.Post, error) {
	if postType == models.QuestionPost {
		return models.GetActiveNonClosedQuestionById(tx, id, postType)
	} else {
		return models.GetActiveNonClosedAnswerById(tx, id, postType)
	}
}

func getPointsForUpvote(current *models.Vote, previous *models.Vote) *points {
	points := new(points)

	if current.Undo {
		if current.PostType == models.QuestionPost {
			points.author = -2
		} else {
			points.author = -10
		}
		points.post = -1

		return points
	}

	if previous == nil {
		if current.PostType == models.QuestionPost {
			points.author = 2
		} else {
			points.author = 10
		}
		points.post = 1
	} else {
		if current.PostType == models.QuestionPost {
			points.author = 4
		} else {
			points.author = 15
		}

		points.voter = 1
		points.post = 2
	}

	return points
}

func getPointsForDownvote(current *models.Vote, previous *models.Vote) *points {
	points := new(points)

	if current.Undo {
		if current.PostType == models.QuestionPost {
			points.author = 2
		} else {
			points.author = 5
		}
		points.post = 1
		points.voter = 1

		return points
	}

	if previous == nil {
		if current.PostType == models.QuestionPost {
			points.author = -2
		} else {
			points.author = -5
		}
		points.post = -1
		points.voter = -1
	} else {
		if current.PostType == models.QuestionPost {
			points.author = -4
		} else {
			points.author = -15
		}
		points.post = -2
		points.voter = -1
	}

	return points
}

func validateVote(tx *gorm.DB, newVote *models.Vote) (models.Post, error) {
	var existing *models.Vote
	var post models.Post
	var err error

	if existing, err = models.GetVoteDetail(
		tx, newVote.PostID, newVote.VoterID, newVote.PostType, []models.VoteType{newVote.Vote},
	); err != nil {
		return nil, errors.New(models.ERROR_IN_FETCHING)
	}

	// If exists and not an undo operation then throw error
	if existing != nil && !newVote.Undo {
		return nil, errors.New(ALREADY_POSTED)
	}

	// Trying to undo where there is no vote already
	if existing == nil && newVote.Undo {
		return nil, errors.New(INVALID_VOTE)
	}

	if post, err = getPost(tx, newVote.PostID, newVote.PostType); err != nil {
		return nil, errors.New(err.Error())
	}

	if isValid := isVoteValid(newVote, post.Author()); !isValid {
		return nil, errors.New(SELF_VOTE_ERROR)
	}

	return post, nil
}

func isVoteValid(newVote *models.Vote, postAuthor string) bool {
	// Self vote possiblities are
	// 1. Accepting own answer
	// 2. Undo own accepted answer
	if newVote.VoterID != postAuthor ||
		newVote.PostType == models.AnswerPost && newVote.Undo ||
		newVote.PostType == models.AnswerPost && newVote.Vote == models.AcceptAnswerVote {
		return true
	}

	return false
}

func getErrorResponse(errorMessage string) models.VoteResponse {
	return models.VoteResponse{Vote: 0, Result: "ERROR", Message: errorMessage}
}
