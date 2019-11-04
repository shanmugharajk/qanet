package services

import (
	"strings"

	"github.com/pkg/errors"
)

func ExtractCursorInfo(cursor string) (string, string, error) {
	if len(cursor) == 0 {
		return "", "", nil
	}

	cursorInfos := strings.Split(cursor, "_")

	if len(cursorInfos) != 2 {
		return "", "", errors.New("Invalid cursor")
	}

	id := cursorInfos[0]
	timeStamp := cursorInfos[1]

	return id, timeStamp, nil
}
