import React from 'react';
import { useImmerReducer } from 'use-immer';
import { Header } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import DetailContainer from './container';
import Question from './question';
import reducer, { IState } from './reducer';
import actions from './actions';

const initialState: IState = {
  answers: [],
  questionDetail: {},
  loading: true,
  error: ''
};

const QuestionDetail = function () {
  const router = useRouter();
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  React.useEffect(() => {
    actions.fetchQuestionDetail(router.query.qid as string, dispatch);
  }, []);

  return (
    <DetailContainer>
      {/* TODO: refactor this */}
      {!state.loading && (
        <>
          <Header as="h3" dividing>
            {state.questionDetail.title}
          </Header>
          <Question questionDetail={state.questionDetail} />
        </>
      )}
    </DetailContainer>
  );
};

export default QuestionDetail;
