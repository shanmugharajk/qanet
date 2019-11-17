import React from 'react';
import { useImmerReducer } from 'use-immer';
import { Header } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Answers from './answers/index';
import DetailContainer from './container';
import Question from './question';
import reducer, { IState } from './reducer';
import actions from './actions';
import { ICustomContext } from '../../../@types';

const initialState: IState = {
  answers: [],
  questionDetail: {},
  loading: true,
  error: ''
};

interface IProps extends ICustomContext {}

const QuestionDetail = function(props: IProps) {
  const { userInfo } = props;
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
          <Question questionDetail={state.questionDetail} userInfo={userInfo} />
          <Answers answers={state.answers} userInfo={userInfo} />
        </>
      )}
    </DetailContainer>
  );
};

export default QuestionDetail;
