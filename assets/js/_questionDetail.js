import axios from "axios";

let answerEditor;
const answerEditorId = "#add-answer-editor";

const initEditors = function() {
  answerEditor = QaNet.Editor.getQuilInstance(answerEditorId);
};

const addCommentClick = function (e) {
  e.preventDefault();
  const commentId = $(e.target)
    .parent()
    .attr("id");

  const html = $("#comments-form-tmpl").html();
  $(`#${commentId} .comments-add-form`).append(html);
  $(`#${commentId} .comments-link`).addClass("d-n");
};

const showPostAnswerError = function () {
  $("#error-post-answer").removeClass("hidden");
  $("#error-post-answer")[0].scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
};

const postAnswer = async function(e) {
  e.preventDefault();

  const at = answerEditor.getText();

  $(`${answerEditorId} > .ql-editor.ql-blank`).removeAttr("contenteditable");

  const answerContent = $(answerEditorId).html();

  if (at === "\n") {
    showPostAnswerError();
    return false;
  }

  // Setting the answer content to hidden field for form post.
  $("#answerContent").val(answerContent);
  const elem = $("#post-answer");

  try {
    // Show loader
    $("#mini-loader-post-answer").removeClass("d-n");

    const res = await axios.post(elem.attr("action"), elem.serialize());

    if (res.status > 200) {
      throw Error("Error in posting the data");
    }

    // Remove loader.
    $("#mini-loader-post-answer").addClass("d-n");
    // Reset the editor.
    answerEditor.setText("");

    $("#answers").append(res.data);
  } catch (error) {
    $("#error-post-answer").removeClass("hidden");
  }

  return false;
};

const addEventHandlers = function () {
  $(".comments-link").click(addCommentClick);
  $("#post-answer").submit(postAnswer);
  $("#postYourAnswer").click(() => $("#post-answer").submit());
};

const initQuestionDetail = function () {
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
