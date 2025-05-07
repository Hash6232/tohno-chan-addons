const Config = {
  allowed_files: {
    bmp: "image/bmp",
    flac: "audio/flac",
    // flv: "video/x-flv",
    gif: "image/gif",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    // pdf: "application/pdf",
    png: "image/png",
    // rar: "application/x-rar-compressed",
    // swf: "application/x-shockwave-flash",
    // txt: "text/plain",
    webm: "video/webm",
    // webp: "image/webp",
    // zip: "application/zip",
  },
  max_filesize: 2500,
  max_image: 1,
} as const;

export namespace AllowedTypes {
  export type Files = typeof Config.allowed_files;
  export type Extensions = keyof Files;
  export type Mimes = Files[Extensions];
  export type ImageExtensions = keyof Pick<Files, "bmp" | "gif" | "jpg" | "jpeg" | "png" >; // | "webp"
  export type ImageMimes = Files[ImageExtensions];
  export type ImageFiles = Pick<Files, ImageExtensions>;
  export type VideoExtensions = keyof Pick<Files, "mp4" | "webm">; // "flv" |
  export type VideoMimes = Files[VideoExtensions];
  export type VideoFiles = Pick<Files, VideoExtensions>;
  export type AudioExtensions = keyof Pick<Files, "flac" | "mp3">;
  export type AudioMimes = Files[AudioExtensions];
  export type AudioFiles = Pick<Files, AudioExtensions>;
  export type MediaExtensions = ImageExtensions | VideoExtensions | AudioExtensions; // | "swf"
  export type MediaMimes = Files[MediaExtensions];
  export type MediaFiles = Pick<Files, MediaExtensions>;
  export type OtherExtensions = keyof Omit<Files, MediaExtensions>;
  export type OtherMimes = Files[OtherExtensions];
  export type OtherFiles = Pick<Files, OtherExtensions>;
}

export default Config;
