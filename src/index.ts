import { Selectors as S } from "@shared/enums";
import { DOMUtils } from "@shared/utils/globalUtils";
import Features from "./features";
import "./styles/global.scss";

const handleThreadFeatures = () => {
  const form = document.querySelector<HTMLFormElement>(S.Index.INDEX);

  if (!form) return;

  const posts = form.querySelectorAll(S.Index.POST + ":not(.hidden)");
  posts.forEach((post) =>
    DOMUtils.onElementVisible(post, () => {
      Features.Post.relativeTimeOnHover(post);
    })
  );
};

const handleMainFormFeatures = () => {
  const form = document.querySelector<HTMLFormElement>(S.Form.POST);

  if (!form) return;

  Features.Form.pasteFileFromClipboard(form);
  Features.Form.allowFileRenaming(form);
  Features.Form.addFileToolbar(form);
  Features.Form.autoCompressBigImages(form);
};

const handleQuickreplyFeatures = () => {
  const form = document.querySelector<HTMLFormElement>(S.Form.POST_QR);

  if (!form) return;

  Features.QuickReply.clearFormOnClose(form);
  Features.QuickReply.focusTextareaOnLoad(form);
  
  Features.Form.pasteFileFromClipboard(form);
  Features.Form.allowFileRenaming(form);
  Features.Form.addFileToolbar(form);
  Features.Form.autoCompressBigImages(form);
};

const main = () => {
  /* Thread */
  DOMUtils.onElementLoaded(handleThreadFeatures, S.Index.INDEX, true);

  /* Main post form */
  DOMUtils.onElementLoaded(handleMainFormFeatures, S.Form.POST, true);

  /* Quick reply post form */
  Features.QuickReply.showOnShortcutPressed();
  DOMUtils.onElementLoaded(handleQuickreplyFeatures, S.Form.POST_QR);
};

try {
  DOMUtils.onContentLoaded(main, S.Index.INDEX);
} catch (err) {
  console.log("[tohno-chan-addons]", err);
}
