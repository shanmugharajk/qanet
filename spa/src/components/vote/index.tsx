import React from 'react';
import VoteContainer from './voteContainer';
import { Upvote, DownVote, PointsText } from '../buttons/vote';

interface IProps {
  votes: number;
}

const Vote = function (props: IProps) {
  return (
    <VoteContainer>
      <Upvote />
      <PointsText>{props.votes}</PointsText>
      <DownVote />
    </VoteContainer>
  )
}


export default Vote;