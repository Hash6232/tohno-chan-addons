import { FileFormats } from "@shared/enums";
import { default as C } from "../../config";
import { ValidationUtils } from "./globalUtils";

type DataURL = string | ArrayBuffer | null;

namespace FileUtils {
  export const mimeToExt = (mimeInput: string) => {
    for (const type of Object.values(FileFormats))
      for (const [ext, mime] of Object.entries(type)) if (mime === mimeInput) return ext;
  };

  export const extToMime = (ext: string) => {
    for (const type of Object.values(FileFormats))
      if (ext in type) return type[ext as keyof typeof type]
  };

  export const toDataURL = (file: File) => {
    return new Promise<DataURL | undefined>((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener("load", ({ target }) => {
        resolve(target?.result);
      });

      reader.addEventListener("error", (err) => {
        reject(err);
      });

      reader.readAsDataURL(file);
    });
  };

  export const fetchFile = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error code: " + res.status);

      const blob = await res.blob();

      if (!ValidationUtils.fileIsAllowed(blob)) throw new Error("File type not allowd: " + blob);

      const pathname = new URL(url).pathname;
      const extension = mimeToExt(blob.type);
      const fallback = "file" + (extension ? "." + extension : "");
      const filename = pathname.split("/").pop() ?? fallback;

      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.log(err);
    }
  };

  export const compressImage = async (file: File, limit = 2500) => {
    const validFormats: typeof C.allowed_ext.image = [
      FileFormats.Image.BMP,
      FileFormats.Image.JPG,
      FileFormats.Image.JPEG,
      FileFormats.Image.PNG,
    ];

    if (!ValidationUtils.fileIsValidImage(file, validFormats)) return null;

    const toImageElement = async (file: File) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    const imageElement = await toImageElement(file);

    // Set up canvas with original image dimensions
    const canvas = document.createElement("canvas");
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(imageElement, 0, 0);

    const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) => {
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), FileFormats.Image.JPEG, quality);
      });
    };

    // Start compression loop
    let quality = 0.95;
    let blob = await canvasToBlob(canvas, quality);

    while (blob && ValidationUtils.filesizeIsTooBig(blob, limit) && quality > 0.1) {
      quality -= 0.05;
      blob = await canvasToBlob(canvas, quality);
    }

    if (!blob) return null;

    const newFilename = file.name.replace(/\.png$/, ".jpeg");
    const options = { type: blob.type, lastModified: file.lastModified };

    return new File([blob], newFilename, options);
  };
}

export default FileUtils;
