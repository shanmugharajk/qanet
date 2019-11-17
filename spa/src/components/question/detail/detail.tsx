import React from 'react';
import { Header } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import QuestionState from '../state';
import Answers from './answers/index';
import DetailContainer from './container';
import Question from './question';
import { ICustomContext } from '../../../@types';

interface IProps extends ICustomContext {}

const QuestionDetail = function(props: IProps) {
  const { userInfo } = props;
  const router = useRouter();
  const questionState = QuestionState.useContainer();
  const { state, loadQuestionDetail } = questionState;

  React.useEffect(() => {
    loadQuestionDetail(router.query.qid as string);
  }, []);

  return (
    <DetailContainer>
      {state.loading && <strong>Loading...</strong>}
      {!state.loading && (
        <>
          <Header as="h3" dividing>
            {state.questionDetail.title}
          </Header>
          <Question questionDetail={state.questionDetail} userInfo={userInfo} />
          <Answers answers={state.answers} userInfo={userInfo} />
        </>
      )}
    </DetailContainer>
  );
};

export default QuestionDetail;
