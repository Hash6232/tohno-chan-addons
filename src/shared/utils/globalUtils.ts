import { ErrorsEnum } from "@shared/enums";

export namespace Data {
  export const isImage = (file: File | Blob) => {
    return file.type.startsWith("image/");
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

  export namespace Clipboard {
    export const getImage = (clipboard: DataTransfer) => {
      if (clipboard.files.length !== 1) return null;

      const image = clipboard.files[0];

      return Data.isImage(image) ? image : null;
    };
  }

  export namespace Fetch {
    export const getImage = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(ErrorsEnum.RES_FAILED + res.status);

        const blob = await res.blob();

        if (!isImage(blob)) throw new Error(ErrorsEnum.WRONG_FILE_TYPE + blob.type);

        const pathname = new URL(url).pathname;
        const filename = pathname.split("/").pop() ?? "file";

        return new File([blob], filename, { type: blob.type });
      } catch (err) {
        console.log(err);
      }
    };
  }

  export namespace Form {
    export const hasFile = (input: HTMLInputElement) => {
      return (input.files?.length ?? 0) > 0;
    };

    export const getFiles = (input: HTMLInputElement) => {
      return hasFile(input) ? input.files : null;
    };
  }
}

export namespace DOM {
  export const onContentLoaded = (callback: (...args: any[]) => any, query: string | string[]) => {
    for (const node of [query].flat()) {
      if (node) {
        callback();
        return;
      }
    }

    document.addEventListener("DOMContentLoaded", () => callback());
  };

  export const onElementLoaded = (callback: (...args: any[]) => any, query: string, cleanup = false) => {
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

  export const onElementVisible = (
    node: Element,
    callbacks: ((node: HTMLElement) => any)[],
    options?: IntersectionObserverInit
  ) => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.nodeType !== 1) return;

          for (const callback of callbacks) callback(entry.target as HTMLElement);
          // console.log("Finished parsing", entry.target); // debug

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

export namespace Time {
  const formatToRelative = (diffInSeconds: number, isPast: boolean) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const delta = isPast ? -1 : 1;

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

  export const dateStringToRelative = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    return formatToRelative(Math.abs(diffInSeconds), diffInSeconds > 0);
  };
}
