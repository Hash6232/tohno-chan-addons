import { SelectorsEnum } from "@shared/enums";
import { runWhenElementExists } from "@shared/utils/globalUtils";
import clearFormOnCancel from "./features/clear-form-on-cancel";
import clipboardImagePaste from "./features/clipboard-image-paste";
import fileinputToolbar from "./features/fileinput-toolbar";
import renameableFileinput from "./features/renameable-fileinput";

const main = () => {
  renameableFileinput();
  clearFormOnCancel();
  clipboardImagePaste();
  fileinputToolbar();
};

try {
  runWhenElementExists(main, SelectorsEnum.QR);
} catch (err) {
  console.log("[quick-reply-addon]", err);
}
