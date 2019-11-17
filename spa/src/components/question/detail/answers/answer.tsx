import React from 'react';
import style from '../style';
import FlexContainer from '../../../flexConatiner/index';
import Menus from '../menus';
import PostRenderer from '../../../postRenderer';
import UserCardInfo from '../../../userCardInfo';
import Comments from '../../../comments';
import { IAnswer, IUserInfo } from '../../../../@types';
import Vote, { ANSWER } from '../../../vote';

interface IProps {
  answer: IAnswer;
  userInfo: IUserInfo;
}

export default function Answer(props: IProps) {
  const { answer, userInfo } = props;
  const {
    votes,
    answerContent,
    createdAt,
    createdBy,
    authorPoints,
    comments
  } = answer;

  return (
    <FlexContainer css={style}>
      <Vote votes={votes} type={ANSWER} />
      <div>
        <PostRenderer content={answerContent} />
        <FlexContainer className="bottom-row">
          <Menus />
          <UserCardInfo
            askedAt={createdAt}
            createdBy={createdBy}
            authorPoints={authorPoints}
          />
        </FlexContainer>
        <Comments comments={comments} currentUserInfo={userInfo} />
      </div>
    </FlexContainer>
  );
}
