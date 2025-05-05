import { ValidationUtils } from "./globalUtils";

type DataURL = string | ArrayBuffer | null;

namespace FileUtils {
  export const getBlobExtension = (blob: Blob) => {
    let extension = "";

    switch (blob.type) {
      case "image/jpeg":
        extension = ".jpg";
        break;
      case "image/png":
        extension = ".png";
        break;
      case "image/gif":
        extension = ".gif";
        break;
      case "video/mp4":
        extension = ".mp4";
        break;
      case "audio/mpeg":
        extension = ".mp3";
        break;
      case "video/webm":
        extension = ".webm";
        break;
      case "application/pdf":
        extension = ".pdf";
        break;
      case "application/x-shockwave-flash":
        extension = ".swf";
        break;
    }

    return extension;
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

      const pathname = new URL(url).pathname;
      const filename = pathname.split("/").pop() ?? "file" + getBlobExtension(blob);

      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.log(err);
    }
  };

  export const compressImage = async (file: File, limit = 2500) => {
    if (!ValidationUtils.fileIsImage(file, ["image/jpeg", "image/png"])) return null;

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
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
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
