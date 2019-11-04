import React from 'react';
import { css } from 'styled-components';
import TagsList from '../../tagsList';
import { IQuestionDetail } from '../../../@types/index';
import UserInfo from './userInfo';

interface IProps {
  questionDetail: IQuestionDetail;
}

const QuestionListItem = function(props: IProps) {
  const { questionDetail } = props;
  let cls = '';

  if (questionDetail.hasAcceptedAnswer) {
    cls = 'accepted';
  } else if (questionDetail.totalAnswers > 0) {
    cls = 'has-answers';
  }

  return (
    <div className="list-item">
      <div className="left-container">
        <div className="vote">
          <span className="count">{questionDetail.votes}</span>
          <span className="text">Votes</span>
        </div>

        <div className={`answers ${cls}`}>
          <span className="count">{questionDetail.totalAnswers}</span>
          <span className="text">Answers</span>
        </div>
      </div>

      <div className="right-container">
        <h5>
          <a className="question-link" href={`/questions/${questionDetail.id}`}>
            {questionDetail.title}
          </a>
        </h5>

        <div>
          <TagsList className="tags" tags={questionDetail.questionTags} />
          <UserInfo
            userId={questionDetail.updatedBy}
            points={questionDetail.authorPoints}
            modifiedAt={questionDetail.modifiedAt}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionListItem;
