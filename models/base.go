package models

import "time"

// Base model for all model structs.
type Base struct {
	UpdatedAt time.Time `json:"-"`
	CreatedAt time.Time `json:"-"`
}
