import initAnswer from './_answer';
import initComments, { bindCommentsEvents } from './_comments';

const initQuestionDetail = function () {
  if ($('#questionDetail').length <= 0) {
    return;
  }
  initAnswer(bindCommentsEvents);
  initComments();
};

// Init of various functions after document ready.
export default function init() {
  // Inline script init method.
  window.init && window.init();
  initQuestionDetail();
}
