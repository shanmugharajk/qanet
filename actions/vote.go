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
const SELF_VOTE_ERROR = "Can't your own post"
const ALREADY_POSTED = "Already submitted"
const INVALID_VOTE = "Invalid vote"

type points struct {
	author int
	voter  int
	post   int
}

// VoteHandler handles all the post votes routes and updates the
// vote for the points and user points.
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
	case models.AcceptAnswer:
		if err = acceptAnswer(tx, newVote, post, voter); err != nil {
			return getErrorResponse(err.Error())
		}
		break
	default:
		return getErrorResponse(INVALID_VOTE)
	}

	// TODO: get the updated the post points.
	return models.VoteResponse{Vote: post.TotalVote(), Result: "SUCCESS"}
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

	return UpdateVoteDetails(tx, newVote, []models.VoteType{newVote.Vote, -1})
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

	return UpdateVoteDetails(tx, newVote, []models.VoteType{newVote.Vote, 1})
}

func acceptAnswer(tx *gorm.DB, newVote *models.Vote, post models.Post, voter *models.User) error {
	var err error
	question := new(models.Question)

	if err = models.GetById(tx, post.QuestionId(), question); err != nil {
		return errors.New(models.ERROR_IN_FETCHING)
	}

	if question.CreatedBy != voter.ID {
		return errors.New(ACCEPT_ANSWER_NOT_ELIGIBLE)
	}

	var previous *models.Vote

	if previous, err = models.GetVoteDetail(
		tx, newVote.PostID, newVote.VoterID, newVote.PostType, []models.VoteType{0, 5},
	); err != nil {
		return err
	}

	if err = revokePointsForPreviousAcceptedAnswerAuthor(tx, newVote, previous, post); err != nil {
		return err
	}

	points := getPointsForAcceptAnswer(newVote, previous, post)

	if err = updatePoints(tx, points, post, voter.ID); err != nil {
		return err
	}

	if err = models.AcceptTheAnswer(tx, post.PostId(), post.QuestionId()); err != nil {
		return nil
	}

	return UpdateVoteDetails(tx, newVote, []models.VoteType{0, 5})
}

func UpdateVoteDetails(tx *gorm.DB, newVote *models.Vote, toClear []models.VoteType) error {
	var err error

	err = models.DeleteVoteByQuery(tx, newVote.PostID, newVote.VoterID, newVote.PostType, toClear)
	if err != nil {
		return err
	}

	_, err = models.Add(tx, newVote)
	return err
}

func revokePointsForPreviousAcceptedAnswerAuthor(
	tx *gorm.DB, current *models.Vote, previous *models.Vote, post models.Post,
) error {
	if previous == nil || current.Undo || post.Author() == previous.VoterID {
		return nil
	}

	if err := models.UpdateUserPointsById(tx, previous.VoterID, -20); err != nil {
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

func getPost(tx *gorm.DB, id int64, postType models.PostType) (models.Post, error) {
	if postType == models.QuestionPost {
		return models.GetActiveNonClosedQuestionById(tx, id, postType)
	} else {
		return models.GetActiveNonClosedAnswerById(tx, id, postType)
	}
}

func getPointsForUpvote(current *models.Vote, previous *models.Vote) *points {
	points := new(points)

	if previous == nil {
		if current.PostType == models.QuestionPost {
			points.author = 2
		} else {
			points.author = 10
		}
		points.post = 1
	} else if current.Undo {
		if current.PostType == models.QuestionPost {
			points.author = -2
		} else {
			points.author = -10
		}
		points.post = -1
	} else {
		if current.PostType == models.QuestionPost {
			points.author = 4
		} else {
			points.author = 20
		}

		points.voter = 1
		points.post = 2
	}

	return points
}

func getPointsForDownvote(current *models.Vote, previous *models.Vote) *points {
	points := new(points)

	if previous == nil {
		if current.PostType == models.QuestionPost {
			points.author = -2
		} else {
			points.author = -5
		}
		points.post = -1
		points.voter = -1
	} else if current.Undo {
		if current.PostType == models.QuestionPost {
			points.author = 2
		} else {
			points.author = 5
		}
		points.post = 1
		points.voter = 1
	} else {
		if current.PostType == models.QuestionPost {
			points.author = -4
		} else {
			points.author = -20
		}
		points.post = -2
		points.voter = -1
	}

	return points
}

func getPointsForAcceptAnswer(
	current *models.Vote, previous *models.Vote, post models.Post,
) *points {
	points := new(points)

	if previous == nil {
		// Add points if not self accepted answer
		if post.Author() != current.VoterID {
			points.author = 20
		}
	} else if current.Undo {
		// Add points if not self accepted answer
		if post.Author() != current.VoterID {
			points.author = -20
		}
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
		newVote.PostType == models.AnswerPost && newVote.Vote == models.AcceptAnswer {
		return true
	}

	return false
}

func getErrorResponse(errorMessage string) models.VoteResponse {
	return models.VoteResponse{Vote: 0, Result: "ERROR", Message: errorMessage}
}
