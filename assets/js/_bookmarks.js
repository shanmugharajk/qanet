import axios from 'axios';

const { Utils } = window.QaNet;

const addToBookmark = async function ($btn, postId, xCsrfToken) {
  try {
    const res = await axios.post(`/posts/bookmarks/${postId}`, {}, {
      headers: {
        'X-CSRF-Token': xCsrfToken
      }
    });

    if (res.status !== 200) {
      throw new Error('Oops, something went wrong')
    }

    $btn.find('div').removeClass('d-n').find('span').text(res.data);
    $btn.addClass('c-bookmarked');
  } catch (error) {
    throw error;
  }
}

const removeBookmark = async function ($btn, postId, xCsrfToken) {
  try {
    const res = await axios.delete(`/posts/bookmarks/${postId}`, {
      headers: {
        'X-CSRF-Token': xCsrfToken
      }
    });

    if (res.status !== 200) {
      throw new Error('Oops, something went wrong');
    }

    if (res.data === 0) {
      $btn.find('div').addClass('d-n');
    }

    $btn.find('div').find('span').text(res.data);
    $btn.removeClass('c-bookmarked');
  } catch (error) {
    throw error;
  }
}

const onBookmarkClick = async function () {
  if (!Utils.authenticate()) {
    return;
  }

  const $btn = $(this);
  const $post = $btn.closest('.post-container');
  const postId = $post.data('post-id');
  const xCsrfToken = $post.find('.comments-list input[name=authenticity_token]').val();
  const $loader = $post.find(`#mini-loader-${postId}`);

  try {
    $loader.removeClass('d-n');

    if ($post.find('.c-bookmarked').length === 0) {
      addToBookmark($btn, postId, xCsrfToken);
    } else {
      removeBookmark($btn, postId, xCsrfToken);
    }
  } catch (error) {
    Utils.showMessage(error);
  } finally {
    $loader.addClass('d-n');
  }
}

export default function init() {
  $('.bookmark').off('click').on('click', onBookmarkClick);
}