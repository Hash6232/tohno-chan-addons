export const enum SelectorsEnum {
  CATALOG = "body > div.#Grid",
  CATALOG_THREAD = SelectorsEnum.CATALOG + " > div.mix",
  INDEX = "body > form[name='postcontrols']",
  THREAD = SelectorsEnum.INDEX + " .thread",
  POST = SelectorsEnum.THREAD + " .post",

  FORM = "body > form[name='post']",
  FORM_TEXTAREA = SelectorsEnum.FORM + " textarea[name='body']",

  QR = "form#quick-reply",
  QR_CLOSE = SelectorsEnum.QR + " a.close-btn",
  QR_TEXTAREA = SelectorsEnum.QR + " textarea[name='body']",
  QR_FORMATTING_ROW = SelectorsEnum.QR + " tr:has(input[name='b'])",
  QR_UPLOAD_ROW = SelectorsEnum.QR + " #upload",
  QR_FILEINPUT = SelectorsEnum.QR + " #upload_file",
  QR_SPOILER_COL = SelectorsEnum.QR_UPLOAD_ROW + " .spoiler",
}
