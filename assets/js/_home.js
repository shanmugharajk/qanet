import axios from 'axios';

let isLoading = false;

const { Utils } = window.QaNet;

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

const loadData = async function () {
  try {
    const res = await axios.get("/questions", { withCredentials: true });
    const { data, status } = res || {};
    if (status == 200) {
      $('.home--question-list').append(data);
    }
  } catch (error) {
    Utils.showMessage(error);
  } finally {
    isLoading = false;
  }
}

const initPagination = function () {
  $(window).off("scroll").on("scroll", function () {
    if (isLoading) return;

    const scrolled = $(window).scrollTop() + screen.availHeight;
    if (scrolled > $(document).height()) {
      isLoading = true;
      setTimeout(() => {
        loadData();
      }, 1000);
    }
  });
}

export default function init() {
  initMenus();

  if ($('.home--question-list').length > 0) {
    initPagination();
  }
}
