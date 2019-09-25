package models

import (
	"log"

	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"

	// This is required here for Gorm.
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// DB is a connection to your database to be used
// throughout your application.
var DB *pop.Connection

// DbConnection is a gorm orm instance.
var DbConnection *gorm.DB

type QaNetModel interface {
	Validate() *validate.Errors
}

func init() {
	var err error
	env := envy.Get("GO_ENV", "development")
	DB, err = pop.Connect(env)

	if err != nil {
		log.Fatal(err)
	}

	deets := DB.Dialect.Details()

	DbConnection, err = gorm.Open(deets.Dialect, DB.URL())

	if err != nil {
		log.Fatal(err)
	}

	DbConnection = DbConnection.LogMode(true)
}

func DeleteByID(tx *gorm.DB, id interface{}, model interface{}) error {
	db := tx.Where("id = ?", id).Delete(model)

	if db.Error != nil {
		return db.Error
	}

	if db.RowsAffected == 0 {
		return errors.New("the id passed is invalid")
	}

	return nil
}
