export namespace FileFormats {
  export enum Image {
    BMP = "image/bmp",
    GIF = "image/gif",
    JPG = "image/jpeg",
    JPEG = "image/jpeg",
    PNG = "image/png",
    WEBP = "image/webp",
  }

  export enum Video {
    FLV = "video/x-flv",
    MP4 = "video/mp4",
    WEBM = "video/webm",
  }

  export enum Audio {
    FLAC = "audio/flac",
    MP3 = "audio/mpeg",
  }
}

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
