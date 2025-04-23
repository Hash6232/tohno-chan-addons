export const enum QuickreplySelectorsEnum {
  ROOT = "#quick-reply",
  CLOSE = QuickreplySelectorsEnum.ROOT + " a.close-btn",
  TEXTAREA = QuickreplySelectorsEnum.ROOT + " textarea[name='body']",
  UPLOAD_ROW = QuickreplySelectorsEnum.ROOT + " tr#upload",
  FILEINPUT = QuickreplySelectorsEnum.ROOT + " input#upload_file",
}
