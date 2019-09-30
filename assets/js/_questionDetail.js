import initAnswer from './_answer';
import initComments, { bindCommentsEvents } from './_comments';
import initBookmark from './_bookmarks';
import initVote, { bindVoteEvents } from './_vote';

const initQuestionDetail = function () {
  if ($('#questionDetail').length <= 0) {
    return;
  }
  initAnswer(bindCommentsEvents, bindVoteEvents);
  initComments();
  initBookmark();
  initVote();
};

// Init of various functions after document ready.
export default function init() {
  // Inline script init method.
  window.init && window.init();
  initQuestionDetail();
}
