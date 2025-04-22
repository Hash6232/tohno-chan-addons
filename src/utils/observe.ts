export const runWhenElementExists = (query: string, callback: (...args: any[]) => any, cleanup = false) => {
  if (document.body.querySelector(query)) return callback();

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
