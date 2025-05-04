import { Selectors as S } from "@shared/enums";

const handleButtonClick = (textarea: HTMLTextAreaElement) => {
  textarea.value = "";
};

const clearOnCloseFeature = (form: HTMLFormElement) => {
  const cancelButton = form.querySelector<HTMLAnchorElement>(S.Form.CLOSE_QR);
  const mainPostForm = document.querySelector<HTMLFormElement>(S.Form.POST);

  if (!mainPostForm) return;

  const textarea = mainPostForm.querySelector<HTMLTextAreaElement>(S.Form.TEXTAREA);

  if (!cancelButton || !textarea) return;

  cancelButton.addEventListener("click", () => handleButtonClick(textarea));
};

export default clearOnCloseFeature;
