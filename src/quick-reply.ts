import { runWhenElementExists } from "./utils/observe";
import { QuickreplySelectors } from "./enums/selectors/quickreplySelectorsEnum";
import { editableFilename } from "./features/quick-reply/editableFilename";
import { clipboardImagePaste } from "./features/quick-reply/clipboardImagePaste";

const FILENAME = "quick-reply" as const;

const main = () => {
  clipboardImagePaste();
  editableFilename();
};

try {
  runWhenElementExists(QuickreplySelectors.ROOT, main);
} catch (err) {
  console.log(`[${FILENAME}]`, err);
}
