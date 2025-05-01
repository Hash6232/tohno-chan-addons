import { Selectors as S } from "@shared/enums";
import { FormUtils, ValidationUtils } from "@shared/utils/globalUtils";
import "./index.scss";

const handleFileInputChange = ({ currentTarget }: Event, fileName: HTMLInputElement) => {
  const fileInput = currentTarget as HTMLInputElement | null;

  if (!fileInput) return;

  const file = fileInput.files?.[0];

  fileName.value = file ? file.name : "";
};

const handleFileInputCancel = (fileName: HTMLInputElement) => {
  fileName.blur();
};

const handleFileNameClick = (fileInput: HTMLInputElement) => {
  if (ValidationUtils.inputHasFile(fileInput)) return;

  fileInput.click();
};

const handleFileNameBlur = ({ currentTarget }: Event, fileInput: HTMLInputElement) => {
  const fileName = currentTarget as HTMLInputElement | null;

  if (!fileName || !ValidationUtils.inputHasFile(fileInput)) return;

  const file = fileInput.files![0];

  const options = { type: file.type, lastModified: file.lastModified };
  const updatedFile = new File([file], fileName.value, options);

  FormUtils.setInputFile(fileInput, updatedFile);
};

const fileRenameFeature = (form: HTMLFormElement) => {
  const fileInput = form.querySelector<HTMLInputElement>(S.Form.INPUT_FILE);

  if (!fileInput) return;

  // Cleanup
  form.querySelector<HTMLInputElement>(".upload-filename")?.remove();

  const fileName = document.createElement("input");
  fileName.placeholder = "Click to upload a file..";
  fileName.className = "upload-filename";
  fileName.type = "text";
  fileInput.insertAdjacentElement("afterend", fileName);

  fileInput.addEventListener("change", (e) => handleFileInputChange(e, fileName));
  fileInput.addEventListener("cancel", () => handleFileInputCancel(fileName));
  fileName.addEventListener("click", () => handleFileNameClick(fileInput));
  fileName.addEventListener("blur", (e) => handleFileNameBlur(e, fileInput));
};

export default fileRenameFeature;
