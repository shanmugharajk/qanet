import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import endpoints from '../../../../shared/endpoints';
import { IQuestionDetails } from '../../../@types';
import { getReq } from '../../../lib/customAxios';

export interface IState extends IQuestionDetails {
  loading: boolean;
  error?: string;
}

const defaultState: IState = {
  answers: [],
  questionDetail: {},
  loading: true,
  error: ''
};

function useQuestion(initialState: IState = defaultState) {
  const [state, updateState] = useImmer(initialState);

  const loadQuestionDetail = async function(qid: string) {
    updateState(draft => {
      draft.loading = true;
    });

    const url = endpoints.questionDetail(qid);
    const res = await getReq(url);

    if (res.error) {
      updateState(draft => {
        draft.loading = false;
        draft.error = res.data;
      });
    } else {
      updateState(draft => {
        draft.loading = false;
        draft.questionDetail = res.data.questionDetail;
        draft.answers = res.data.answers;
      });
    }
  };

  return { state, loadQuestionDetail };
}

const QuestionState = createContainer(useQuestion);

export default QuestionState;
