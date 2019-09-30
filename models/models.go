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

func Add(tx *gorm.DB, model QaNetModel) (*validate.Errors, error) {
	verrs := model.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	if db := tx.Create(model); db.Error != nil {
		return validate.NewErrors(), db.Error
	}

	return validate.NewErrors(), nil
}

func UpdateById(tx *gorm.DB, id interface{}, model interface{}) (int64, error) {
	db := tx.Model(model).Update(model).Where("id = ?", id)

	if db.Error != nil {
		return 0, db.Error
	}

	return db.RowsAffected, nil
}

func GetCountById(tx *gorm.DB, id interface{}, model interface{}) (int64, error) {
	var count int64
	var db *gorm.DB

	db = tx.Model(model).Where("id = ?", id).Count(&count)

	if db.Error != nil {
		return count, db.Error
	}

	return count, nil
}

func GetById(tx *gorm.DB, id interface{}, out interface{}) error {
	db := tx.Where("id = ?", id).First(out)

	if db.Error != nil {
		return db.Error
	}

	return nil
}

func DeleteById(tx *gorm.DB, id interface{}, model interface{}) error {
	db := tx.Where("id = ?", id).Delete(model)

	if db.Error != nil {
		return db.Error
	}

	if db.RowsAffected == 0 {
		return errors.New("no matching id found")
	}

	return nil
}
