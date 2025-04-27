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

    const handleCloseButtonClick = () => {
        const textarea = document.querySelector("body > form[name='post'] textarea[name='body']");
        if (!textarea)
            return;
        textarea.value = "";
    };
    const clearFormOnCancel = () => {
        const cancelButton = document.querySelector("form#quick-reply a.close-btn");
        if (!cancelButton)
            return;
        cancelButton.addEventListener("click", () => handleCloseButtonClick());
    };

    const clipboardImagePaste = () => {
        const textarea = document.querySelector("form#quick-reply textarea[name='body']");
        const fileinput = document.querySelector("form#quick-reply #upload_file");
        textarea?.addEventListener("paste", (e) => {
            const clipboard = e.clipboardData;
            if (!clipboard)
                return;
            const image = Data.Clipboard.getImage(clipboard);
            if (!image || !fileinput)
                return;
            Data.Form.addFile(fileinput, image);
        });
    };

    const createNewButtonTemplate = ({ label, title }) => {
        return `<div title="${title}" class="btn-container btn"><a href="javascript:;">${label}</a></div>`;
    };
    const createNewToggleTemplate = ({ label, title, id }) => {
        return (`<div title="${title}" class="btn-container toggle">` +
            `<input id="${id}" type="checkbox" />` +
            `<label for="${id}">${label}</label>` +
            `</div>`);
    };

    var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=true===r.prepend?"prepend":"append",d=true===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

    var css$1 = "#quick-reply #upload .spoiler{padding-right:0}#quick-reply #upload .spoiler>input,#quick-reply #upload .spoiler>label{display:none}#quick-reply:has(#upload_file:not(.has-attachment)) .btn-container[data-if=attachment]{display:none}#quick-reply:has(#upload_file:not(.has-image)) .btn-container[data-if=image]{display:none}#quick-reply .q-toolbar-buttons{--btn-size:14px;align-items:center;display:flex;gap:4px;justify-content:end;padding-right:2px}#quick-reply .q-toolbar-buttons .btn-container{align-items:center;border:1px solid;border-radius:2px;box-sizing:border-box;display:inline-flex;font-family:monospace;font-size:var(--btn-size,14px);height:var(--btn-size,14px);justify-content:center;position:relative;width:var(--btn-size,14px)}#quick-reply .q-toolbar-buttons .btn-container>:before{bottom:0;content:\"\";cursor:pointer;left:0;position:absolute;right:0;top:0}#quick-reply .q-toolbar-buttons .btn-container label{font-size:var(--btn-size,14px)}#quick-reply .q-toolbar-buttons .btn-container a{color:inherit;text-decoration:none}#quick-reply .q-toolbar-buttons input[type=checkbox]{margin:0;padding:0}#quick-reply .q-toolbar-buttons input[type=checkbox]:checked+.btn-container,#quick-reply .q-toolbar-buttons input[type=checkbox]:checked+label,#quick-reply .q-toolbar-buttons input[type=checkbox]:not(:checked){display:none}#quick-reply #q-remove-image{padding-bottom:2px}#image-preview-modal{align-items:center;background-color:rgba(0,0,0,.3);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;width:100%;z-index:101}#image-preview-modal img{max-height:100%;max-width:100%}";
    n(css$1,{"container":"head","singleTag":true});

    const handleChangeFileinput = (e) => {
        const fileinput = e.target;
        if (!fileinput)
            return;
        if (!Data.Form.hasFile(fileinput)) {
            fileinput.classList.toggle("has-attachment", false);
            fileinput.classList.toggle("has-image", false);
            return;
        }
        fileinput.classList.toggle("has-attachment", true);
        const image = Data.Form.getFiles(fileinput)?.[0];
        if (!image || !Data.isImage(image))
            return;
        fileinput.classList.toggle("has-image", true);
    };
    const handlePreviewImage = (fileinput) => {
        const image = Data.Form.getFiles(fileinput)?.[0];
        if (!image || !Data.isImage(image))
            return;
        Data.getDataURL(image).then((url) => {
            if (!url)
                return;
            const modal = document.createElement("div");
            modal.id = "image-preview-modal";
            modal.innerHTML = `<img src="${url}" />`;
            document.body.appendChild(modal);
            modal.addEventListener("click", ({ currentTarget }) => {
                const modal = currentTarget;
                modal?.remove();
            });
        });
    };
    const handleImportImage = (fileinput) => {
        const url = prompt("Enter a valid image URL:");
        if (!url)
            return;
        Data.Fetch.getImage(url).then((file) => {
            if (!file)
                return;
            Data.Form.addFile(fileinput, file);
        });
    };
    const handleResetFileinput = (fileinput) => {
        fileinput.value = "";
        fileinput.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const fileinputToolbar = () => {
        const fileinput = document.querySelector("form#quick-reply #upload_file");
        const spoilerCol = document.querySelector("form#quick-reply #upload .spoiler");
        if (!fileinput || !spoilerCol)
            return;
        const btnContainer = document.createElement("div");
        btnContainer.className = "q-toolbar-buttons";
        spoilerCol.appendChild(btnContainer);
        const previewImageButtonTemplate = { label: "P", title: "Preview image" };
        btnContainer.insertAdjacentHTML("beforeend", createNewButtonTemplate(previewImageButtonTemplate));
        const previewImageToggle = btnContainer.lastElementChild;
        previewImageToggle.id = "q-preview-image";
        previewImageToggle.dataset.if = "image";
        const spoilerImageToggleTemplate = { label: "S", title: "Spoiler image", id: "q-spoiler-image-custom" };
        btnContainer.insertAdjacentHTML("beforeend", createNewToggleTemplate(spoilerImageToggleTemplate));
        const spoilerImageToggle = btnContainer.lastElementChild;
        spoilerImageToggle.name = "spoiler";
        spoilerImageToggle.dataset.if = "image";
        const importImageButtonTemplate = { label: "U", title: "Import image from URL" };
        btnContainer.insertAdjacentHTML("beforeend", createNewButtonTemplate(importImageButtonTemplate));
        const importImageButton = btnContainer.lastElementChild;
        importImageButton.id = "q-import-image";
        const removeAttachmentButtonTemplate = { label: "×", title: "Remove attachment" };
        btnContainer.insertAdjacentHTML("beforeend", createNewButtonTemplate(removeAttachmentButtonTemplate));
        const removeAttachmentButton = btnContainer.lastElementChild;
        removeAttachmentButton.id = "q-remove-attachment";
        removeAttachmentButton.dataset.if = "attachment";
        fileinput.addEventListener("change", handleChangeFileinput);
        previewImageToggle.addEventListener("click", () => handlePreviewImage(fileinput));
        importImageButton.addEventListener("click", () => handleImportImage(fileinput));
        removeAttachmentButton.addEventListener("click", () => handleResetFileinput(fileinput));
    };

    var css = "#quick-reply #upload{background-color:#fff;border:1px solid}#quick-reply #upload>td{cursor:text}#quick-reply #upload_file{display:none}#quick-reply #upload_filename{border:none;outline:none;padding-bottom:0}";
    n(css,{"container":"head","singleTag":true});

    const handleFilenameClick = (fileinput) => {
        if (Data.Form.hasFile(fileinput))
            return;
        fileinput.click();
    };
    const handleFilenameBlur = (e, fileinput) => {
        const filename = e.target;
        if (!filename || !Data.Form.hasFile(fileinput))
            return;
        const originalFile = fileinput.files[0];
        const newFileName = filename.value || originalFile.name;
        if (originalFile.name === newFileName)
            return;
        const updatedFile = Data.updateFile(originalFile, { filename: newFileName });
        Data.Form.addFile(fileinput, updatedFile);
    };
    const handleFileinputChange = (event, filename) => {
        const fileinput = event.target;
        if (!fileinput)
            return;
        if (!Data.Form.hasFile(fileinput)) {
            filename.value = "";
            return;
        }
        filename.value = fileinput.files[0].name;
        const length = filename.value.length;
        filename.setSelectionRange(length, length);
    };
    const handleFileinputCancel = (filename) => {
        filename.blur();
    };
    const renameableFileinput = () => {
        const form = document.querySelector("form#quick-reply");
        const fileinput = document.querySelector("form#quick-reply #upload_file");
        const spoilerCol = document.querySelector("form#quick-reply #upload .spoiler");
        if (!fileinput || !spoilerCol)
            return;
        const inputFieldTemplate = `<input id="upload_filename" type="text" placeholder="Click to upload file" />`;
        fileinput.insertAdjacentHTML("afterend", inputFieldTemplate);
        const filename = document.getElementById("upload_filename");
        if (!form || !filename)
            return;
        filename.addEventListener("click", () => handleFilenameClick(fileinput));
        fileinput.addEventListener("change", (e) => handleFileinputChange(e, filename));
        fileinput.addEventListener("cancel", () => handleFileinputCancel(filename));
        filename.addEventListener("blur", (e) => handleFilenameBlur(e, fileinput));
    };

    const main = () => {
        renameableFileinput();
        clearFormOnCancel();
        clipboardImagePaste();
        fileinputToolbar();
    };
    try {
        DOM.onElementLoaded(main, "form#quick-reply");
    }
    catch (err) {
        console.log("[quick-reply-addon]", err);
    }

})();
//# sourceMappingURL=quick-reply-addon.js.map
