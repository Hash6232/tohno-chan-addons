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
}

export default ImageUtils;
