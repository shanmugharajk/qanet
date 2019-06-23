import utils from "./utils";

// QaNet.{template name}
QaNet.ask = QaNet.ask || {};

// Quill editor initialization for ask question page.
let askQuestionEditor;

const initAskQuestionEditor = () => {
  const id = "#ask-question-editor";
  if ($(id).length > 0) {
    askQuestionEditor = utils.getQuilInstance(id);
  }
};

const fetchAskQuestionData = () => {
  const title = $("#ask-question #title");
};

QaNet.ask.onPostYourQuestion = () => {
  fetchAskQuestionData();
};

// Init of various functions after document ready.
export default function init() {
  initAskQuestionEditor();
}
