import initControls from "./controls";
import initAuth from "./authentication";
import initAskQuestion from "./askquestion";

$(document).ready(function() {
  initControls();
  initAuth();
  initAskQuestion();
});
