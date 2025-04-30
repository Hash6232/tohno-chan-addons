import { SelectorsEnum } from "@shared/enums";
import { DOMUtils } from "@shared/utils/globalUtils";
import addRelativeTime from "./features/posts/add-relative-time";
import clearFormOnCancel from "./features/quick-reply/clear-form-on-cancel";
import clipboardImagePaste from "./features/quick-reply/clipboard-image-paste";
import compressLargeImages from "./features/quick-reply/compress-large-images";
import fileinputToolbar from "./features/quick-reply/fileinput-toolbar";
import keyboardShortcut from "./features/quick-reply/keyboard-shortcut";
import renameableFileinput from "./features/quick-reply/renameable-fileinput";
import "./styles/global.scss";

const main = () => {
  DOMUtils.onElementLoaded(() => {
    keyboardShortcut();

    const posts = document.querySelectorAll(SelectorsEnum.POST + ":not(.hidden)");
    posts.forEach((post) =>
      DOMUtils.onElementVisible(post, () => {
        addRelativeTime(post);
      })
    );
  }, SelectorsEnum.THREAD);

  DOMUtils.onElementLoaded(() => {
    renameableFileinput();
    clearFormOnCancel();
    clipboardImagePaste();
    fileinputToolbar();
    compressLargeImages();
  }, SelectorsEnum.QR);
};

try {
  DOMUtils.onContentLoaded(main, SelectorsEnum.FORM);
} catch (err) {
  console.log("[tohno-chan-addons]", err);
}
