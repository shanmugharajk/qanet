import React from 'react';
import Menus from './menus';
import style from './style';
import FlexContainer from '../../flexConatiner';
import PostRenderer from '../../postRenderer';
import TagsList from '../../tagsList';
import Vote from '../../vote';
import UserCardInfo from '../../userCardInfo/index';
import Comments from '../../comments';
import { IQuestionDetail, IUserInfo } from '../../../@types';
import { QUESTION } from '../../vote/index';

interface IProps {
  questionDetail: IQuestionDetail;
  userInfo: IUserInfo;
}

const Question = function(props: IProps) {
  const { questionDetail, userInfo } = props;
  const {
    votes,
    bookmarks,
    askedAt,
    createdBy,
    authorPoints,
    comments
  } = questionDetail;

  return (
    <FlexContainer css={style}>
      <Vote votes={votes} type={QUESTION} bookmarks={bookmarks} />
      <div>
        <PostRenderer content={questionDetail.questionContent} />
        <TagsList
          tags={questionDetail.questionTags}
          style={{ marginTop: 15 }}
        />
        <FlexContainer className="bottom-row">
          <Menus />
          <UserCardInfo
            askedAt={askedAt}
            createdBy={createdBy}
            authorPoints={authorPoints}
          />
        </FlexContainer>
        <Comments comments={comments} currentUserInfo={userInfo} />
      </div>
    </FlexContainer>
  );
};

export default React.memo(Question);
