import axios from 'axios';

const { Utils } = window.QaNet;

const fetchVote = function ($elem) {
    if ($elem.hasClass('upvote')) {
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
    const $elem = $(this);
    const vote = fetchVote($elem);
    const undo = $elem.hasClass('c-vote') || $elem.hasClass('c-accepted');
    const $post = $elem.closest('.post-container');
    const postType = $post.data("type");
    const postId = $post.data('post-id');
    const xCsrfToken = $post.find('.comments-list input[name=authenticity_token]').val();
    const $loader = $post.find(`#mini-loader-${postId}`);
    const options = { headers: { 'X-CSRF-Token': xCsrfToken } };
    let url = `/posts/${postId}/vote/${vote}?postType=${postType}`;
    url += undo ? `&undo=${undo}` : '';

    try {
        $loader.removeClass('d-n');

        const res = await axios.post(url, options);
        const { data } = res || {}

        if (data.result === 'SUCCESS') {
            if (vote === 5) {
                $elem.closest('#answers').find('button.c-accepted').removeClass('c-accepted');
                if (!undo) {
                    $elem.addClass('c-accepted');
                } else {
                    $elem.removeClass('c-accepted');
                }
            } else {
                const $votingContainer = $elem.closest('.voting-container')
                $votingContainer.find('button.c-vote').removeClass('c-vote');
                if (!undo) {
                    $elem.addClass('c-vote');
                } else {
                    $elem.removeClass('c-vote');
                }
                $votingContainer.find('span').text(data.vote);
            }
        } else {
            Utils.showMessage(data.message || 'Error in updating vote');
        }
    } catch (error) {
        Utils.showMessage(error);
    } finally {
        $loader.addClass('d-n');
    }
}

export const bindVoteEvents = function () {
    $('.upvote').off('click').on('click', onVoteClick);
    $('.downvote').off('click').on('click', onVoteClick);
    $('.accept-answer').off('click').on('click', onVoteClick);
}

export default function init() {
    bindVoteEvents();
}