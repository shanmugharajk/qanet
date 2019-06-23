const initPostDetails = () => {
  if ($("#posts").length <= 0) {
    return;
  }
  // TODO: fetch more comments, voting (up, down), edit, delete listners will come here.
};

// Init of various functions after document ready.
export default function init() {
  initPostDetails();

  // Inline script init method.
  window.init && window.init();
}
