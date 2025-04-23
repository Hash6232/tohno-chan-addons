import { runWhenElementExists } from "./utils/observe";
import { QuickreplySelectors } from "./enums/selectors/quickreplySelectorsEnum";
import { editableFilename } from "./features/quick-reply/editableFilename";
import { clipboardImagePaste } from "./features/quick-reply/clipboardImagePaste";

const main = () => {
  clipboardImagePaste();
  editableFilename();
};

try {
  runWhenElementExists(QuickreplySelectors.ROOT, main);
} catch (err) {
  console.log("[quick-reply]", err);
}
