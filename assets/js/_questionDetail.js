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

const addCommentClick = e => {
  e.preventDefault();
  const commentId = $(e.target)
    .parent()
    .attr("id");
  const html = $("#comments-form-tmpl").html();
  $(`#${commentId} .comments-add-form`).append(html);
  $(`#${commentId} .comments-link`).addClass("d-n");
};

const addEventHandlers = () => {
  $(".comments-link").click(addCommentClick);
};

const initQuestionDetail = () => {
  if ($("#questionDetail").length <= 0) {
    return;
  }
  addEventHandlers();
  initEditors();
};

// Init of various functions after document ready.
export default function init() {
  // Inline script init method.
  window.init && window.init();
  initQuestionDetail();
}
