import initUtils from './_utils';
import initControls from './_controls';
import initAuth from './_authentication';
import initAskQuestion from './_askquestion';
import initQuestionDetail from './_questionDetail';
import initHome from './_home';

$(document).ready(() => {
  initUtils();
  initControls();
  initAuth();
  initAskQuestion();
  initQuestionDetail();
  initHome();
});
