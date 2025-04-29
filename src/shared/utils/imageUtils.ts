import { ValidationUtils } from "./globalUtils";

type DataURL = string | ArrayBuffer | null;

namespace ImageUtils {
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

  export const fetchImage = async (url: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error code: " + res.status);

      const blob = await res.blob();

      if (!ValidationUtils.fileIsImage(blob))
        throw new Error("Wrong MIME type: " + blob.type);

      const pathname = new URL(url).pathname;
      const filename = pathname.split("/").pop() ?? "file.png";

      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.log(err);
    }
  };

  export const compressImage = async (file: File | Blob, limit = 2500) => {
    if (!ValidationUtils.fileIsImage(file, ["image/jpeg", "image/png"])) return null;

    const toImageElement = async (file: File | Blob) => {
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

    return blob;
  };
}

export default ImageUtils;
