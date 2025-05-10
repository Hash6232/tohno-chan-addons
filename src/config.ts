import { FileFormats } from "@shared/enums";

type AllowedImages = Exclude<FileFormats.Image, FileFormats.Image.WEBP>[];
type AllowedVideos = Exclude<FileFormats.Video, FileFormats.Video.FLV>[];
type AllowedAudios = FileFormats.Audio[];

const Config = {
  allowed_ext: {
    image: [
      FileFormats.Image.BMP,
      FileFormats.Image.GIF,
      FileFormats.Image.JPG,
      FileFormats.Image.JPEG,
      FileFormats.Image.PNG,
    ] as AllowedImages,
    video: [FileFormats.Video.MP4, FileFormats.Video.WEBM] as AllowedVideos,
    audio: [FileFormats.Audio.FLAC, FileFormats.Audio.MP3] as AllowedAudios,
  },
  max_filesize: 10000,
  max_image: 1,
};

export default Config;
