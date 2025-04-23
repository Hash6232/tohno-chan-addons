import { QuickreplySelectorsEnum } from "@enums/selectorsEnum";

export const clipboardImagePaste = () => {
  const textarea = document.querySelector(QuickreplySelectorsEnum.TEXTAREA) as HTMLTextAreaElement | null;
  const fileinput = document.querySelector(QuickreplySelectorsEnum.FILEINPUT) as HTMLInputElement | null;

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
  });
};
