package actions

import (
	"strconv"

	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/services"

	"github.com/gobuffalo/buffalo"
	"github.com/pkg/errors"
)

// UpdateBookmark adds the post to the bookmark.
func UpdateBookmark(c buffalo.Context) error {
	paramPostID := c.Param("postID")
	postID, err := strconv.ParseInt(paramPostID, 10, 64)
	if err != nil {
		return errors.WithStack(err)
	}

	tx, _ := c.Value("tx").(*gorm.DB)
	userID := c.Value("userId").(string)

	var rows int64
	var err2 error

	if c.Request().Method == "POST" {
		rows, err2 = services.AddBookmark(tx, userID, postID)
	} else {
		rows, err2 = services.DeleteBookmark(tx, userID, postID)
	}

	if err2 != nil {
		return errors.WithStack(err)
	}

	return c.Render(200, r.String(strconv.FormatInt(rows, 10)))
}
