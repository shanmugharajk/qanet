package actions

import (
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
)

func HomeHandler(c buffalo.Context) error {
	tx, _ := c.Value("tx").(*gorm.DB)
	results, err := models.GetQuestions(tx, "", "")
	if err != nil {
		return errors.WithStack(err)
	}

	c.Cookies().SetWithExpirationTime("qcursor", results.Cursor, time.Now().Add(30*24*time.Hour))
	c.Set("Questions", results)
	return c.Render(200, r.HTML("questions/index.html"))
}
