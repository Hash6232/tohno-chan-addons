import { SelectorsEnum } from "@shared/enums";

import { FormUtils, ValidationUtils } from "@shared/utils/globalUtils";
import ImageUtils from "@shared/utils/imageUtils";
import { createNewButtonTemplate, createNewToggleTemplate } from "@shared/utils/uiUtils";
import "./index.scss";

const handleChangeFileinput = (e: Event) => {
  const fileinput = e.target as HTMLInputElement | null;

  if (!fileinput) return;

  // Reset toolbar display when no file is attached
  if (!ValidationUtils.inputHasFile(fileinput)) {
    fileinput.classList.toggle("has-attachment", false);
    fileinput.classList.toggle("has-image", false);
    return;
  }

  fileinput.classList.toggle("has-attachment", true);

  const file = fileinput.files![0];

  if (!ValidationUtils.fileIsImage(file)) return;

  fileinput.classList.toggle("has-image", true);
};

const handlePreviewImage = (fileinput: HTMLInputElement) => {
  if (!ValidationUtils.inputHasFile(fileinput)) return;

  const file = fileinput.files![0];

  if (!ValidationUtils.fileIsImage(file)) return;

  ImageUtils.toDataURL(file).then((url) => {
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

const handleImportImage = (fileinput: HTMLInputElement) => {
  const url = prompt("Enter a valid image URL:");

  if (!url) return;

  ImageUtils.fetchImage(url).then((file) => {
    if (!file) return;

    FormUtils.setInputFile(fileinput, file);
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

  // Add toolbar and its buttons
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

  const importImageButtonTemplate = { label: "U", title: "Import image from URL" };
  btnContainer.insertAdjacentHTML("beforeend", createNewButtonTemplate(importImageButtonTemplate));
  const importImageButton = btnContainer.lastElementChild as HTMLAnchorElement;
  importImageButton.id = "q-import-image";

  const removeAttachmentButtonTemplate = { label: "×", title: "Remove attachment" };
  btnContainer.insertAdjacentHTML("beforeend", createNewButtonTemplate(removeAttachmentButtonTemplate));
  const removeAttachmentButton = btnContainer.lastElementChild as HTMLAnchorElement;
  removeAttachmentButton.id = "q-remove-attachment";
  removeAttachmentButton.dataset.if = "attachment";

  // Describe fileinput content when a file is attached
  fileinput.addEventListener("change", handleChangeFileinput);

  // Toggle image preview modal
  previewImageToggle.addEventListener("click", () => handlePreviewImage(fileinput));

  // Open browser modal to input an image URL
  importImageButton.addEventListener("click", () => handleImportImage(fileinput));

  // Clear fileinput on button click
  removeAttachmentButton.addEventListener("click", () => handleResetFileinput(fileinput));
};

export default fileinputToolbar;
