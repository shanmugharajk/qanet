import "./authentication";
import "./editor";

$ = window.$;

const initDropdown = () => {
  $("#menu").dropdown();

  $(".multidd").dropdown({
    allowAdditions: true
  });
};

$(document).ready(() => {
  initDropdown();
});
