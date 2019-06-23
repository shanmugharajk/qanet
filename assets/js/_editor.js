const quillInstance = (elementId, readOnly = false) => {
  const toolbarOptions = [
    "bold",
    "italic",
    "underline",
    "blockquote",
    "code-block"
  ];

  const options = {
    theme: "snow",
    modules: {
      toolbar: readOnly ? false : toolbarOptions
    },
    languages: ["javascript", "ruby", "python"],
    readOnly
  };

  return new Quill(elementId, options);
};

window.QaNet.Editor = {
  getQuilInstance: quillInstance
};

export default {
  getQuilInstance: quillInstance
};
