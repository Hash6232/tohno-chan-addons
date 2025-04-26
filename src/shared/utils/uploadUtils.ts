export const hasAttachment = (fileinput: HTMLInputElement) => {
  return (fileinput.files?.length ?? 0) > 0;
};

export const fileIsImage = (file: File) => {
  return file.type.startsWith("image/");
};

export const getImageFromInput = (fileinput: HTMLInputElement) => {
  if (!hasAttachment(fileinput)) return null;

  const file = fileinput.files![0];

  return fileIsImage(file) ? file : null;
};

type DataURL = string | ArrayBuffer | null;

export const getDataURL = (file: File): Promise<DataURL | undefined> => {
  return new Promise((resolve, reject) => {
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
