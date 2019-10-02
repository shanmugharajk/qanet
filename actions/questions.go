package actions

import (
	"strconv"
	"strings"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/jinzhu/gorm"
	"github.com/pkg/errors"
	"github.com/shanmugharajk/qanet/models"
)

func AskQuestionIndex(c buffalo.Context) error {
	tx, _ := c.Value("tx").(*gorm.DB)

	tags, err := models.GetAllTags(tx)
	if err != nil {
		return err
	}

	c.Set("tags", tags)

	return c.Render(200, r.HTML("questions/ask.html"))
}

func AskQuestion(c buffalo.Context) error {
	q := &models.Question{}
	if err := c.Bind(q); err != nil {
		return errors.WithStack(err)
	}

	q.CreatedBy = c.Value("userId").(string)
	q.UpdatedBy = c.Value("userId").(string)

	tx, _ := c.Value("tx").(*gorm.DB)

	verrors, err := models.AddQuestion(tx, q)
	if err != nil {
		return errors.WithStack(err)
	}

	if verrors.HasAny() {
		c.Set("question", q)
		c.Set("verrors", verrors)
		return c.Render(200, r.HTML("questions/ask.html"))
	}

	return c.Redirect(302, "/questions/"+strconv.FormatInt(q.ID, 10))
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

	// TODO: Record not found excpetion.
	question, err := models.GetQuestionDetails(tx, userID, qid)
	if err != nil {
		return errors.WithStack(err)
	}

	answers, err := models.GetAnswers(tx, userID, qid, 1, 5)
	if err != nil {
		return errors.WithStack(err)
	}

	c.Set("Question", question)
	c.Set("Answers", answers)
	return c.Render(200, r.HTML("questions/detail.html"))
}

func GetQuestions(c buffalo.Context) error {
	id, timestamp, err := extractCursorInfo(c)
	if err != nil {
		return c.Render(500, r.String(err.Error()))
	}

	tx, _ := c.Value("tx").(*gorm.DB)
	results, err := models.GetQuestions(tx, id, timestamp)
	if err != nil {
		return errors.WithStack(err)
	}

	c.Cookies().SetWithExpirationTime("qcursor", results.Cursor, time.Now().Add(30*24*time.Hour))
	c.Set("Questions", results)
	return c.Render(200, r.Template("text/html", "questions/_questions.html"))
}

func extractCursorInfo(c buffalo.Context) (string, string, error) {
	qcursor, err := c.Cookies().Get("qcursor")

	if err != nil {
		return "", "", errors.New("Invalid cursor")
	}

	if len(qcursor) == 0 {
		return "", "", nil
	}

	cursorInfos := strings.Split(qcursor, "_")

	if len(cursorInfos) != 2 {
		return "", "", errors.New("Invalid cursor")
	}

	id := cursorInfos[0]
	timeStamp := cursorInfos[1]

	return id, timeStamp, nil
}
