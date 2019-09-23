package services

import (
	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
)

// FetchAllTags fetches all the tags.
func FetchAllTags(tx *gorm.DB) ([]models.Tag, error) {
	var t []models.Tag
	db := tx.Find(&t)
	return t, db.Error
}

// CreateTag creates a new tag.
func CreateTag(tx *gorm.DB, t *models.Tag) (*validate.Errors, error) {
	verrs := t.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	db := tx.Create(t)

	return validate.NewErrors(), db.Error
}

// UpdateTag updates the tag details by id.
func UpdateTag(tx *gorm.DB, t *models.Tag) (*validate.Errors, error) {
	verrs := t.Validate()
	if verrs.HasAny() {
		return verrs, nil
	}

	db := tx.Model(&t).Updates(t)

	return validate.NewErrors(), db.Error
}

// DeleteTag deletes the tag based on passed tagId.
func DeleteTag(tx *gorm.DB, tagID string) error {
	db := tx.Where("id = ?", tagID).Delete(models.Tag{})
	if db.RowsAffected == 0 {
		return errors.New("Couldn't find a record with the id sent")
	}
	return db.Error
}
