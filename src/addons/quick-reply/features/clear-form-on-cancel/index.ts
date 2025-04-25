import { SelectorsEnum } from "@shared/enums";

const handleCloseButtonClick = () => {
  const textarea = document.querySelector(SelectorsEnum.POST_FORM_TEXTAREA) as HTMLTextAreaElement | null;

  if (!textarea) return;

  textarea.value = "";
};

const clearFormOnCancel = () => {
  const cancelButton = document.querySelector(SelectorsEnum.QR_CLOSE) as HTMLAnchorElement | null;

  if (!cancelButton) return;

  cancelButton.addEventListener("click", () => handleCloseButtonClick());
};

export default clearFormOnCancel;
