import { SelectorsEnum } from "@shared/enums";
import { Data } from "@shared/utils/globalUtils";
import { createNewButtonTemplate, createNewToggleTemplate } from "@shared/utils/uiUtils";
import "./index.scss";

const handleChangeFileinput = (e: Event) => {
  const fileinput = e.target as HTMLInputElement | null;

  if (!fileinput) return;

  // Reset toolbar display when no file is attached
  if (!Data.Form.hasFile(fileinput)) {
    fileinput.classList.toggle("has-attachment", false);
    fileinput.classList.toggle("has-image", false);
    return;
  }

  fileinput.classList.toggle("has-attachment", true);

  const image = Data.Form.getFiles(fileinput)?.[0];

  if (!image || !Data.isImage(image)) return;

  fileinput.classList.toggle("has-image", true);
};

const handlePreviewImage = (fileinput: HTMLInputElement) => {
  const image = Data.Form.getFiles(fileinput)?.[0];

  if (!image || !Data.isImage(image)) return;

  Data.getDataURL(image).then((url) => {
    if (!url) return;

    const modal = document.createElement("div");
    modal.id = "image-preview-modal";
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

  const previewImageButtonTemplate = { label: "P", title: "Preview image" };
  btnContainer.insertAdjacentHTML("beforeend", createNewButtonTemplate(previewImageButtonTemplate));
  const previewImageToggle = btnContainer.lastElementChild as HTMLAnchorElement;
  previewImageToggle.id = "q-preview-image";
  previewImageToggle.dataset.if = "image";

  const spoilerImageToggleTemplate = { label: "S", title: "Spoiler image", id: "q-spoiler-image-custom" };
  btnContainer.insertAdjacentHTML("beforeend", createNewToggleTemplate(spoilerImageToggleTemplate));
  const spoilerImageToggle = btnContainer.lastElementChild as HTMLInputElement;
  spoilerImageToggle.name = "spoiler";
  spoilerImageToggle.dataset.if = "image";

  const removeAttachmentButtonTemplate = { label: "×", title: "Remove attachment" };
  btnContainer.insertAdjacentHTML("beforeend", createNewButtonTemplate(removeAttachmentButtonTemplate));
  const removeAttachmentButton = btnContainer.lastElementChild as HTMLAnchorElement;
  removeAttachmentButton.id = "q-remove-attachment";
  removeAttachmentButton.dataset.if = "attachment";

  // Describe fileinput content when a file is attached
  fileinput.addEventListener("change", handleChangeFileinput);

  // Toggle image preview modal
  previewImageToggle.addEventListener("click", () => handlePreviewImage(fileinput));

  // Clear fileinput on button click
  removeAttachmentButton.addEventListener("click", () => handleResetFileinput(fileinput));
};

export default fileinputToolbar;
