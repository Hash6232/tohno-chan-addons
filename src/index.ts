import { SelectorsEnum } from "@shared/enums";
import { DOMUtils } from "@shared/utils/globalUtils";
import addRelativeTime from "./features/posts/add-relative-time";
import clearFormOnCancel from "./features/quick-reply/clear-form-on-cancel";
import clipboardImagePaste from "./features/quick-reply/clipboard-image-paste";
import fileinputToolbar from "./features/quick-reply/fileinput-toolbar";
import renameableFileinput from "./features/quick-reply/renameable-fileinput";
import "./styles/global.scss";

const main = () => {
  DOMUtils.onElementLoaded(() => {
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
  }, SelectorsEnum.QR);
};

try {
  DOMUtils.onContentLoaded(main, SelectorsEnum.FORM);
} catch (err) {
  console.log("[tohno-chan-addons]", err);
}
