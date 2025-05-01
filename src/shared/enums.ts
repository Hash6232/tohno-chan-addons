export namespace Selectors {
  export enum Form {
    POST = "form[name='post']",
    POST_QR = Form.POST + "#quick-reply",
    TEXTAREA = "textarea[name='body']",
    INPUT_FILE = "input[name='file']",
    SPOILER = "input[name='spoiler']",
    CLOSE_QR = "a.close-btn",
  }

  export enum Index {
    INDEX = "form[name='postcontrols']",
    THREAD = ".thread",
    POST = ".post",
  }
}
