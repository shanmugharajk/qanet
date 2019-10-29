package services

import (
	"github.com/jinzhu/gorm"
	"github.com/shanmugharajk/qanet/spa/api/models"
)

func GetAllTags(tx *gorm.DB) ([]*models.Tag, error) {
	var t []*models.Tag
	db := tx.Find(&t)
	return t, db.Error
}
