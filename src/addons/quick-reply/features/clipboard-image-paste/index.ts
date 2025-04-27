import { SelectorsEnum } from "@shared/enums";
import { Data } from "@shared/utils/globalUtils";

const clipboardImagePaste = () => {
  const textarea = document.querySelector(SelectorsEnum.QR_TEXTAREA) as HTMLTextAreaElement | null;
  const fileinput = document.querySelector(SelectorsEnum.QR_FILEINPUT) as HTMLInputElement | null;

  // Handle paste event when textarea has focus
  textarea?.addEventListener("paste", (e) => {
    const clipboard = e.clipboardData;

    if (!clipboard) return;

    const image = Data.Clipboard.getImage(clipboard);

    if (!image || !fileinput) return;

    Data.Form.addFile(fileinput, image);
  });
};

export default clipboardImagePaste;
