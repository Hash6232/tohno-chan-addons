import { SelectorsEnum } from "@shared/enums";
import { getImageFromClipboard } from "@shared/utils/uploadUtils";

const clipboardImagePaste = () => {
  const textarea = document.querySelector(SelectorsEnum.QR_TEXTAREA) as HTMLTextAreaElement | null;
  const fileinput = document.querySelector(SelectorsEnum.QR_FILEINPUT) as HTMLInputElement | null;

  // Handle paste event when textarea has focus
  textarea?.addEventListener("paste", (e) => {
    const clipboard = e.clipboardData?.items;

    if (!clipboard) return;

    const image = getImageFromClipboard(clipboard);

    if (!image || !fileinput) return;

    // Create a DataTransfer object to simulate a file upload
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(image);

    // Assign the file to the input field
    fileinput.files = dataTransfer.files;

    // Manually trigger a 'change' event
    fileinput.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

export default clipboardImagePaste;
