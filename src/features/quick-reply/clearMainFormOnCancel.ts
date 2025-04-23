import { MainSelectorsEnum, QuickreplySelectorsEnum } from "@enums/selectorsEnum";

const handleCloseButtonClick = (form: HTMLFormElement) => {
  const textarea = document.querySelector(MainSelectorsEnum.POST_FORM_TEXTAREA) as HTMLTextAreaElement | null;

  if (!textarea) return;

  textarea.value = "";
};

const clearMainFormOnCancel = () => {
  const mainForm = document.querySelector(MainSelectorsEnum.POST_FORM) as HTMLFormElement | null;

  if (!mainForm) return;

  const cancelButton = document.querySelector(QuickreplySelectorsEnum.CLOSE) as HTMLAnchorElement | null;

  if (!cancelButton) return;

  cancelButton.addEventListener("click", () => handleCloseButtonClick(mainForm));
};

export default clearMainFormOnCancel;
