import { runWhenElementExists } from "./utils/observe";
import { Selectors as QuickreplySelectors } from "./enums/selectors/QuickreplySelectorsEnum";
import { runMain } from "./utils/general";

const FILENAME = "quick-reply" as const;

const main = () => {
  const textarea = document.querySelector(QuickreplySelectors.TEXTAREA) as HTMLTextAreaElement | null;
  const fileinput = document.querySelector(QuickreplySelectors.FILEINPUT) as HTMLInputElement | null;
  const uploadRow = document.querySelector(QuickreplySelectors.UPLOADROW) as HTMLTableRowElement | null;

  if (!uploadRow) return;

  // Create reset button
  const resetBtn = document.createElement("a");
  resetBtn.href = "javascript:;";
  resetBtn.textContent = "x";
  resetBtn.addEventListener("click", () => fileinput && (fileinput.value = ""));

  // Create column container for button
  uploadRow.insertAdjacentHTML("beforeend", '<td class="resetUpload"></td>');

  // Append button inside container
  uploadRow.lastElementChild?.appendChild(resetBtn);

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

runMain(runWhenElementExists(QuickreplySelectors.ROOT, main), FILENAME);
