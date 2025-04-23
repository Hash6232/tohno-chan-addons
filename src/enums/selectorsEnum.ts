export const enum MainSelectorsEnum {
  POST_FORM = "body > form[name='post']",
  POST_FORM_TEXTAREA = MainSelectorsEnum.POST_FORM + " textarea[name='body']",
}

export const enum QuickreplySelectorsEnum {
  ROOT = "#quick-reply",
  CLOSE = QuickreplySelectorsEnum.ROOT + " a.close-btn",
  TEXTAREA = QuickreplySelectorsEnum.ROOT + " textarea[name='body']",
  UPLOAD_ROW = QuickreplySelectorsEnum.ROOT + " #upload",
  FILEINPUT = QuickreplySelectorsEnum.ROOT + " #upload_file",
  FORMATTING_ROW = QuickreplySelectorsEnum.ROOT + " tr:has(input[name='b'])",
}
