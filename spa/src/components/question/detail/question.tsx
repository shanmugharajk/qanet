import React from 'react';
import Menus from './menus';
import style from './style';
import FlexContainer from '../../flexConatiner';
import PostRenderer from '../../postRenderer';
import TagsList from '../../tagsList';
import Vote from '../../vote';
import { IQuestionDetail } from '../../../@types';

interface IProps {
  questionDetail: IQuestionDetail;
}

const Question = function(props: IProps) {
  const { questionDetail } = props;
  const { votes } = questionDetail;

  return (
    <FlexContainer css={style}>
      <Vote votes={votes} />
      <div>
        <PostRenderer content={questionDetail.questionContent} />
        <TagsList
          tags={questionDetail.questionTags}
          style={{ marginTop: 15 }}
        />
        <FlexContainer>
          <Menus />
        </FlexContainer>
      </div>
    </FlexContainer>
  );
};

export default Question;
