import { runWhenElementExists } from "@utils/observe";
import { QuickreplySelectorsEnum } from "@enums/selectorsEnum";
import { editableFilename } from "@features/quick-reply/editableFilename";
import { clipboardImagePaste } from "@features/quick-reply/clipboardImagePaste";

const main = () => {
  clipboardImagePaste();
  editableFilename();
};

try {
  runWhenElementExists(QuickreplySelectorsEnum.ROOT, main);
} catch (err) {
  console.log("[quick-reply]", err);
}
