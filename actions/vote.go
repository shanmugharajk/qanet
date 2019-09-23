package actions

import (
	"strconv"

	"github.com/jinzhu/gorm"
	m "github.com/shanmugharajk/qanet/models"
	"github.com/shanmugharajk/qanet/services"

	"github.com/gobuffalo/buffalo"
	"github.com/pkg/errors"
)

// VoteHandler handles all the post votes routes and updates the
// vote for the points and user points.
func VoteHandler(c buffalo.Context) error {
	paramPostID := c.Param("postID")
	postID, err := strconv.ParseInt(paramPostID, 10, 64)
	if err != nil {
		return errors.WithStack(err)
	}

	paramVote := c.Param("vote")
	vote, err := strconv.Atoi(paramVote)
	if err != nil {
		return errors.WithStack(err)
	}

	userID := c.Value("userId").(string)
	postType := c.Param("postType")
	undo := len(c.Param("undo")) > 0
	tx, _ := c.Value("tx").(*gorm.DB)

	Vote := m.Vote{}
	Vote.PostID = postID
	Vote.IsQuestion = postType == "question"
	Vote.VoterID = userID
	Vote.Vote = vote

	return c.Render(200, r.JSON(services.UpdateVote(tx, Vote, undo)))
}
