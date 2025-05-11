import { Selectors as S } from "@shared/enums";
import { FormUtils } from "@shared/utils/globalUtils";

const handlePasteEvent = async ({ clipboardData }: ClipboardEvent, input: HTMLInputElement) => {
  if (!clipboardData || clipboardData.files.length > 1) return;

  const file = clipboardData.files[0];

  if (!file) return;

  const options = { type: file.type, lastModified: file.lastModified };
  let originalFilename = file.name;

  for (const item of clipboardData.items) {
    if (item.type !== "text/html") continue;
    const html = await new Promise<string>((resolve) => item.getAsString(resolve));
    const doc = new DOMParser().parseFromString(html, "text/html");
    const img = doc.querySelector("img");
    if (img && img.src) {
      const url = new URL(img.src);
      const pathname = url.pathname;
      const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
      const extension = file.name.split(".").pop();
      originalFilename = filename + "." + extension;
    }
  }

  const output = new File([file], originalFilename, options);

  FormUtils.setInputFile(input, output);
};

const filePasteFeature = (form: HTMLFormElement) => {
  const textarea = form.querySelector<HTMLTextAreaElement>(S.Form.TEXTAREA);
  const fileInput = form.querySelector<HTMLInputElement>(S.Form.INPUT_FILE);

  if (!textarea || !fileInput) return;

  textarea.addEventListener("paste", (e) => handlePasteEvent(e, fileInput));
};

export default filePasteFeature;
