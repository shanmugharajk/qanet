package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/actions/response"
	"github.com/shanmugharajk/qanet/spa/api/models"
	"github.com/shanmugharajk/qanet/spa/api/services"
)

func AskQuestion(c buffalo.Context) error {
	q := &models.Question{}
	if err := c.Bind(q); err != nil {
		return errors.WithStack(err)
	}

	q.CreatedBy = c.Value("userId").(string)
	q.UpdatedBy = c.Value("userId").(string)

	tx, _ := c.Value("tx").(*gorm.DB)

	verrors, err := services.AddQuestion(tx, q)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	if verrors.HasAny() {
		return c.Render(200, r.JSON(response.Failure(verrors.Error())))
	}

	return c.Render(401, r.JSON(response.Success(q.ID)))
}
