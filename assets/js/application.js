import initControls from './_controls';
import initAuth from './_authentication';
import initAskQuestion from './_askquestion';
import initQuestionDetail from './_questionDetail';
import initHome from './_home';

$(document).ready(() => {
  initControls();
  initAuth();
  initAskQuestion();
  initQuestionDetail();
  initHome();
});
