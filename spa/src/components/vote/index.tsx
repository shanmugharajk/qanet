import React from 'react';
import VoteContainer from './voteContainer';
import { Upvote, DownVote, PointsText } from '../buttons/vote';
import Bookmark from '../buttons/bookmark';

type PostType = string;

export const QUESTION: PostType = 'QUESTION';
export const ANSWER: PostType = 'ANSWER';

interface IProps {
  votes: number;
  type: PostType;
  bookmarks?: number;
}

const Vote = function(props: IProps) {
  const { votes, type, bookmarks } = props;

  return (
    <VoteContainer>
      <Upvote />
      <PointsText>{votes}</PointsText>
      <DownVote />
      {type === QUESTION && (
        <Bookmark bookmarks={parseInt((bookmarks || '0').toString())} />
      )}
    </VoteContainer>
  );
};

export default Vote;
