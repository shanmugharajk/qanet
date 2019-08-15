package services

import (
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
)

// DeleteByID deletes the matching record by id
func DeleteByID(tx *gorm.DB, model interface{}) error {
	db := tx.Delete(model)

	if db.Error != nil {
		return db.Error
	}

	if db.RowsAffected == 0 {
		return errors.New("the id passed is invalid")
	}

	return nil
}
