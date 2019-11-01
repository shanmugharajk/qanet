import React from 'react';
import PostItem from '../../postItem';
import { IQuestionDetail } from '../../../@types';

interface IProps {
  questionDetail: IQuestionDetail;
}

const Question = function(props: IProps) {
  const { questionDetail } = props;

  return <PostItem questionDetail={questionDetail} />;
};

export default Question;
