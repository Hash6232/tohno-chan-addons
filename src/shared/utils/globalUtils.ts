export namespace DateUtils {
  const formatToRelative = (diffInSeconds: number) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const delta = diffInSeconds > 0 ? -1 : 1;

    if (diffInSeconds < 60) {
      return rtf.format(diffInSeconds * delta, "second");
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return rtf.format(diffInMinutes * delta, "minute");
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return rtf.format(diffInHours * delta, "hour");
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return rtf.format(diffInDays * delta, "day");
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return rtf.format(diffInMonths * delta, "month");
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return rtf.format(diffInYears * delta, "year");
  };

  export const toRelative = (date: Date) => {
    const now = new Date();
    const past = new Date(date);

    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    return formatToRelative(Math.abs(diff));
  };
}

export namespace DOMUtils {
  export const onContentLoaded = (callback: () => void, query: string | string[]) => {
    for (const node of [query].flat()) {
      if (node) {
        callback();
        return;
      }
    }

    document.addEventListener("DOMContentLoaded", () => callback());
  };

  export const onElementLoaded = (callback: () => void, query: string, cleanup = false) => {
    if (document.body.querySelector(query)) {
      callback();
      return;
    }

    const observer = new MutationObserver((mutationsList, observerInstance) => {
      for (const mutation of mutationsList) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === 1 && (addedNode as HTMLElement).matches(query)) {
            callback();
            cleanup && observerInstance.disconnect();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  export const onElementVisible = (node: Element, callback: () => void, options?: IntersectionObserverInit) => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.nodeType !== 1) return;

          callback();

          observer.unobserve(entry.target); // Stop firing after first match
        });
      },
      options ?? {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
  };
}

export namespace FormUtils {
  export const setInputFile = (input: HTMLInputElement, file: File) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    input.files = dataTransfer.files;

    input.dispatchEvent(new Event("change", { bubbles: true }));
  };
}

export namespace StringUtils {
  export const templateHandler = (strings: TemplateStringsArray, ...values: (string | number)[]) =>
    String.raw({ raw: strings }, ...values);
}

export namespace ValidationUtils {
  export const inputHasFile = (input: HTMLInputElement) => {
    return input.files && input.files.length > 0;
  };

  type ImageMime = "image/jpeg" | "image/png" | "image/gif";

  export const fileIsImage = (file: File | Blob, mime?: ImageMime[]) => {
    if (mime && mime.length > 0) {
      return mime.some((type) => file.type.startsWith(type));
    }

    return file.type.startsWith("image/");
  };

  type VideoMime = "video/mp4" | "video/webm";

  export const fileIsVideo = (file: File | Blob, mime?: VideoMime[]) => {
    if (mime && mime.length > 0) {
      return mime.some((type) => file.type.startsWith(type));
    }

    return file.type.startsWith("video/");
  };

  export const filesizeIsTooBig = (file: File | Blob, kilobytes = 2500) => {
    return file.size > kilobytes * 1024;
  };
}
