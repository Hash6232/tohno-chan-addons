import { Selectors as S } from "@shared/enums";
import { FormUtils, ValidationUtils } from "@shared/utils/globalUtils";
import ImageUtils from "@shared/utils/imageUtils";

const handleInputChange = async ({ target }: Event) => {
  const input = target as HTMLInputElement | null;

  if (!input || !ValidationUtils.inputHasFile(input)) return;

  const file = input.files?.[0];

  if (!file || !ValidationUtils.filesizeIsTooBig(file)) return;

  const compressedImage = await ImageUtils.compressImage(file);

  if (ValidationUtils.fileIsImage(file, ["image/gif"])) {
    console.log("Filesize too big. Consider re-encoding to webm");
    return;
  };

  if (!compressedImage) return;

  FormUtils.setInputFile(input, compressedImage);

  console.log("Compressed image from", file, "to", compressedImage);
};

const imageCompressFeature = (form: HTMLFormElement) => {
  const fileInput = form.querySelector<HTMLInputElement>(S.Form.INPUT_FILE);

  if (!fileInput) return;

  fileInput.addEventListener("change", handleInputChange);
};

export default imageCompressFeature;
