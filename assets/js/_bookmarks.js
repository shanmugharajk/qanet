import axios from 'axios';

const onBookmarkClick = async function () {
  const $btn = $(this);
  const $post = $btn.closest('.post-container');
  const postId = $post.data('post-id');
  const xCsrfToken = $post.find('.comments-list input[name=authenticity_token]').val();
  const $loader = $post.find(`#mini-loader-${postId}`);

  $loader.removeClass('d-n');

  try {
    let res;

    if ($post.find('.c-bookmarked').length === 0) {
      res = await axios.post(`/posts/bookmarks/${postId}`, {}, {
        headers: {
          'X-CSRF-Token': xCsrfToken
        }
      });
    } else {
      res = await axios.delete(`/posts/bookmarks/${postId}`, {
        headers: {
          'X-CSRF-Token': xCsrfToken
        }
      });
    }

    if (res.status !== 200) {
      throw new Error('Oops, something went wrong')
    }

    $btn.find('div').removeClass('d-n').find('span').text(res.data);
    $btn.addClass('c-bookmarked');
  } catch (error) {
    window.QaNet.Utils.showMessage(error);
  } finally {
    $loader.addClass('d-n');
  }
}

export default function init() {
  $('.bookmark').off('click').on('click', onBookmarkClick);
}