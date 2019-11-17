import { IQuestionDetails, IAction } from '../../../@types';

export const SET_QUESTION_DETAIL = 'SET_QUESTION_DETAIL';
export const SET_ERROR = 'SET_ERROR';
export const IS_LOADING = 'IS_LOADING';

export interface IState extends IQuestionDetails {
  loading: boolean;
  error?: string;
}

export default function(draft: IState, action: IAction<any>) {
  const { type, payload } = action;

  switch (type) {
    case IS_LOADING:
      draft.loading = payload;
      break;

    case SET_ERROR:
      draft.loading = false;
      draft.error = payload;
      break;

    case SET_QUESTION_DETAIL:
      draft.loading = false;
      draft.questionDetail = payload.questionDetail;
      draft.answers = payload.answers;
      break;

    default:
      break;
  }
}
