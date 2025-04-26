import { SelectorsEnum } from "@shared/enums";
import { getDataURL, getImageFromInput, hasAttachment } from "@shared/utils/uploadUtils";
import "./index.scss";

const createNewButton = (id: string, label: string, title: string) => {
  return (
    `<div title="${title}" class="btn-container btn">` + `<a id="${id}" href="javascript:;">${label}</a>` + `</div>`
  );
};

const createNewToggle = (id: string, name: string, label: string, title: string) => {
  return (
    `<div title="${title}" class="btn-container toggle">` +
    `<input id="${id}" class="btn-toggle" name="${name}" type="checkbox" />` +
    `<label for="${id}">${label}</label>` +
    `</div>`
  );
};

const handleChangeFileinput = (e: Event) => {
  const fileinput = e.target as HTMLInputElement | null;

  if (!fileinput) return;

  // Reset toolbar display when no file is attached
  if (!hasAttachment(fileinput)) {
    fileinput.classList.toggle("has-attachment", false);
    fileinput.classList.toggle("has-image", false);
    return;
  }

  fileinput.classList.toggle("has-attachment", true);

  const image = getImageFromInput(fileinput);

  if (!image) return;

  fileinput.classList.toggle("has-image", true);
};

const handlePreviewImage = (fileinput: HTMLInputElement) => {
  const image = getImageFromInput(fileinput);

  if (!image) return;

  getDataURL(image).then((url) => {
    if (!url) return;

    const modal = document.createElement("div");
    modal.id = "q-image-preview-modal";
    modal.innerHTML = `<img src="${url}" />`;
    document.body.appendChild(modal);

    modal.addEventListener("click", ({ currentTarget }) => {
      const modal = currentTarget as HTMLDivElement | null;
      modal?.remove();
    });
  });
};

const handleResetFileinput = (fileinput: HTMLInputElement) => {
  fileinput.value = "";

  fileinput.dispatchEvent(new Event("change", { bubbles: true }));
};

const fileinputToolbar = () => {
  const fileinput = document.querySelector(SelectorsEnum.QR_FILEINPUT) as HTMLInputElement | null;
  const spoilerCol = document.querySelector(SelectorsEnum.QR_SPOILER_COL) as HTMLTableColElement | null;

  if (!fileinput || !spoilerCol) return;

  // Add preview, randomize and clear buttons next so spoiler toggle
  const btnContainer = document.createElement("div");
  btnContainer.className = "q-toolbar-buttons";
  spoilerCol.appendChild(btnContainer);
  for (const button of [
    createNewButton("q-preview-image", "P", "Preview image"),
    createNewToggle("q-spoiler-image-custom", "spoiler", "S", "Spoiler image"),
    createNewButton("q-remove-image", "×", "Remove attachment"),
  ])
    btnContainer.insertAdjacentHTML("beforeend", button);

  const previewToggle = document.getElementById("q-preview-image") as HTMLAnchorElement;
  const removeImageBtn = document.getElementById("q-remove-image") as HTMLAnchorElement;

  // Describe fileinput content when a file is attached
  fileinput.addEventListener("change", handleChangeFileinput);

  // Toggle image preview modal
  previewToggle.addEventListener("click", () => handlePreviewImage(fileinput));

  // Clear fileinput on button click
  removeImageBtn.addEventListener("click", () => handleResetFileinput(fileinput));
};

export default fileinputToolbar;
