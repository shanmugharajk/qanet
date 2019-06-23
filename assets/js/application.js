import initControls from "./_controls";
import initAuth from "./_authentication";
import initAskQuestion from "./_askquestion";
import initPosts from "./_posts";

$(document).ready(function() {
  initControls();
  initAuth();
  initAskQuestion();
  initPosts();
});
