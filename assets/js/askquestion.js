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

QaNet.ask.onPostYourQuestion = () => {
  console.log("hey shan");
};

// Init of various functions after document ready.
export default function init() {
  initAskQuestionEditor();
}
