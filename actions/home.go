package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/services"
)

// HomeHandler is a default handler to serve up
// a home page.
func HomeHandler(c buffalo.Context) error {
	tx, _ := c.Value("tx").(*gorm.DB)
	questions, err := services.GetQuestions(tx)
	if err != nil {
		return errors.WithStack(err)
	}
	c.Set("Questions", questions)
	return c.Render(200, r.HTML("questions/index.html"))
}
