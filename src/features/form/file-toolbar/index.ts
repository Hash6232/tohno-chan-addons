import { Selectors as S } from "@shared/enums";
import { FormUtils, ValidationUtils } from "@shared/utils/globalUtils";
import ImageUtils from "@shared/utils/imageUtils";
import UIUtils from "@shared/utils/uiUtils";
import buttons from "./buttons";
import "./index.scss";

const UI = UIUtils.Buttons;

const handleChangeFileInput = ({ currentTarget }: Event, form: HTMLFormElement) => {
  const input = currentTarget as HTMLInputElement | null;

  if (!input) return;

  // Reset toolbar display when no file is attached
  if (!ValidationUtils.inputHasFile(input)) {
    form.classList.toggle("has-attachment", false);
    form.classList.toggle("has-image", false);
    return;
  }

  form.classList.toggle("has-attachment", true);

  const file = input.files![0];

  if (!ValidationUtils.fileIsImage(file)) return;

  form.classList.toggle("has-image", true);
};

const handlePreviewImage = (input: HTMLInputElement) => {
  if (!ValidationUtils.inputHasFile(input)) return;

  const file = input.files![0];

  if (!ValidationUtils.fileIsImage(file)) return;

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => URL.revokeObjectURL(url);
  image.src = url;

  const modal = document.createElement("div");
  modal.id = "image-preview-modal";
  modal.appendChild(image);
  document.body.appendChild(modal);

  modal.addEventListener("click", ({ currentTarget }) => {
    (currentTarget as HTMLDivElement | null)?.remove();
  });
};

const handleImportImage = (input: HTMLInputElement) => {
  const url = prompt("Enter a valid image URL:");

  if (!url) return;

  ImageUtils.fetchImage(url).then((file) => {
    if (!file) return;

    FormUtils.setInputFile(input, file);
  });
};

const handleResetFileInput = (input: HTMLInputElement) => {
  input.value = "";

  input.dispatchEvent(new Event("change", { bubbles: true }));
};

const fileToolbarFeature = (form: HTMLFormElement) => {
  // Cleanup
  form.querySelector<HTMLDivElement>(".file-toolbar")?.remove();
  form.querySelector<HTMLTableColElement>(`td:has(.${buttons.spoiler.class})`)?.remove();

  const spoiler = form.querySelector<HTMLInputElement>(S.Form.SPOILER);
  const fileInput = form.querySelector<HTMLInputElement>(S.Form.INPUT_FILE);

  if (!spoiler || !fileInput) return;

  const container = document.createElement("div");
  container.className = "file-toolbar";
  spoiler.parentElement?.appendChild(container);

  for (const button of [
    UI.createButton({
      ...buttons.preview,
      onClick: () => handlePreviewImage(fileInput),
    }),
    UI.createToggle({
      ...buttons.spoiler,
    }),
    UI.createButton({
      ...buttons.import,
      onClick: () => handleImportImage(fileInput),
    }),
    UI.createButton({
      ...buttons.clear,
      onClick: () => handleResetFileInput(fileInput),
    }),
  ]) {
    container.appendChild(button);
  }

  fileInput.addEventListener("change", (e) => handleChangeFileInput(e, form));
};

export default fileToolbarFeature;
