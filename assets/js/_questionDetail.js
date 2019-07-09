const editorInstances = {};
const answerEditorId = "#add-answer-editor";

const initEditors = () => {
  const { questionDetail } = QaNet;

  editorInstances[questionDetail.id] = QaNet.Editor.getQuilInstance(
    `#${questionDetail.id}`,
    true
  );

  editorInstances[questionDetail.id].setContents(
    JSON.parse(questionDetail.questionContent)
  );

  const answerEditor = QaNet.Editor.getQuilInstance(answerEditorId);
  editorInstances[answerEditorId] = answerEditor;
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

const showPostAnswerError = () => {
  $("#error-post-answer").removeClass("hidden");
  $("#error-post-answer")[0].scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
};

const postAnswer = e => {
  const editor = editorInstances[answerEditorId];
  const at = editor.getText();
  const ac = editor.getContents();
  const answerContent = JSON.stringify(ac);

  if (at == "\n") {
    showPostAnswerError();
    return false;
  }

  // Setting the answer content to hidden field for form post.
  $("#answerContent").val(answerContent);
  const elem = $("post-answer").removeClass("d-n");

  // Show loader
  $("#mini-loader-post-answer").removeClass("d-n");

  // Submitting the form.
  $.ajax({
    type: "POST",
    dataType: "json",
    data: elem.serialize(),
    url: elem.attr("action"),
    success: function() {
      // TODO: ?
    },
    error: function() {
      // TODO: Show error.
    },
    complete: function() {
      // Hide spinner
    }
  });

  return false;
};

const addEventHandlers = () => {
  $(".comments-link").click(addCommentClick);
  $("#post-answer").submit(postAnswer);
  $("#postYourAnswer").click(() => $("#post-answer").submit());
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
