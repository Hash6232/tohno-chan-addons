import { SelectorsEnum } from "@shared/enums";
import { runWhenElementExists } from "@shared/utils";
import clearFormOnCancel from "./features/clear-form-on-cancel";
import clipboardImagePaste from "./features/clipboard-image-paste";
import customFormattingButtons from "./features/custom-formatting-buttons";
import renameableFilename from "./features/renameable-filename";

const main = () => {
  renameableFilename();
  customFormattingButtons();
  clearFormOnCancel();
  clipboardImagePaste();
};

try {
  runWhenElementExists(SelectorsEnum.QR, main);
} catch (err) {
  console.log("[quick-reply-addon]", err);
}
