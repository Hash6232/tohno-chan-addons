(function () {
    'use strict';

    var Data;
    (function (Data) {
        Data.updateFile = (file, options) => {
            return new File([file], options.filename ?? file.name, {
                type: file.type,
                lastModified: options.lastModified ?? file.lastModified,
            });
        };
        Data.isImage = (file) => {
            return file.type.startsWith("image/");
        };
        Data.getDataURL = (file) => {
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
        (function (Clipboard) {
            Clipboard.getImage = (clipboard) => {
                if (clipboard.files.length !== 1)
                    return null;
                const image = clipboard.files[0];
                return Data.isImage(image) ? image : null;
            };
        })(Data.Clipboard || (Data.Clipboard = {}));
        (function (Fetch) {
            Fetch.getImage = async (url) => {
                try {
                    const res = await fetch(url);
                    if (!res.ok)
                        throw new Error("Request failed with status code: " + res.status);
                    const blob = await res.blob();
                    if (!Data.isImage(blob))
                        throw new Error("Wrong file type: " + blob.type);
                    const pathname = new URL(url).pathname;
                    const filename = pathname.split("/").pop() ?? "file";
                    return new File([blob], filename, { type: blob.type });
                }
                catch (err) {
                    console.log(err);
                }
            };
        })(Data.Fetch || (Data.Fetch = {}));
        (function (Form) {
            Form.hasFile = (input) => {
                return (input.files?.length ?? 0) > 0;
            };
            Form.getFiles = (input) => {
                return Form.hasFile(input) ? input.files : null;
            };
            Form.addFile = (input, file) => {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event("change", { bubbles: true }));
            };
        })(Data.Form || (Data.Form = {}));
    })(Data || (Data = {}));
    var DOM;
    (function (DOM) {
        DOM.onContentLoaded = (callback, query) => {
            for (const node of [query].flat()) {
                if (node) {
                    callback();
                    return;
                }
            }
            document.addEventListener("DOMContentLoaded", () => callback());
        };
        DOM.onElementLoaded = (callback, query, cleanup = false) => {
            if (document.body.querySelector(query)) {
                callback();
                return;
            }
            const observer = new MutationObserver((mutationsList, observerInstance) => {
                for (const mutation of mutationsList) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === 1 && addedNode.matches(query)) {
                            callback();
                            cleanup && observerInstance.disconnect();
                            return;
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        };
        DOM.onElementVisible = (node, callbacks, options) => {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting)
                        return;
                    if (entry.target.nodeType !== 1)
                        return;
                    for (const callback of callbacks)
                        callback(entry.target);
                    observer.unobserve(entry.target);
                });
            }, options ?? {
                root: null,
                rootMargin: "0px",
                threshold: 0.1,
            });
            observer.observe(node);
        };
    })(DOM || (DOM = {}));
    var Time;
    (function (Time) {
        const formatToRelative = (diffInSeconds, isPast) => {
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
        Time.dateStringToRelative = (dateString) => {
            const now = new Date();
            const past = new Date(dateString);
            const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
            return formatToRelative(Math.abs(diffInSeconds), diffInSeconds > 0);
        };
    })(Time || (Time = {}));

    const handleCursorHover = (e) => {
        const time = e.currentTarget;
        if (!time)
            return;
        time.title = Time.dateStringToRelative(time.dateTime);
    };
    const addRelativeTime = (post) => {
        const time = post.querySelector("time");
        if (!time)
            return;
        time.addEventListener("mouseenter", handleCursorHover);
    };

    const main = () => {
        const posts = document.querySelectorAll("body > form[name='postcontrols'] .thread .post" + ":not(.hidden)");
        posts.forEach((post) => DOM.onElementVisible(post, [addRelativeTime]));
    };
    try {
        DOM.onContentLoaded(main, "body > form[name='post']");
    }
    catch (err) {
        console.log("[posts-addon]", err);
    }

})();
//# sourceMappingURL=posts-addon.js.map
