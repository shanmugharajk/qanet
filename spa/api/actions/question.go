package actions

import (
	"strconv"

	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/spa/api/actions/response"
	"github.com/shanmugharajk/qanet/spa/api/models"
	"github.com/shanmugharajk/qanet/spa/api/services"
)

func AskQuestion(c buffalo.Context) error {
	q := &models.Question{}
	if err := c.Bind(q); err != nil {
		return errors.WithStack(err)
	}

	q.CreatedBy = c.Value("userId").(string)
	q.UpdatedBy = c.Value("userId").(string)

	tx, _ := c.Value("tx").(*gorm.DB)

	verrors, err := services.AddQuestion(tx, q)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	if verrors.HasAny() {
		return c.Render(200, r.JSON(response.Failure(verrors.Error())))
	}

	return c.Render(200, r.JSON(response.Success(q.ID)))
}

// QuestionDetail returns the question with all its details.
// 1ast 5 comments for questions + answers and 1st 5 Answers.
func QuestionDetail(c buffalo.Context) error {
	// Get the DB connection from the context
	tx, _ := c.Value("tx").(*gorm.DB)
	questionID := c.Param("questionID")

	qid, err := strconv.ParseInt(questionID, 10, 64)
	if err != nil {
		return errors.WithStack(err)
	}

	userID := c.Value("userId")

	question, err := services.GetQuestionDetails(tx, userID, qid)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	answers, err := services.GetAnswers(tx, userID, qid, 1, 5)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	res := map[string]interface{}{
		"questionDetail": question,
		"answers":        answers,
	}

	return c.Render(200, r.JSON(response.Success(res)))
}

func GetQuestions(c buffalo.Context) error {
	id, timestamp, err := services.ExtractCursorInfo(c.Param("cursor"))
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	tx, _ := c.Value("tx").(*gorm.DB)
	results, err := services.GetQuestions(tx, id, timestamp)
	if err != nil {
		return c.Render(200, r.JSON(response.Failure(err.Error())))
	}

	return c.Render(200, r.JSON(response.Success(results)))
}
