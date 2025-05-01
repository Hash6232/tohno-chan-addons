import { Selectors as S } from "@shared/enums";
import { DOMUtils } from "@shared/utils/globalUtils";
import filePasteFeature from "./features/form/file-paste";
import fileRenameFeature from "./features/form/file-rename";
import fileToolbarFeature from "./features/form/file-toolbar";
import imageCompressFeature from "./features/form/image-compress";
import relativeTimeFeature from "./features/posts/relative-time";
import clearFormOnCloseFeature from "./features/quick-reply/clear-form-on-close";
import keybindToggleFeature from "./features/quick-reply/keybind-toggle";
import "./styles/global.scss";

const handleThreadFeatures = () => {
  const form = document.querySelector<HTMLFormElement>(S.Index.INDEX);

  if (!form) return;

  const posts = form.querySelectorAll(S.Index.POST + ":not(.hidden)");
  posts.forEach((post) =>
    DOMUtils.onElementVisible(post, () => {
      relativeTimeFeature(post);
    })
  );
};

const handleMainFormFeatures = () => {
  const form = document.querySelector<HTMLFormElement>(S.Form.POST);

  if (!form) return;

  filePasteFeature(form);
  fileRenameFeature(form);
  fileToolbarFeature(form);
  imageCompressFeature(form);
};

const handleQuickreplyFeatures = () => {
  const form = document.querySelector<HTMLFormElement>(S.Form.POST_QR);

  if (!form) return;

  filePasteFeature(form);
  fileRenameFeature(form);
  fileToolbarFeature(form);
  imageCompressFeature(form);
  clearFormOnCloseFeature(form);
};

const main = () => {
  /* Thread */
  DOMUtils.onElementLoaded(handleThreadFeatures, S.Index.INDEX, true);

  /* New post form */
  DOMUtils.onElementLoaded(handleMainFormFeatures, S.Form.POST, true);

  /* Quick reply form */
  keybindToggleFeature();
  DOMUtils.onElementLoaded(handleQuickreplyFeatures, S.Form.POST_QR);
};

try {
  DOMUtils.onContentLoaded(main, S.Index.INDEX);
} catch (err) {
  console.log("[tohno-chan-addons]", err);
}
