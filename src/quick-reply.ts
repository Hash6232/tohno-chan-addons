import { runWhenElementExists } from "@utils/observe";
import { QuickreplySelectorsEnum } from "@enums/selectorsEnum";
import editableFilename from "@features/quick-reply/editableFilename";
import clipboardImagePaste from "@features/quick-reply/clipboardImagePaste";
import compactFormattingButtons from "@features/quick-reply/compactFormattingButtons";
import clearMainFormOnCancel from "@features/quick-reply/clearMainFormOnCancel";
import "./styles/quick-reply/style.scss";

const main = () => {
  clearMainFormOnCancel();
  clipboardImagePaste();
  editableFilename();
  compactFormattingButtons();
};

try {
  runWhenElementExists(QuickreplySelectorsEnum.ROOT, main);
} catch (err) {
  console.log("[quick-reply]", err);
}
