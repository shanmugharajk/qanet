const editorInstances = {};

const initEditors = () => {
  const { questionDetail } = QaNet;

  editorInstances[questionDetail.id] = QaNet.Editor.getQuilInstance(
    `#${questionDetail.id}`,
    true
  );

  editorInstances[questionDetail.id].setContents(
    JSON.parse(questionDetail.questionContent)
  );
};

const initQuestionDetail = () => {
  if ($("#questionDetail").length <= 0) {
    return;
  }
  initEditors();
};

// Init of various functions after document ready.
export default function init() {
  // Inline script init method.
  window.init && window.init();
  initQuestionDetail();
}
