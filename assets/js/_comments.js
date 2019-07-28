import axios from 'axios';

const showAddCommentForm = function(e) {
  e.preventDefault();
  const commentId = $(e.target)
    .parent()
    .attr('id');
  $(`#${commentId} .comments-link`).addClass('d-n');
  $(`#${commentId} .add-comments-form`).removeClass('d-n');
};

const saveComment = async function(e) {
  e.preventDefault();

  const elem = $(this);
  const data = elem.serialize();
  const comment = elem.find('textarea').val();

  if (comment.length < 11) {
    elem.find('#error-post-answer').removeClass('hidden');
    elem.find('#error-post-answer p').html('Please enter min 10 characters');
    return;
  }

  try {
    elem.find('#loader').removeClass('d-n');

    const res = await axios.post(
      `/posts/comments/${elem.attr('data-post-id')}`,
      data
    );

    if (res.status > 200) {
      throw Error('Error in posting the data');
    }

    // Hide the form
    elem.addClass('d-n');
    // Reset the textarea where comment is entered.
    elem.find('textarea[name="Comment"').val('');
    // Show the add comment link button
    elem
      .parent()
      .find('.comments-link')
      .removeClass('d-n');
    // Append the result to the comment lists
    elem
      .parent()
      .find('div')
      .first()
      .append(res.data);
  } catch (error) {
    elem.find('#error-post-answer').removeClass('hidden');
  } finally {
    elem.find('#loader').addClass('d-n');
  }
};

const cancelCommentClick = function(e) {
  e.preventDefault();

  const elem = $(this).parent();

  elem.addClass('d-n');
  elem.find('textarea').val('');
  elem.find('#error-post-answer').addClass('hidden');
  elem
    .parent()
    .find('.comments-link')
    .removeClass('d-n');
};

// Init of various functions after document ready.
export default function init() {
  $('.comments-link').click(showAddCommentForm);
  $('form[id^="add-comment-"] .cancel-btn').click(cancelCommentClick);
  $('form[id^="add-comment-"]').submit(saveComment);
}
