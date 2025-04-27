import { SelectorsEnum } from "@shared/enums";
import { Data } from "@shared/utils/globalUtils";
import "./index.scss";

const handleFilenameClick = (fileinput: HTMLInputElement) => {
  if ((fileinput.files?.length ?? 1) > 0) return;
  fileinput.click();
};

const handleFilenameBlur = (e: Event, fileinput: HTMLInputElement) => {
  const filename = e.target as HTMLInputElement | null;

  if (!filename || !Data.Form.hasFile(fileinput)) return;

  const originalFile = fileinput.files![0];
  const newFileName = filename.value;

  // Skip if filename is the same as before
  if (originalFile.name === newFileName) return;

  // Update original file with new filename
  const updatedFile = Data.updateFile(originalFile, { filename: newFileName });

  // Replace the file input's file list with the new file
  Data.Form.addFile(fileinput, updatedFile);
};

const handleFileinputChange = (event: Event, filename: HTMLInputElement) => {
  const fileinput = event.target as HTMLInputElement | null;

  if (!fileinput) return;

  if ((fileinput.files?.length ?? 0) < 1) {
    filename.value = "";
    return;
  }

  filename.value = fileinput.files![0].name;

  // Place cursor at the end of the field
  const length = filename.value.length;
  filename.setSelectionRange(length, length);
};

const handleFileinputCancel = (filename: HTMLInputElement) => {
  filename.blur();
};

const renameableFileinput = () => {
  const form = document.querySelector(SelectorsEnum.QR) as HTMLFormElement | null;
  const fileinput = document.querySelector(SelectorsEnum.QR_FILEINPUT) as HTMLInputElement | null;
  const spoilerCol = document.querySelector(SelectorsEnum.QR_SPOILER_COL) as HTMLTableColElement | null;

  if (!fileinput || !spoilerCol) return;

  fileinput.insertAdjacentHTML(
    "afterend",
    `<input id="upload_filename" type="text" placeholder="Click to upload file" />`
  );
  const filename = document.getElementById("upload_filename") as HTMLInputElement | null;

  if (!form || !filename) return;

  // Trigger file picker only when no file is attached
  filename.addEventListener("click", () => handleFilenameClick(fileinput));

  // Update filename field when a file is attached
  fileinput.addEventListener("change", (e) => handleFileinputChange(e, filename));
  fileinput.addEventListener("cancel", () => handleFileinputCancel(filename));

  // Apply new filename once the input field loses focus
  filename.addEventListener("blur", (e) => handleFilenameBlur(e, fileinput));
};

export default renameableFileinput;
