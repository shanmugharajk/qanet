import React from 'react';
import { useImmer } from 'use-immer';
import { Header, Message, Container } from 'semantic-ui-react';
import QuestionListItem from './item';
import style from './style';
import endpoints from '../../../../shared/endpoints';
import { IQuestionsApiData, IQuestionDetail } from '../../../@types';
import { getReq } from '../../../lib/customAxios';

interface IState extends IQuestionsApiData {
  loading?: boolean;
  error?: string;
}

const initialState: IState = {
  loading: true,
  totalRecords: 0,
  totalPage: 0,
  nextPage: 0,
  prevPage: 0,
  pageNum: 0,
  recordsPerPage: 0,
  cursor: '',
  records: []
};

const getQuestions = async function(
  setState: (f: (draft: IState) => void | IState) => void,
  cursor?: string
) {
  setState(draft => {
    draft.error = '';
    draft.loading = true;
  });

  const res = await getReq(endpoints.getQuestions(cursor));

  if (res.error) {
    setState(draft => {
      draft.error = res.error;
      draft.loading = false;
    });
  } else {
    setState(draft => {
      const data = res.data as IQuestionsApiData;
      draft.totalRecords = data.totalRecords;
      draft.totalPage = data.totalPage;
      draft.nextPage = data.nextPage;
      draft.prevPage = data.prevPage;
      draft.pageNum = data.pageNum;
      draft.recordsPerPage = data.recordsPerPage;
      draft.cursor = data.cursor;
      draft.records.push(...data.records);
      draft.loading = false;
    });
  }
};

const QuestionsList = function() {
  const [state, setState] = useImmer<IState>(initialState);

  React.useEffect(() => {
    getQuestions(setState, state.cursor);
  }, []);

  return (
    <section css={style}>
      <Container>
        <Header as="h4">Questions</Header>
        {state.records.length === 0 && state.loading && (
          <strong>Loading...</strong>
        )}
        {state.records.length === 0 && !state.loading && (
          <Message info>Sorry, no posts are available.</Message>
        )}
        {state.records.map((questionDetail: IQuestionDetail) => (
          <QuestionListItem
            key={questionDetail.id}
            questionDetail={questionDetail}
          />
        ))}
      </Container>
    </section>
  );
};

export default QuestionsList;
