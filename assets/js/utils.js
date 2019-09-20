(function () {
  window.QaNet = window.QaNet || {};

  window.QaNet.Utils = {
    getParameterByName: function (name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    showMessage: function (message) {
      const $container = $('#qanet-message-toast div')
      $container.removeClass('hidden');

      if (message) {
        $container.find('p').html(message);
      }
    },

    authenticate: function () {
      if (Cookies.get("qaid") === "t") {
        return true;
      }

      const message = `
        Please <a href='/login?returnUrl=${location.href}'>Login</a>
        to do this operation.
      `;

      window.QaNet.Utils.showMessage(message);

      return false;
    }
  };
})();

/*
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }
  */