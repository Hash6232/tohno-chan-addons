import { Selectors as S } from "@shared/enums";

const focusOnLoadFeature = (form: HTMLFormElement) => {
  const textarea = form.querySelector<HTMLTextAreaElement>(S.Form.TEXTAREA);

  if (!textarea) return;

  textarea.focus();
};

export default focusOnLoadFeature;
