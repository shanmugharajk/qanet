let answerEditor;
const answerEditorId = "#add-answer-editor";

const initEditors = () => {
  answerEditor = QaNet.Editor.getQuilInstance(answerEditorId);
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
  const at = answerEditor.getText();

  $(`${answerEditorId} > .ql-editor.ql-blank`).removeAttr("contenteditable");

  const answerContent = $(answerEditorId).html();

  if (at == "\n") {
    showPostAnswerError();
    return false;
  }

  // Setting the answer content to hidden field for form post.
  $("#answerContent").val(answerContent);
  const elem = $("#post-answer");

  // Show loader
  $("#mini-loader-post-answer").removeClass("d-n");

  // Submitting the form.
  $.ajax({
    type: "POST",
    dataType: "json",
    data: elem.serialize(),
    url: elem.attr("action"),
    success: function() {
      // TODO: Do the animation and add at top if no accpeted answer or
      // at one level below.
      $(`${answerEditorId} > .ql-editor.ql-blank`).attr(
        "contenteditable",
        true
      );
      answerEditor.setText("");
    },
    error: function() {
      $("#mini-loader-post-answer").removeClass("hidden");
    },
    complete: function() {
      $("#mini-loader-post-answer").addClass("d-n");
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
