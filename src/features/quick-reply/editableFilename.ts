import { HTMLEnum } from "@enums/htmlEnum";
import { QuickreplySelectorsEnum } from "@enums/selectorsEnum";
import "../../styles/quick-reply.scss";

const handleFilenameClick = (fileinput: HTMLInputElement) => {
  if ((fileinput.files?.length ?? 1) > 0) return;
  fileinput.click();
};

const handleFileinputChange = (fileinput: HTMLInputElement, filename: HTMLInputElement) => {
  if ((fileinput.files?.length ?? 0) < 1) return;
  filename.value = fileinput.files![0].name;
  // Place cursor at the end of the field
  const length = filename.value.length;
  filename.setSelectionRange(length, length);
};

const handleFormSubmit = (fileinput: HTMLInputElement, filename: HTMLInputElement) => {
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
};

const handleResetFileinput = (fileinput: HTMLInputElement, filename: HTMLInputElement) => {
  fileinput.value = "";
  filename.value = "";
};

export const editableFilename = () => {
  const form = document.querySelector(QuickreplySelectorsEnum.ROOT) as HTMLFormElement | null;
  const fileinput = document.querySelector(QuickreplySelectorsEnum.FILEINPUT) as HTMLInputElement | null;
  const uploadRow = document.querySelector(QuickreplySelectorsEnum.UPLOAD_ROW) as HTMLTableRowElement | null;

  if (!fileinput || !uploadRow) return;

  // Replace fileinput with filename field
  fileinput.style.display = "none";
  fileinput.insertAdjacentHTML("afterend", HTMLEnum.QRFILENAME);

  const filename = document.getElementById("upload_filename") as HTMLInputElement | null;

  if (!form || !filename) return;

  // Trigger file picker only when no file is attached
  filename.addEventListener("click", () => handleFilenameClick(fileinput));

  // Update filename field when a file is attached
  fileinput.addEventListener("change", () => handleFileinputChange(fileinput, filename));

  // Apply new filename once the input field loses focus
  form.addEventListener("submit", () => handleFormSubmit(fileinput, filename));

  // Add clear fileinput field button
  // resetBtn.addEventListener("click", () => handleResetFileinput(fileinput, filename));
};
