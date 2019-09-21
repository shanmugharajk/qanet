import axios from 'axios';

const { Utils } = window.QaNet;

const onBookmarkClick = async function () {
  if (!Utils.authenticate()) {
    return;
  }

  const $btn = $(this);
  const $post = $btn.closest('.post-container');
  const postId = $post.data('post-id');
  const xCsrfToken = $post.find('.comments-list input[name=authenticity_token]').val();
  const $loader = $post.find(`#mini-loader-${postId}`);
  const isAdd = $post.find('.c-bookmarked').length === 0;
  const options = { headers: { 'X-CSRF-Token': xCsrfToken } };
  const url = `/posts/bookmarks/${postId}`;
  const method = isAdd ? "post" : "delete";

  try {
    $loader.removeClass('d-n');

    const res = await axios[method](url, options);

    if (res.status !== 200) {
      throw new Error('Oops, something went wrong');
    }

    if (res.data === 0) {
      $btn.find('div').addClass('d-n');
    }

    if (isAdd) {
      $btn.find('div').removeClass('d-n').find('span').text(res.data);
      $btn.addClass('c-bookmarked');
    } else {
      $btn.find('div').find('span').text(res.data);
      $btn.removeClass('c-bookmarked');
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