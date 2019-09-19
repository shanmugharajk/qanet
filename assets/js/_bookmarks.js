import axios from 'axios';

const addToBookmark = async function () {
  const $post = $(this).closest('.post-container');
  const postId = $post.data('post-id');
  const xCsrfToken = $post.find('.comments-list input[name=authenticity_token]').val();
  const $loader = $post.find(`#mini-loader-${postId}`);

  try {
    const res = await axios.post(`/posts/bookmarks/${postId}`, {}, {
      headers: {
        'X-CSRF-Token': xCsrfToken
      }
    });
    console.log(res);

  } catch (error) {
    console.log(error);
  }
}

export default function init() {
  $('.bookmark').off('click').on('click', addToBookmark);
}