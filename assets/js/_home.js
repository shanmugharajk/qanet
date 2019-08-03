const initMenus = function() {
  $('#ask-question-menu').click(function(e) {
    e.preventDefault();
    if (Cookies.get('QAID') === 'T') {
      location.href = '/login';
    } else {
      location.href = '/login?src=question&returnUrl=/questions/ask';
    }
  });
};

export default function init() {
  initMenus();
}
