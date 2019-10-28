import React from 'react';
import { PageContext } from '../../@types';
import auth from '../../lib/auth';

const AskQuestionPage = function() {
  return <div>ask question</div>;
};

AskQuestionPage.getInitialProps = async function(ctx: PageContext) {
  auth(ctx, '/questions/ask');
  return {};
};

export default AskQuestionPage;
