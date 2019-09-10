import axios from 'axios';

const bindCommentItemEvents = function ($elem) {
  //
}

const showAddCommentForm = function (e) {
  e.preventDefault();
  const commentId = $(e.target)
    .parent()
    .attr('id');
  $(`#${commentId} .comments-link`).addClass('d-n');
  $(`#${commentId} .add-comment-form`).removeClass('d-n');
}

const cancelCommentClick = function (e) {
  e.preventDefault();

  const elem = $(this).parent();

  elem.addClass('d-n');
  elem.find('textarea').val('');
  elem.find('#error-post-comment').addClass('d-n');

  if (elem.attr('id').includes('edit-comment')) {
    elem
      .parent()
      .find('.comment-detail')
      .removeClass('d-n');
  } else {
    elem
      .parent()
      .find('.comments-link')
      .removeClass('d-n');
  }
};

const validateCommentForm = function ($elem) {
  const data = $elem.serialize();
  const $comment = $elem.find('textarea');

  if ($comment.val().length > 11) {
    return data;
  }

  const textChange = function () {
    if ($(this).val().length < 11) {
      return;
    }
    $elem.find('#error-post-comment').addClass('d-n');
    $elem.find('textarea').off('input change');
  };

  $elem.find('#error-post-comment').removeClass('d-n');
  $elem.find('#error-post-comment span').html('Please enter min 10 characters');
  $comment.off('input change').on('input change', textChange);
};

const saveComment = async function (e) {
  e.preventDefault();

  const $elem = $(this);
  const data = validateCommentForm($elem);

  if (!data) {
    return;
  }

  try {
    $elem.find('#loader').removeClass('d-n');

    const postId = $elem.closest('.comments-list').data('post-id');
    const res = await axios.post(`/posts/${postId}/comments`, data);

    if (res.status > 201) {
      throw Error('Error in posting the data');
    }

    // Hide the form
    $elem.addClass('d-n');
    // Reset the textarea where comment is entered.
    $elem.find('textarea[name="Comment"').val('');

    // Show the add comment link button
    const $commentsList = $elem.parent();

    $commentsList.find('.comments-link').removeClass('d-n');

    // Append the result to the comment lists
    $commentsList
      .find('div')
      .first()
      .append(res.data);
  } catch (error) {
    $elem.find('#error-post-comment').removeClass('d-n');
  } finally {
    $elem.find('#loader').addClass('d-n');
  }
}

// Init of various functions after document ready.
export default function init() {
  $('.comments-link').click(showAddCommentForm);
  $('form[id^="add-comment-"] .cancel-btn').click(cancelCommentClick);
  $('form[id^="add-comment-"]').submit(saveComment);
  bindCommentItemEvents($('.comment-item'));
}

/*import axios from 'axios';

const bindAddCommentSectionEvents = function () {
  $('.comments-link').click(showAddCommentForm);
  $('form[id^="add-comment-"] .cancel-btn').click(cancelCommentClick);
  $('form[id^="add-comment-"]').submit(saveComment);
};

const bindCommentSectionItemEvenets = function ($elem) {
  $elem.find('.flag-comment').click(e => bindCommentActions(e, 'flagComment'));
  $elem.find('.edit-comment').click(e => bindCommentActions(e, 'editComment'));
  $elem
    .find('.delete-comment')
    .click(e => bindCommentActions(e, 'deleteComment'));
  $elem.find('form[id^="edit-comment-"] .cancel-btn').click(cancelCommentClick);
  $elem.find('form[id^="edit-comment-"]').submit(updateComment);
};

const showAddCommentForm = function (e) {
  e.preventDefault();
  const commentId = $(e.target)
    .parent()
    .attr('id');
  $(`#${commentId} .comments-link`).addClass('d-n');
  $(`#${commentId} .add-comment-form`).removeClass('d-n');
};

const validateCommentForm = function ($elem) {
  const data = $elem.serialize();
  const $comment = $elem.find('textarea');

  if ($comment.val().length > 11) {
    return data;
  }

  const textChange = function () {
    if ($(this).val().length < 11) {
      return;
    }
    $elem.find('#error-post-comment').addClass('d-n');
    $elem.find('textarea').off('input change');
  };

  $elem.find('#error-post-comment').removeClass('d-n');
  $elem.find('#error-post-comment span').html('Please enter min 10 characters');
  $comment.off('input change').on('input change', textChange);
  return;
};

const cancelCommentClick = function (e) {
  e.preventDefault();

  const elem = $(this).parent();

  elem.addClass('d-n');
  elem.find('textarea').val('');
  elem.find('#error-post-comment').addClass('d-n');

  if (elem.attr('id').includes('edit-comment')) {
    elem
      .parent()
      .find('.comment-detail')
      .removeClass('d-n');
  } else {
    elem
      .parent()
      .find('.comments-link')
      .removeClass('d-n');
  }
};

const saveComment = async function (e) {
  e.preventDefault();

  const $elem = $(this);
  const data = validateCommentForm($elem);

  if (!data) {
    return;
  }

  try {
    $elem.find('#loader').removeClass('d-n');

    const postId = $elem.closest('.comments-list').data('post-id');
    const res = await axios.post(`/posts/${postId}/comments`, data);

    if (res.status > 201) {
      throw Error('Error in posting the data');
    }

    // Hide the form
    $elem.addClass('d-n');
    // Reset the textarea where comment is entered.
    $elem.find('textarea[name="Comment"').val('');

    // Show the add comment link button
    const $container = $elem.parent();

    $container.find('.comments-link').removeClass('d-n');

    // Append the result to the comment lists
    $container
      .find('div')
      .first()
      .append(res.data);

    // Bind the events to the newly added elements
    const commentId = `#${$(res.data).closest('.comment-item').data('comment-id')}`;
    console.log(commentId);
    window.$elem = $elem;
    bindCommentSectionItemEvenets($elem.parent().find(commentId));
  } catch (error) {
    $elem.find('#error-post-comment').removeClass('d-n');
  } finally {
    $elem.find('#loader').addClass('d-n');
  }
};

const updateComment = async function (e) {
  e.preventDefault();

  const $elem = $(this);
  const data = validateCommentForm($elem);

  if (!data) {
    return;
  }

  try {
    $elem.find('#loader').removeClass('d-n');

    const postId = $elem.closest('.comments-list').data('post-id');
    const commentId = `${$elem.data('id')}`;

    const res = await axios.put(`/posts/${postId}/comments/${commentId}`, data);

    if (res.status > 201) {
      throw Error('Error in posting the data');
    }

    // Hide the form
    $elem.addClass('d-n');
    // Reset the textarea where comment is entered.
    $elem.find('textarea[name="Comment"').val('');

    // Show the add comment link button
    const $container = $elem.parent();
    $container.find('.comment-detail').removeClass('d-n');
    $container.html($(res.data).html());

    // Bind the events to the newly added elements
    bindCommentSectionItemEvenets(
      $elem.parent().find(`#${$(res.data).closest('.comment-item').data('comment-id')}`)
    );
  } catch (error) {
    $elem.find('#error-post-comment').removeClass('d-n');
  } finally {
    $elem.find('#loader').addClass('d-n');
  }
};

const editComment = function ($comment) {
  const commentId = $comment.data('comment-id');
  $comment.find('.short-error-message').addClass('d-n');
  $comment.find('.comment-detail').addClass('d-n');
  const $form = $comment.find(`#edit-comment-${commentId}`).removeClass('d-n');
  $form.find('textarea').val($comment.find('.comment').html());
};

const deleteComment = async function ($comment) {
  const commentId = $comment.data('comment-id');
  const type = $comment.data('type');
  const xCsrfToken = $comment.find('input[name=authenticity_token]').val();

  $comment.find('.short-error-message').addClass('d-n');

  try {
    const res = await axios.delete(`/posts/${type}/comments/${commentId}`, {
      headers: {
        'X-CSRF-Token': xCsrfToken
      }
    });
    if (res.status > 202) {
      throw Error('Error in posting the data');
    }
    $($comment).remove();
  } catch (error) {
    $comment.find('.short-error-message').removeClass('d-n');
  }
};

const flagComment = function ($comment) {
  $comment.find('.short-error-message').addClass('d-n');
};

const commentActions = {
  deleteComment,
  editComment,
  flagComment
};

const bindCommentActions = function (e, action) {
  const $comment = $(e.target).closest('.comment-item');
  return commentActions[action]($comment);
};

// Init of various functions after document ready.
export default function init() {
  bindAddCommentSectionEvents();
  bindCommentSectionItemEvenets($('.comment-item'));
}
*/