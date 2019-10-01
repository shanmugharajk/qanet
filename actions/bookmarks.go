package actions

import (
	"strconv"

	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/models"

	"github.com/gobuffalo/buffalo"
	"github.com/pkg/errors"
)

func UpdateBookmark(c buffalo.Context) error {
	var err error
	var postID int64

	paramPostID := c.Param("postID")
	postID, err = strconv.ParseInt(paramPostID, 10, 64)
	if err != nil {
		return errors.WithStack(err)
	}

	tx, _ := c.Value("tx").(*gorm.DB)
	userID := c.Value("userId").(string)

	var rows int64

	if c.Request().Method == "POST" {
		rows, err = models.AddBookmark(tx, userID, postID)
	} else {
		rows, err = models.DeleteBookmark(tx, userID, postID)
	}

	if err != nil {
		return errors.WithStack(err)
	}

	return c.Render(200, r.String(strconv.FormatInt(rows, 10)))
}
