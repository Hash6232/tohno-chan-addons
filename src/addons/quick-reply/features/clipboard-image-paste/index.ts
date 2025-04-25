import { SelectorsEnum } from "@shared/enums";

const clipboardImagePaste = () => {
  const textarea = document.querySelector(SelectorsEnum.QR_TEXTAREA) as HTMLTextAreaElement | null;
  const fileinput = document.querySelector(SelectorsEnum.QR_FILEINPUT) as HTMLInputElement | null;

  // Handle paste event when textarea has focus
  textarea?.addEventListener("paste", (e) => {
    const clipboard = e.clipboardData?.items;

    // Only proceed if at most one element in clipboard;
    if (!clipboard || clipboard.length > 1) return;

    const item = clipboard[0];

    // Ignore anything that isn't an image
    if (!item.type.startsWith("image/")) return;

    const file = item.getAsFile();

    if (!file || !fileinput) return;

    // Create a DataTransfer object to simulate a file upload
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // Assign the file to the input field
    fileinput.files = dataTransfer.files;

    // Manually trigger a 'change' event
    fileinput.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

export default clipboardImagePaste;
