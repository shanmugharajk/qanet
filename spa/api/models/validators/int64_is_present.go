package validators

import (
	"fmt"

	"github.com/gobuffalo/validate"
)

// Int64IsPresent is the structure for validating Int64 values.
type Int64IsPresent struct {
	Name    string
	Field   int64
	Message string
}

// IsValid adds an error if the field equals 0.
func (v *Int64IsPresent) IsValid(errors *validate.Errors) {
	if v.Field != 0 {
		return
	}

	if len(v.Message) > 0 {
		errors.Add(v.Name, v.Message)
		return
	}

	errors.Add(v.Name, fmt.Sprintf("%s can not be blank.", v.Name))
}
