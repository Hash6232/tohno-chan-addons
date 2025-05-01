const buttons = {
  preview: {
    label: "P",
    title: "Preview image",
    class: "preview-image",
  },
  spoiler: {
    label: "S",
    title: "Spoiler image",
    class: "spoiler-image",
    name: "spoiler",
  },
  import: {
    label: "U",
    title: "Import image from URL",
    class: "import-image",
  },
  clear: {
    label: "×",
    title: "Remove file",
    class: "remove-file",
  },
} as const;

export default buttons;
