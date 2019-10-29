package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/spa/api/actions/response"
	"github.com/shanmugharajk/qanet/spa/api/services"
)

func GetAllTagHandler(c buffalo.Context) error {
	tx, _ := c.Value("tx").(*gorm.DB)

	tags, err := services.GetAllTags(tx)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	return c.Render(200, r.JSON(response.Success(tags)))
}
