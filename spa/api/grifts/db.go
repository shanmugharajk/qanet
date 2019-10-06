package grifts

import (
	"fmt"

	"github.com/markbates/grift/grift"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/models"
	"golang.org/x/crypto/bcrypt"
)

var adminUserID = "admin@123"

func addUsers() error {
	// normal user details
	normalUserRole := models.UserRole{}
	normalUserRole.ID = models.GetRole(models.NormalUser)
	normalUserRole.Name = "Normal user"

	if res := models.DbConnection.Create(&normalUserRole); res.Error != nil {
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
	user.Points = 200
	ph, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.WithStack(err)
	}
	user.PasswordHash = string(ph)

	if res := models.DbConnection.Create(&user); res.Error != nil {
		return res.Error
	}

	// admin user details
	adminUserRole := models.UserRole{}
	adminUserRole.ID = models.GetRole(models.AdminUser)
	adminUserRole.Name = "Admin user"

	if res := models.DbConnection.Create(&adminUserRole); res.Error != nil {
		return res.Error
	}

	// admin user
	adminUser := models.User{}
	adminUser.ID = adminUserID
	adminUser.DisplayName = "admin user"
	adminUser.Email = "admin@email.com"
	adminUser.Password = "admin@123"
	adminUser.RoleID = adminUserRole.ID
	adminUser.IsActive = true
	adminUser.Points = 200
	aph, err := bcrypt.GenerateFromPassword([]byte(adminUser.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.WithStack(err)
	}
	adminUser.PasswordHash = string(aph)

	if res := models.DbConnection.Create(&adminUser); res.Error != nil {
		return res.Error
	}

	return nil
}

func addTags() error {
	csharp := models.Tag{}
	csharp.ID = "csharp"
	csharp.Description = "csharp"
	csharp.CreatedBy = adminUserID
	csharp.UpdatedBy = adminUserID

	if res := models.DbConnection.Create(&csharp); res.Error != nil {
		return res.Error
	}

	golang := models.Tag{}
	golang.ID = "golang"
	golang.Description = "golang"
	golang.CreatedBy = adminUserID
	golang.UpdatedBy = adminUserID

	if res := models.DbConnection.Create(&golang); res.Error != nil {
		return res.Error
	}

	return nil
}

var _ = grift.Namespace("db", func() {

	err := grift.Desc("seed", "Seeds a database")

	fmt.Println(err)

	err = grift.Add("seed", func(c *grift.Context) error {
		if err := addUsers(); err != nil {
			return errors.WithStack(err)
		}

		if err := addTags(); err != nil {
			return errors.WithStack(err)
		}

		return nil
	})

	fmt.Println(err)
})
