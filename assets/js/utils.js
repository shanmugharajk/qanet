const quillInstance = elementId => {
  const toolbarOptions = [
    "bold",
    "italic",
    "underline",
    "blockquote",
    "code-block"
  ];

  return new Quill(elementId, {
    theme: "snow",
    modules: {
      toolbar: toolbarOptions
    },
    languages: ["javascript", "ruby", "python"]
  });
};

export default {
  getQuilInstance: quillInstance
};
