import initControls from "./_controls";
import initAuth from "./_authentication";
import initAskQuestion from "./_askquestion";

$(document).ready(function() {
  initControls();
  initAuth();
  initAskQuestion();
});
