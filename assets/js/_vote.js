import axios from 'axios';

const { Utils } = window.QaNet;

const fetchVote = function ($elem) {
    if ($elem.hasClass('c-vote') || $elem.hasClass('c-accepted')) {
        return 0;
    } else if ($elem.hasClass('upvote')) {
        return 1;
    } else if ($elem.hasClass('downvote')) {
        return -1;
    } else if ($elem.hasClass('accept-answer')) {
        return 5;
    } else {
        throw new Error('Invalid vote');
    }
}

const onVoteClick = async function () {
    const $btn = $(this);
    const vote = fetchVote($btn);
    const $post = $btn.closest('.post-container');
    const postType = $post.data("type");
    const postId = $post.data('post-id');
    const xCsrfToken = $post.find('.comments-list input[name=authenticity_token]').val();
    const $loader = $post.find(`#mini-loader-${postId}`);
    const options = { headers: { 'X-CSRF-Token': xCsrfToken } };
    const url = `/posts/${postId}/vote/${vote}?postType=${postType}`;

    try {
        $loader.removeClass('d-n');

        const res = await axios.post(url, options);
        console.log(res);
    } catch (error) {
        Utils.showMessage(error);
    } finally {
        $loader.addClass('d-n');
    }
}

export default function init() {
    $('.upvote').off('click').on('click', onVoteClick);
    $('.downvote').off('click').on('click', onVoteClick);
    $('.accept-answer').off('click').on('click', onVoteClick);
}