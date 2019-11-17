import React from 'react';
import QuestionState from '../state';
import QuestionDetail from './detail';
import { ICustomContext } from '../../../@types';

interface IProps extends ICustomContext {}

const QuestionDetailContainer = function(props: IProps) {
  return (
    <QuestionState.Provider>
      <QuestionDetail {...props} />
    </QuestionState.Provider>
  );
};

export default QuestionDetailContainer;
