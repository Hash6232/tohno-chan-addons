export const runOnDOMLoaded = (callback: (...args: any[]) => any, query: string | string[]) => {
  // If any of the elements exist, execute the callback immediately
  for (const node of [query].flat()) {
    if (node) {
      callback();
      return;
    }
  }

  /* If the element doesn't exist yet, wait for content to finish loading */
  document.addEventListener("DOMContentLoaded", () => callback());
};

export const runWhenElementExists = (callback: (...args: any[]) => any, query: string, cleanup = false) => {
  // If the element exists, execute the callback immediately
  if (document.body.querySelector(query)) {
    callback();
    return;
  }

  // If the element doesn't exist yet, use MutationObserver to check
  const observer = new MutationObserver((mutationsList, observerInstance) => {
    for (const mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType === 1 && (addedNode as HTMLElement).matches(query)) {
          callback();
          cleanup && observerInstance.disconnect(); // Disconnect observer if cleanup is true
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

export const lazyLoading = (
  nodes: NodeListOf<Element>,
  callbacks: ((node: HTMLElement) => any)[],
  options?: IntersectionObserverInit
) => {
  if (nodes.length < 1) return;

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
      root: null, // Observes relative to the viewport
      rootMargin: "0px", // No margin (adjust if needed)
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  );

  nodes.forEach((node) => observer.observe(node));
};

const formatRelativeTime = (diffInSeconds: number, isPast = true) => {
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

export const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  return formatRelativeTime(Math.abs(diffInSeconds), diffInSeconds > 0);
};
