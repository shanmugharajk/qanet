import React from 'react';
import { useImmerReducer } from 'use-immer';
import { Header } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import DetailContainer from './container';
import Question from './question';
import { IAction } from '../../../@types';
import reducer, {
  IState,
  SET_QUESTION_DETAIL,
  IS_LOADING,
  SET_ERROR
} from './reducer';
import { getReq } from '../../../lib/customAxios';
import endpoints from '../../../../shared/endpoints';

interface IProps {
  error?: string;
}

const initialState: IState = {
  answers: [],
  questionDetail: {},
  loading: true
};

const fetchQuestionDetail = async function(
  qid: string,
  dispatch: React.Dispatch<IAction<{}>>
) {
  dispatch({ type: IS_LOADING, payload: true });
  const url = endpoints.questionDetail(qid);
  const res = await getReq(url);
  if (res.error) {
    dispatch({ type: SET_ERROR, payload: res.data });
  } else {
    dispatch({ type: SET_QUESTION_DETAIL, payload: res.data });
  }
};

const QuestionDetail = function(props: IProps) {
  const router = useRouter();
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  React.useEffect(() => {
    fetchQuestionDetail(router.query.qid as string, dispatch);
  }, []);

  return (
    <DetailContainer>
      <Header as="h3" dividing>
        {state.questionDetail.title}
      </Header>
      <Question questionDetail={state.questionDetail} />
    </DetailContainer>
  );
};

export default QuestionDetail;
