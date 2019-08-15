import axios from 'axios';

let answerEditor;
const answerEditorId = '#add-answer-editor';

const initEditor = function() {
  answerEditor = QaNet.Editor.getQuilInstance(answerEditorId);
  return answerEditor;
};

const showPostAnswerError = function() {
  $('#error-post-comment').removeClass('hidden');
  $('#error-post-comment')[0].scrollIntoView({
    behavior: 'smooth',
    block: 'end'
  });
};

const postAnswer = async function(e) {
  e.preventDefault();

  const at = answerEditor.getText();

  answerEditor.enable(false);

  const answerContent = $(answerEditorId).html();

  if (at === '\n') {
    showPostAnswerError();
    return false;
  }

  // Setting the answer content to hidden field for form post.
  $('#answerContent').val(answerContent);
  const elem = $('#post-answer');

  try {
    // Show loader
    $('#mini-loader-post-answer').removeClass('d-n');

    const res = await axios.post(elem.attr('action'), elem.serialize());

    if (res.status > 200) {
      throw Error('Error in posting the data');
    }

    // Reset the editor.
    answerEditor.setText('');

    // Append the result to the answers.
    $('#answers')
      .append(res.data)
      .removeClass('d-n');
  } catch (error) {
    $('#error-post-comment').removeClass('hidden');
  } finally {
    $('#mini-loader-post-answer').addClass('d-n');
    answerEditor.enable();
  }
};

export default function init() {
  $('#post-answer').submit(postAnswer);
  $('#postYourAnswer').click(() => $('#post-answer').submit());
  initEditor();
}
