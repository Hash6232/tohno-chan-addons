(function () {
    'use strict';

    var DateUtils;
    (function (DateUtils) {
        const formatToRelative = (diffInSeconds) => {
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
        DateUtils.toRelative = (date) => {
            const now = new Date();
            const past = new Date(date);
            const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
            return formatToRelative(Math.abs(diff));
        };
    })(DateUtils || (DateUtils = {}));
    var DOMUtils;
    (function (DOMUtils) {
        DOMUtils.onContentLoaded = (callback, query) => {
            for (const node of [query].flat()) {
                if (node) {
                    callback();
                    return;
                }
            }
            document.addEventListener("DOMContentLoaded", () => callback());
        };
        DOMUtils.onElementLoaded = (callback, query, cleanup = false) => {
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
        DOMUtils.onElementVisible = (node, callback, options) => {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting)
                        return;
                    if (entry.target.nodeType !== 1)
                        return;
                    callback();
                    observer.unobserve(entry.target);
                });
            }, options ?? {
                root: null,
                rootMargin: "0px",
                threshold: 0.1,
            });
            observer.observe(node);
        };
    })(DOMUtils || (DOMUtils = {}));
    var FormUtils;
    (function (FormUtils) {
        FormUtils.setInputFile = (input, file) => {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            input.dispatchEvent(new Event("change", { bubbles: true }));
        };
        FormUtils.updateInputFilename = (input, filename) => {
            if (!ValidationUtils.inputHasFile(input))
                return;
            const file = input.files?.[0];
            if (!file)
                return;
            const options = { type: file.type, lastModified: file.lastModified };
            FormUtils.setInputFile(input, new File([file], filename || file.name, options));
        };
    })(FormUtils || (FormUtils = {}));
    var ValidationUtils;
    (function (ValidationUtils) {
        ValidationUtils.inputHasFile = (input) => {
            return (input.files?.length ?? 0) > 0;
        };
        ValidationUtils.fileIsImage = (file, mime) => {
            if (mime && mime.length > 0) {
                return mime.some((type) => file.type.startsWith(type));
            }
            return file.type.startsWith("image/");
        };
        ValidationUtils.filesizeIsTooBig = (file, kilobytes = 2500) => {
            return file.size > kilobytes * 1024;
        };
    })(ValidationUtils || (ValidationUtils = {}));

    const handleCursorHover = (e) => {
        const time = e.currentTarget;
        if (!time)
            return;
        time.title = DateUtils.toRelative(new Date(time.dateTime));
    };
    const addRelativeTime = (post) => {
        const time = post.querySelectorAll("time");
        if (time.length < 1)
            return;
        time.forEach(el => el.addEventListener("mouseenter", handleCursorHover));
    };

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
            if (!clipboard || clipboard.files.length < 1)
                return;
            const file = clipboard.files[0];
            if (!ValidationUtils.fileIsImage(file) || !fileinput)
                return;
            FormUtils.setInputFile(fileinput, file);
        });
    };

    var ImageUtils;
    (function (ImageUtils) {
        ImageUtils.toDataURL = (file) => {
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
        ImageUtils.fetchImage = async (url) => {
            try {
                const res = await fetch(url);
                if (!res.ok)
                    throw new Error("Error code: " + res.status);
                const blob = await res.blob();
                if (!ValidationUtils.fileIsImage(blob))
                    throw new Error("Wrong MIME type: " + blob.type);
                const pathname = new URL(url).pathname;
                const filename = pathname.split("/").pop() ?? "file.png";
                return new File([blob], filename, { type: blob.type });
            }
            catch (err) {
                console.log(err);
            }
        };
        ImageUtils.compressImage = async (file, limit = 2500) => {
            if (!ValidationUtils.fileIsImage(file, ["image/jpeg", "image/png"]))
                return null;
            const toImageElement = async (file) => {
                return new Promise((resolve, reject) => {
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
            const canvas = document.createElement("canvas");
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(imageElement, 0, 0);
            const canvasToBlob = (canvas, quality) => {
                return new Promise((resolve) => {
                    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
                });
            };
            let quality = 0.95;
            let blob = await canvasToBlob(canvas, quality);
            while (blob && ValidationUtils.filesizeIsTooBig(blob, limit) && quality > 0.1) {
                quality -= 0.05;
                blob = await canvasToBlob(canvas, quality);
            }
            if (!blob)
                return null;
            const newFilename = file.name.replace(/\.png$/, ".jpeg");
            const options = { type: blob.type, lastModified: file.lastModified };
            return new File([blob], newFilename, options);
        };
    })(ImageUtils || (ImageUtils = {}));
    var ImageUtils$1 = ImageUtils;

    const handleInputChange = async ({ target }) => {
        const input = target;
        if (!input || !ValidationUtils.inputHasFile(input))
            return;
        const file = input.files?.[0];
        if (!file || !ValidationUtils.filesizeIsTooBig(file))
            return;
        const compressedImage = await ImageUtils$1.compressImage(file);
        if (ValidationUtils.fileIsImage(file, ["image/gif"])) {
            console.log("Filesize too big. Consider re-encoding to webm");
            return;
        }
        if (!compressedImage)
            return;
        FormUtils.setInputFile(input, compressedImage);
        console.log("Compressed image from", file, "to", compressedImage);
    };
    const compressLargeImages = () => {
        const fileinput = document.querySelector("form#quick-reply #upload_file");
        fileinput?.addEventListener("change", handleInputChange);
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

    var css$2 = "#quick-reply #upload .spoiler{padding-right:0}#quick-reply #upload .spoiler>input,#quick-reply #upload .spoiler>label{display:none}#quick-reply:has(#upload_file:not(.has-attachment)) .btn-container[data-if=attachment]{display:none}#quick-reply:has(#upload_file:not(.has-image)) .btn-container[data-if=image]{display:none}#quick-reply .q-toolbar-buttons{--btn-size:14px;align-items:center;display:flex;gap:4px;justify-content:end;padding-right:2px}#quick-reply .q-toolbar-buttons .btn-container{align-items:center;border:1px solid;border-radius:2px;box-sizing:border-box;display:inline-flex;font-family:monospace;font-size:var(--btn-size,14px);height:var(--btn-size,14px);justify-content:center;position:relative;width:var(--btn-size,14px)}#quick-reply .q-toolbar-buttons .btn-container>:before{bottom:0;content:\"\";cursor:pointer;left:0;position:absolute;right:0;top:0}#quick-reply .q-toolbar-buttons .btn-container label{font-size:var(--btn-size,14px)}#quick-reply .q-toolbar-buttons .btn-container a{color:inherit;text-decoration:none}#quick-reply .q-toolbar-buttons input[type=checkbox]{margin:0;padding:0}#quick-reply .q-toolbar-buttons input[type=checkbox]:checked+.btn-container,#quick-reply .q-toolbar-buttons input[type=checkbox]:checked+label,#quick-reply .q-toolbar-buttons input[type=checkbox]:not(:checked){display:none}#quick-reply #q-remove-attachment{padding-bottom:2px}#image-preview-modal{align-items:center;background-color:rgba(0,0,0,.3);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;width:100%;z-index:101}#image-preview-modal img{max-height:100%;max-width:100%}";
    n(css$2,{"singleTag":true});

    const handleChangeFileinput = (e) => {
        const fileinput = e.target;
        if (!fileinput)
            return;
        if (!ValidationUtils.inputHasFile(fileinput)) {
            fileinput.classList.toggle("has-attachment", false);
            fileinput.classList.toggle("has-image", false);
            return;
        }
        fileinput.classList.toggle("has-attachment", true);
        const file = fileinput.files[0];
        if (!ValidationUtils.fileIsImage(file))
            return;
        fileinput.classList.toggle("has-image", true);
    };
    const handlePreviewImage = (fileinput) => {
        if (!ValidationUtils.inputHasFile(fileinput))
            return;
        const file = fileinput.files[0];
        if (!ValidationUtils.fileIsImage(file))
            return;
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => URL.revokeObjectURL(url);
        image.src = url;
        const modal = document.createElement("div");
        modal.id = "image-preview-modal";
        modal.appendChild(image);
        document.body.appendChild(modal);
        modal.addEventListener("click", ({ currentTarget }) => {
            currentTarget?.remove();
        });
    };
    const handleImportImage = (fileinput) => {
        const url = prompt("Enter a valid image URL:");
        if (!url)
            return;
        ImageUtils$1.fetchImage(url).then((file) => {
            if (!file)
                return;
            FormUtils.setInputFile(fileinput, file);
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

    const handleKeyPress = (event) => {
        if (event.key !== "q")
            return;
        const active = document.activeElement;
        if (active) {
            const isTypingField = active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable;
            if (isTypingField)
                return;
        }
        window.dispatchEvent(new CustomEvent('cite'));
    };
    const keyboardShortcut = () => {
        document.addEventListener("keydown", handleKeyPress);
    };

    var css$1 = "#quick-reply #upload{background-color:#fff;border:1px solid}#quick-reply #upload>td{cursor:text}#quick-reply #upload_file{display:none}#quick-reply #upload_filename{border:none;outline:none;padding-bottom:0}";
    n(css$1,{"singleTag":true});

    const handleFilenameClick = (fileinput) => {
        if (ValidationUtils.inputHasFile(fileinput))
            return;
        fileinput.click();
    };
    const handleFilenameBlur = (e, fileinput) => {
        const filename = e.target;
        if (!filename || !ValidationUtils.inputHasFile(fileinput))
            return;
        FormUtils.updateInputFilename(fileinput, filename.value);
    };
    const handleFileinputChange = (event, filename) => {
        const fileinput = event.target;
        if (!fileinput)
            return;
        if (!ValidationUtils.inputHasFile(fileinput)) {
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

    var css = "#quick-reply tr:last-of-type,#quick-reply>hr{display:none}";
    n(css,{"singleTag":true});

    const main = () => {
        DOMUtils.onElementLoaded(() => {
            keyboardShortcut();
            const posts = document.querySelectorAll("body > form[name='postcontrols'] .thread .post" + ":not(.hidden)");
            posts.forEach((post) => DOMUtils.onElementVisible(post, () => {
                addRelativeTime(post);
            }));
        }, "body > form[name='postcontrols'] .thread");
        DOMUtils.onElementLoaded(() => {
            renameableFileinput();
            clearFormOnCancel();
            clipboardImagePaste();
            fileinputToolbar();
            compressLargeImages();
        }, "form#quick-reply");
    };
    try {
        DOMUtils.onContentLoaded(main, "body > form[name='post']");
    }
    catch (err) {
        console.log("[tohno-chan-addons]", err);
    }

})();
//# sourceMappingURL=tohno-chan-addons.js.map
