import React from 'react';
import ErrorPage from '../_error';
import { PageContext, ITag } from '../../@types';
import auth from '../../lib/auth';
import NewQuestion from '../../components/question/new';
import endpoints from '../../../shared/endpoints';
import { successCode } from '../../../shared/messages';
import customAxios from '../../lib/customAxios';

interface IProps {
  tags: ITag[];
  error?: string;
}

const AskQuestionPage = function(props: IProps) {
  if (props.error) {
    return <ErrorPage />;
  }

  return <NewQuestion tags={props.tags} />;
};

AskQuestionPage.getInitialProps = async function(
  ctx: PageContext
): Promise<IProps> {
  auth(ctx, '/questions/ask');

  let props: any = {};

  try {
    const res = await customAxios.get(endpoints.tags);
    const resData = res.data;

    if (resData.code === successCode) {
      props.tags = resData.data;
    } else {
      props.error = 'Error in loading the page.';
    }
  } catch (error) {
    props.error = 'Error in loading the page.';
  }

  return props;
};

export default AskQuestionPage;
