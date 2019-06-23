package grifts

import (
	"github.com/markbates/grift/grift"
	"github.com/shanmugharajk/qanet/models"
)

func addUsers() error {
	// normal user details
	normalUserRole := models.UserRole{}
	normalUserRole.ID = models.Roles["normal_user"]
	normalUserRole.Name = models.Roles["normal_user"]

	if res := models.GormDB.Create(&normalUserRole); res.Error != nil {
		return res.Error
	}

	// normal user
	user := models.User{}
	user.ID = "user@123"
	user.DisplayName = "normal user"
	user.Email = "email@email.com"
	user.Password = "user@123"
	user.RoleID = normalUserRole.ID
	user.IsActive = true

	if res := models.GormDB.Create(&user); res.Error != nil {
		return res.Error
	}

	// admin user details
	adminUserRole := models.UserRole{}
	adminUserRole.ID = models.Roles["admin_user"]
	adminUserRole.Name = models.Roles["admin_user"]

	if res := models.GormDB.Create(&adminUserRole); res.Error != nil {
		return res.Error
	}

	// admin user
	adminUser := models.User{}
	adminUser.ID = "admin@123"
	adminUser.DisplayName = "admin user"
	adminUser.Email = "admin@email.com"
	adminUser.Password = "admin@123"
	adminUser.RoleID = adminUserRole.ID
	adminUser.IsActive = true

	if res := models.GormDB.Create(&adminUser); res.Error != nil {
		return res.Error
	}

	return nil
}

var _ = grift.Namespace("db", func() {

	grift.Desc("seed", "Seeds a database")
	grift.Add("seed", func(c *grift.Context) error {
		return addUsers()
	})
})
