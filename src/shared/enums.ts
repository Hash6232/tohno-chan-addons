export const enum SelectorsEnum {
  POST_FORM_MAIN = "body > form[name='post']",
  POST_FORM_TEXTAREA = SelectorsEnum.POST_FORM_MAIN + " textarea[name='body']",

  QR = "form#quick-reply",
  QR_CLOSE = SelectorsEnum.QR + " a.close-btn",
  QR_TEXTAREA = SelectorsEnum.QR + " textarea[name='body']",
  QR_FORMATTING_ROW = SelectorsEnum.QR + " tr:has(input[name='b'])",
  QR_UPLOAD_ROW = SelectorsEnum.QR + " #upload",
  QR_FILEINPUT = SelectorsEnum.QR + " #upload_file",
  QR_SPOILER_COL = SelectorsEnum.QR_UPLOAD_ROW + " .spoiler",
}
