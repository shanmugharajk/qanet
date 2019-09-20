const initMenus = function () {
  $("#ask-question-menu, #logout-menu, #login-menu").click(function (e) {
    e.preventDefault();

    const href = $(this).attr("href");

    if (href === "/login" || href === "/logout") {
      let url = `${location.origin}/${href}`;
      if (location.pathname.length > 1) {
        url += `?returnUrl=${location.pathname}`;
      }
      location.href = url;
    } else {
      if (Cookies.get("qaid") === "t") {
        location.href = "/questions/ask";
      } else {
        location.href = "/login?src=question&returnUrl=/questions/ask";
      }
    }
  });
};

export default function init() {
  initMenus();
}
