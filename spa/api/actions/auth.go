package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/actions/response"
	"github.com/shanmugharajk/qanet/spa/api/models"
	"github.com/shanmugharajk/qanet/spa/api/services"
)

func SignInHandler(c buffalo.Context) error {
	u := new(models.User)
	if err := c.Bind(u); err != nil {
		return errors.WithStack(err)
	}

	tx, _ := c.Value("tx").(*gorm.DB)

	existingUser, err := services.LoginUser(tx, u)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	res := map[string]string{
		"token":    existingUser.Token,
		"userId":   existingUser.ID,
		"userName": existingUser.DisplayName,
	}
	return c.Render(200, r.JSON(response.Success(res)))
}
