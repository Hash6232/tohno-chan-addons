import { runWhenElementExists } from "@utils/observe";
import { QuickreplySelectorsEnum } from "@enums/selectorsEnum";
import { editableFilename } from "@features/quick-reply/editableFilename";
import { clipboardImagePaste } from "@features/quick-reply/clipboardImagePaste";
import { compactFormattingButtons } from "@features/quick-reply/compactFormattingButtons";

const main = () => {
  clipboardImagePaste();
  editableFilename();
  compactFormattingButtons();
};

try {
  runWhenElementExists(QuickreplySelectorsEnum.ROOT, main);
} catch (err) {
  console.log("[quick-reply]", err);
}
