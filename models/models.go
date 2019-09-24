package models

import (
	"log"

	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"

	// This is required here for Gorm.
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type GormDB struct {
	*gorm.DB
}

// DbConnection is a gorm orm instance.
var DbConnection GormDB

type QaNetModel interface {
	Validate() *validate.Errors
}

func init() {
	env := envy.Get("GO_ENV", "development")
	DB, err := pop.Connect(env)

	if err != nil {
		log.Fatal(err)
	}

	deets := DB.Dialect.Details()

	conn, err := gorm.Open(deets.Dialect, DB.URL())
	DbConnection = GormDB{conn}

	if err != nil {
		log.Fatal(err)
	}

	conn = DbConnection.LogMode(true)
	DbConnection = GormDB{conn}
}
