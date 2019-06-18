const toolbarOptions = [
  "bold",
  "italic",
  "underline",
  "blockquote",
  "code-block"
];

var quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: toolbarOptions
  },
  languages: ["javascript", "ruby", "python"]
});
