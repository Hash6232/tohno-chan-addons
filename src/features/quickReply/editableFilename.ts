import { HTMLEnum } from "../../enums/htmlEnum";
import { QuickreplySelectors } from "../../enums/selectors/quickreplySelectorsEnum";

export const editableFilename = () => {
  const form = document.querySelector(QuickreplySelectors.ROOT) as HTMLFormElement | null;
  const fileinput = document.querySelector(QuickreplySelectors.FILEINPUT) as HTMLInputElement | null;
  const uploadRow = document.querySelector(QuickreplySelectors.UPLOADROW) as HTMLTableRowElement | null;

  if (!fileinput || !uploadRow) return;

  // Replace fileinput with filename field
  fileinput.style.display = "none";
  fileinput.insertAdjacentHTML("afterend", HTMLEnum.QRFILENAME);

  const filename = document.getElementById("upload_filename") as HTMLInputElement | null;

  if (!form || !filename) return;

  // Trigger file picker only when no file is attached
  filename.addEventListener("click", () => {
    if ((fileinput.files?.length ?? 1) > 0) return;
    fileinput.click();
  });

  // Update filename field when a file is attached
  fileinput.addEventListener("change", () => {
    if ((fileinput.files?.length ?? 0) < 1) return;
    filename.value = fileinput.files![0].name;
    // Place cursor at the end of the field
    const length = filename.value.length;
    filename.setSelectionRange(length, length);
  });

  // Apply new filename once the input field loses focus
  form.addEventListener("submit", () => {
    if ((fileinput.files?.length ?? 0) < 1) return;
    const originalFile = fileinput.files![0];
    const newFileName = filename.value;

    // Create a new File object with the updated filename
    const updatedFile = new File([originalFile], newFileName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });

    // Replace the file input's file list with the new file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(updatedFile);
    fileinput.files = dataTransfer.files;
  });

  // Add clear fileinput field button

  /* resetBtn.addEventListener("click", () => {
    fileinput.value = "";
    filename.value = "";
  }); */
};
