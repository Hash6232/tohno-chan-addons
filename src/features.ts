import filePasteFeature from "./form/filePaste";
import fileRenameFeature from "./form/fileRename";
import fileToolbarFeature from "./form/fileToolbar";
import imageCompressFeature from "./form/imageCompress";
import relativeTimeFeature from "./posts/relativeTime";
import clearOnCloseFeature from "./quickReply/clearOnClose";
import focusOnLoadFeature from "./quickReply/focusOnLoad";
import showonKeyupFeature from "./quickReply/showOnKeyup";

namespace Features {
  export namespace Form {
    export const pasteFileFromClipboard = filePasteFeature;
    export const allowFileRenaming = fileRenameFeature;
    export const addFileToolbar = fileToolbarFeature;
    export const autoCompressBigImages = imageCompressFeature;
  }

  export namespace Post {
    export const relativeTimeOnHover = relativeTimeFeature;
  }

  export namespace QuickReply {
    export const clearFormOnClose = clearOnCloseFeature;
    export const focusTextareaOnLoad = focusOnLoadFeature;
    export const showOnShortcutPressed = showonKeyupFeature;
  }
}

export default Features;
