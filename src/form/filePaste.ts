import { Selectors as S } from "@shared/enums";
import { FormUtils } from "@shared/utils/globalUtils";

const handlePasteEvent = ({ clipboardData }: ClipboardEvent, input: HTMLInputElement) => {
  if (!clipboardData || clipboardData.files.length > 1) return;

  const file = clipboardData.files[0];

  if (!file) return;

  FormUtils.setInputFile(input, file);
};

const filePasteFeature = (form: HTMLFormElement) => {
  const textarea = form.querySelector<HTMLTextAreaElement>(S.Form.TEXTAREA);
  const fileInput = form.querySelector<HTMLInputElement>(S.Form.INPUT_FILE);

  if (!textarea || !fileInput) return;

  textarea.addEventListener("paste", (e) => handlePasteEvent(e, fileInput));
};

export default filePasteFeature;
