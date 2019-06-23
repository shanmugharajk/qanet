// All initializations are done in this file

// Global object used in all files to attach all the browser events.
window.QaNet = {};

// Menu dropdown initialization.
const initDropdown = () => {
  $("#menu").dropdown();

  $(".multidd").dropdown({
    allowAdditions: true
  });
};

export default function init() {
  initDropdown();
}
