package models

import "time"

// Base model for all model structs.
type Base struct {
	UpdatedAt time.Time `json:"updatedAt"`
	CreatedAt time.Time `json:"createdAt"`
}
