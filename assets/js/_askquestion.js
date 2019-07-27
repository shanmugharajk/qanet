import editor from "./_editor";

const id = "#ask-question-editor";

// Quill editor initialization for ask question page.
let askQuestionEditor;

const fetchAskQuestionData = function() {
  const title = $("#ask-question  #title").val();

  const qt = askQuestionEditor.getText();

  $(`${id} > .ql-editor`).removeAttr("contenteditable");

  const questionContent = $(id).html();

  const tags = $("#ask-question #tags").val();

  return { title, questionContent, tags, qt };
};

const validate = function({ title, tags, qt }) {
  let hasError = false;

  if (!title) {
    $("#title-container").addClass("error");
    hasError = true;
  }

  // By default Quill returns an empty line. So checking for '\n'
  if (qt == "\n") {
    $("#ask-question-editor-container").addClass("error");
    $("#ask-question-editor-wrapper").addClass("editor-container-error");
    hasError = true;
  }

  if (!tags) {
    $("#tags-container").addClass("error");
    hasError = true;
  }

  return hasError;
};

// To remove the errors when displayed when clicked
// with the empty empty details.
const onChange = function(e) {
  if (e.target.id == "title") {
    $("#title-container").removeClass("error");
  }

  if (e.target.id == "tags") {
    $("#tags-container").removeClass("error");
  }
};

// On submitting the question.
const onPostYourQuestion = function() {
  const data = fetchAskQuestionData();
  // Setting the question content to hidden field for form post.
  $("#ask-question #questionContent").val(data.questionContent);
  return !validate(data);
};

// Initialization of events needs to be at document load.
const initAskQuestionEditor = function() {
  if ($(id).length <= 0) {
    return;
  }

  askQuestionEditor = editor.getQuilInstance(id);
  askQuestionEditor.on("text-change", function() {
    $("#ask-question-editor-container").removeClass("error");
    $("#ask-question-editor-wrapper").removeClass("editor-container-error");
  });

  $("#ask-question  #title")
    .off("input")
    .on("input", onChange);

  $("#ask-question #tags").change(onChange);
  $("#ask-question").submit(onPostYourQuestion);
};

// Init of various functions after document ready.
export default function init() {
  initAskQuestionEditor();
}
