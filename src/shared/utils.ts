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
