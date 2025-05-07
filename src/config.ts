const Config = {
  allowed_ext: {
    image: {
      bmp: "image/bmp",
      gif: "image/gif",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      // webp: "image/webp",
    },
    video: {
      // flv: "video/x-flv",
      mp4: "video/mp4",
      webm: "video/webm",
    },
    audio: {
      flac: "audio/flac",
      mp3: "audio/mpeg",
    },
    other: {
      // pdf: "application/pdf",
      // rar: "application/x-rar-compressed",
      // swf: "application/x-shockwave-flash",
      // txt: "text/plain",
      // zip: "application/zip",
    },
  },
  max_filesize: 2500,
  max_image: 1,
} as const;

export namespace AllowedTypes {
  export type ImageExtensions = keyof typeof Config.allowed_ext.image;
  export type VideoExtensions = keyof typeof Config.allowed_ext.video;
  export type AudioExtensions = keyof typeof Config.allowed_ext.audio;
  export type MediaExtensions = ImageExtensions | VideoExtensions | AudioExtensions;
  export type OtherExtensions = keyof typeof Config.allowed_ext.other;
  export type ImageMimes = typeof Config.allowed_ext.image[ImageExtensions];
  export type VideoMimes = typeof Config.allowed_ext.video[VideoExtensions];
  export type AudioMimes = typeof Config.allowed_ext.audio[AudioExtensions];
  export type MediaMimes = ImageMimes | VideoMimes | AudioMimes;
  export type OtherMimes = typeof Config.allowed_ext.other[OtherExtensions];
  export type AllExtensions = MediaExtensions | OtherExtensions;
  export type AllMimes = MediaMimes | OtherMimes;
}

export default Config;
