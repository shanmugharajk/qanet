import React from 'react';
import ItemContainer from './itemContainer';
import VoteContainer from './voteContainer';
import PostRenderer from '../postRenderer';
import { Upvote, DownVote, PointsText } from '../buttons/vote';
import { IQuestionDetail } from '../../@types';

interface IProps {
  questionDetail: IQuestionDetail;
}

const PostItem = function(props: IProps) {
  const { questionDetail } = props;
  const { votes } = questionDetail;

  return (
    <ItemContainer>
      <VoteContainer>
        <Upvote />
        <PointsText>{votes}</PointsText>
        <DownVote />
      </VoteContainer>
      <PostRenderer content={questionDetail.questionContent} />
    </ItemContainer>
  );
};

export default PostItem;
