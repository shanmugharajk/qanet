import { IAction } from '../../../@types';
import { SET_QUESTION_DETAIL, IS_LOADING, SET_ERROR } from './reducer';
import { getReq } from '../../../lib/customAxios';
import endpoints from '../../../../shared/endpoints';

export default {
  fetchQuestionDetail: async function(
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
  }
};
