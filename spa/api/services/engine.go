package services

import (
	"math"

	"github.com/gobuffalo/validate"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"

	// This is required here for Gorm.
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type QaNetModel interface {
	Validate() *validate.Errors
}

type Pagination struct {
	TotalRecords   int64       `json:"totalRecords"`
	TotalPage      int         `json:"totalPage"`
	NextPage       int         `json:"nextPage"`
	PrevPage       int         `json:"prevPage"`
	Records        interface{} `json:"records"`
	PageNum        int         `json:"pageNum"`
	RecordsPerPage int         `json:"recordsPerPage"`
	Cursor         string      `json:"cursor"`
}

type PaginationParam struct {
	Query          *gorm.DB
	PageNum        int
	RecordsPerPage int
	Result         interface{}
	Offset         bool
}

func Paginate(p *PaginationParam) (*Pagination, error) {
	var totalRecords int64

	if db := p.Query.Model(p.Result).Count(&totalRecords); db.Error != nil {
		return nil, db.Error
	}

	if p.PageNum < 1 {
		p.PageNum = 1
	}

	if p.RecordsPerPage == 0 {
		p.RecordsPerPage = 20
	}

	totalPage := int(math.Ceil(float64(totalRecords) / float64(p.RecordsPerPage)))

	var offset int
	var paginator Pagination

	if p.PageNum == 1 {
		offset = 0
	} else {
		offset = (paginator.PageNum - 1) * p.RecordsPerPage
	}

	if p.PageNum <= totalPage {
		if p.Offset {
			p.Query.Limit(p.RecordsPerPage).Offset(offset).Find(p.Result)
		} else {
			p.Query.Limit(p.RecordsPerPage).Find(p.Result)
		}
	}

	paginator.TotalRecords = totalRecords
	paginator.RecordsPerPage = p.RecordsPerPage
	paginator.TotalPage = totalPage
	paginator.Records = p.Result
	paginator.PageNum = p.PageNum

	// TODO: refactor this
	if totalPage == 0 {
		if p.PageNum > 1 {
			paginator.PrevPage = p.PageNum - 1
		} else {
			paginator.PrevPage = p.PageNum
		}

		paginator.NextPage = p.PageNum
	} else {
		if p.PageNum > 1 {
			paginator.PrevPage = p.PageNum - 1
		} else {
			paginator.PrevPage = p.PageNum
		}

		if p.PageNum == paginator.TotalPage {
			paginator.NextPage = p.PageNum
		} else {
			paginator.NextPage = p.PageNum + 1
		}
	}

	return &paginator, nil
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
