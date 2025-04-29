import { SelectorsEnum } from "@shared/enums";
import { FormUtils, ValidationUtils } from "@shared/utils/globalUtils";

const clipboardImagePaste = () => {
  const textarea = document.querySelector(SelectorsEnum.QR_TEXTAREA) as HTMLTextAreaElement | null;
  const fileinput = document.querySelector(SelectorsEnum.QR_FILEINPUT) as HTMLInputElement | null;

  // Handle paste event when textarea has focus
  textarea?.addEventListener("paste", (e) => {
    const clipboard = e.clipboardData;

    if (!clipboard || clipboard.files.length < 1) return;

    const file = clipboard.files[0];

    if (!ValidationUtils.fileIsImage(file) || !fileinput) return;

    FormUtils.setInputFile(fileinput, file);
  });
};

export default clipboardImagePaste;
