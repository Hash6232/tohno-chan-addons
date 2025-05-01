(function () {
    'use strict';

    var Selectors;
    (function (Selectors) {
        (function (Form) {
            Form["POST"] = "form[name='post']";
            Form["POST_QR"] = "form[name='post']#quick-reply";
            Form["TEXTAREA"] = "textarea[name='body']";
            Form["INPUT_FILE"] = "input[name='file']";
            Form["SPOILER"] = "input[name='spoiler']";
            Form["CLOSE_QR"] = "a.close-btn";
        })(Selectors.Form || (Selectors.Form = {}));
        (function (Index) {
            Index["INDEX"] = "form[name='postcontrols']";
            Index["THREAD"] = ".thread";
            Index["POST"] = ".post";
        })(Selectors.Index || (Selectors.Index = {}));
    })(Selectors || (Selectors = {}));

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

    const handlePasteEvent = ({ clipboardData }, input) => {
        if (!clipboardData || clipboardData.files.length !== 1)
            return;
        const file = clipboardData.files[0];
        FormUtils.setInputFile(input, file);
    };
    const filePasteFeature = (form) => {
        const textarea = form.querySelector(Selectors.Form.TEXTAREA);
        const fileInput = form.querySelector(Selectors.Form.INPUT_FILE);
        if (!textarea || !fileInput)
            return;
        textarea.addEventListener("paste", (e) => handlePasteEvent(e, fileInput));
    };

    var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=true===r.prepend?"prepend":"append",d=true===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

    var css$2 = "form[name=post] input[name=file]{display:none}form[name=post] .upload-filename{box-sizing:border-box;float:left;margin-right:4px;padding-bottom:0;width:calc(79% - 4px)}form[name=post]#quick-reply .upload-filename{width:99%}";
    n(css$2,{"singleTag":true});

    const handleFileInputChange = ({ currentTarget }, fileName) => {
        const fileInput = currentTarget;
        if (!fileInput)
            return;
        const file = fileInput.files?.[0];
        fileName.value = file ? file.name : "";
    };
    const handleFileInputCancel = (fileName) => {
        fileName.blur();
    };
    const handleFileNameClick = (fileInput) => {
        if (ValidationUtils.inputHasFile(fileInput))
            return;
        fileInput.click();
    };
    const handleFileNameBlur = ({ currentTarget }, fileInput) => {
        const fileName = currentTarget;
        if (!fileName || !ValidationUtils.inputHasFile(fileInput))
            return;
        const file = fileInput.files[0];
        const options = { type: file.type, lastModified: file.lastModified };
        const updatedFile = new File([file], fileName.value, options);
        FormUtils.setInputFile(fileInput, updatedFile);
    };
    const fileRenameFeature = (form) => {
        const fileInput = form.querySelector(Selectors.Form.INPUT_FILE);
        if (!fileInput)
            return;
        form.querySelector(".upload-filename")?.remove();
        const fileName = document.createElement("input");
        fileName.placeholder = "Click to upload a file..";
        fileName.className = "upload-filename";
        fileName.type = "text";
        fileInput.insertAdjacentElement("afterend", fileName);
        fileInput.addEventListener("change", (e) => handleFileInputChange(e, fileName));
        fileInput.addEventListener("cancel", () => handleFileInputCancel(fileName));
        fileName.addEventListener("click", () => handleFileNameClick(fileInput));
        fileName.addEventListener("blur", (e) => handleFileNameBlur(e, fileInput));
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

    var UIUtils;
    (function (UIUtils) {
        (function (Buttons) {
            const createContainer = (title) => {
                const container = document.createElement("div");
                container.className = "btn-container";
                if (title)
                    container.title = title;
                return container;
            };
            Buttons.createButton = (template) => {
                const container = createContainer(template.title);
                container.classList.add("button");
                const button = document.createElement("a");
                button.textContent = template.label;
                button.href = "javascript:;";
                if (template.class)
                    button.className = template.class;
                if (template.onClick)
                    button.addEventListener("click", template.onClick);
                container.appendChild(button);
                return container;
            };
            Buttons.createToggle = (template) => {
                const container = createContainer(template.title);
                container.classList.add("toggle");
                const label = document.createElement("label");
                label.textContent = template.label;
                const toggle = document.createElement("input");
                toggle.type = "checkbox";
                if (template.class)
                    toggle.className = template.class;
                if (template.name)
                    toggle.name = template.name;
                if (template.onChange)
                    toggle.addEventListener("change", template.onChange);
                label.appendChild(toggle);
                container.appendChild(label);
                return container;
            };
        })(UIUtils.Buttons || (UIUtils.Buttons = {}));
    })(UIUtils || (UIUtils = {}));
    var UIUtils$1 = UIUtils;

    const buttons = {
        preview: {
            label: "P",
            title: "Preview image",
            class: "preview-image",
        },
        spoiler: {
            label: "S",
            title: "Spoiler image",
            class: "spoiler-image",
            name: "spoiler",
        },
        import: {
            label: "U",
            title: "Import image from URL",
            class: "import-image",
        },
        clear: {
            label: "×",
            title: "Remove file",
            class: "remove-file",
        },
    };

    var css$1 = "form[name=post] td>input[name=spoiler],form[name=post] td>input[name=spoiler]~label{display:none}form[name=post]:not(.has-attachment) .btn-container:has(.remove-file){display:none}form[name=post]:not(.has-image) .btn-container:has(.preview-image),form[name=post]:not(.has-image) .btn-container:has(.spoiler-image){display:none}form[name=post]:not(#quick-reply) .file-toolbar{padding-top:2px}form[name=post] .file-toolbar{align-items:center;display:flex;gap:4px;justify-content:end}form[name=post] .remove-file{padding-bottom:2px}#quick-reply tr td:nth-child(2).spoiler{padding-right:2px}#image-preview-modal{align-items:center;background-color:rgba(0,0,0,.3);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;width:100%;z-index:101}#image-preview-modal img{max-height:100%;max-width:100%}";
    n(css$1,{"singleTag":true});

    const UI = UIUtils$1.Buttons;
    const handleChangeFileInput = ({ currentTarget }, form) => {
        const input = currentTarget;
        if (!input)
            return;
        if (!ValidationUtils.inputHasFile(input)) {
            form.classList.toggle("has-attachment", false);
            form.classList.toggle("has-image", false);
            return;
        }
        form.classList.toggle("has-attachment", true);
        const file = input.files[0];
        if (!ValidationUtils.fileIsImage(file))
            return;
        form.classList.toggle("has-image", true);
    };
    const handlePreviewImage = (input) => {
        if (!ValidationUtils.inputHasFile(input))
            return;
        const file = input.files[0];
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
    const handleImportImage = (input) => {
        const url = prompt("Enter a valid image URL:");
        if (!url)
            return;
        ImageUtils$1.fetchImage(url).then((file) => {
            if (!file)
                return;
            FormUtils.setInputFile(input, file);
        });
    };
    const handleResetFileInput = (input) => {
        input.value = "";
        input.dispatchEvent(new Event("change", { bubbles: true }));
    };
    const fileToolbarFeature = (form) => {
        form.querySelector(".file-toolbar")?.remove();
        form.querySelector(`td:has(.${buttons.spoiler.class})`)?.remove();
        const spoiler = form.querySelector(Selectors.Form.SPOILER);
        const fileInput = form.querySelector(Selectors.Form.INPUT_FILE);
        if (!spoiler || !fileInput)
            return;
        const container = document.createElement("div");
        container.className = "file-toolbar";
        spoiler.parentElement?.appendChild(container);
        for (const button of [
            UI.createButton({
                ...buttons.preview,
                onClick: () => handlePreviewImage(fileInput),
            }),
            UI.createToggle({
                ...buttons.spoiler,
            }),
            UI.createButton({
                ...buttons.import,
                onClick: () => handleImportImage(fileInput),
            }),
            UI.createButton({
                ...buttons.clear,
                onClick: () => handleResetFileInput(fileInput),
            }),
        ]) {
            container.appendChild(button);
        }
        fileInput.addEventListener("change", (e) => handleChangeFileInput(e, form));
    };

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
    const imageCompressFeature = (form) => {
        const fileInput = form.querySelector(Selectors.Form.INPUT_FILE);
        if (!fileInput)
            return;
        fileInput.addEventListener("change", handleInputChange);
    };

    const handleCursorHover = (e) => {
        const time = e.currentTarget;
        if (!time)
            return;
        time.title = DateUtils.toRelative(new Date(time.dateTime));
    };
    const relativeTimeFeature = (post) => {
        const time = post.querySelectorAll("time");
        if (time.length < 1)
            return;
        time.forEach(el => el.addEventListener("mouseenter", handleCursorHover));
    };

    const handleButtonClick = (textarea) => {
        textarea.value = "";
    };
    const clearFormOnCloseFeature = (form) => {
        const cancelButton = form.querySelector(Selectors.Form.CLOSE_QR);
        const mainPostForm = document.querySelector(Selectors.Form.POST);
        if (!mainPostForm)
            return;
        const textarea = mainPostForm.querySelector(Selectors.Form.TEXTAREA);
        if (!cancelButton || !textarea)
            return;
        cancelButton.addEventListener("click", () => handleButtonClick(textarea));
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
    const keybindToggleFeature = () => {
        document.addEventListener("keydown", handleKeyPress);
    };

    var css = ".btn-container{--btn-size:14px;align-items:center;border:1px solid;border-radius:2px;box-sizing:border-box;display:inline-flex;flex-shrink:0;font-family:monospace;font-size:var(--btn-size,14px);height:var(--btn-size,14px);justify-content:center;line-height:var(--btn-size,14px);position:relative;width:var(--btn-size,14px)}.btn-container>:before{bottom:0;content:\"\";cursor:pointer;left:0;position:absolute;right:0;top:0}.btn-container.toggle input[type=checkbox]{margin:0;padding:0}.btn-container.toggle input[type=checkbox]:not(:checked){display:none}.btn-container.toggle:has(input:checked){border:0;font-size:0}.btn-container.toggle:has(input:checked) label{font-size:inherit}.btn-container label{align-items:center;display:flex;font-size:var(--btn-size,14px);justify-content:center}.btn-container a{color:inherit;text-decoration:none}#quick-reply tr:last-of-type,#quick-reply>hr{display:none}";
    n(css,{"singleTag":true});

    const handleThreadFeatures = () => {
        const form = document.querySelector(Selectors.Index.INDEX);
        if (!form)
            return;
        const posts = form.querySelectorAll(Selectors.Index.POST + ":not(.hidden)");
        posts.forEach((post) => DOMUtils.onElementVisible(post, () => {
            relativeTimeFeature(post);
        }));
    };
    const handleMainFormFeatures = () => {
        const form = document.querySelector(Selectors.Form.POST);
        if (!form)
            return;
        filePasteFeature(form);
        fileRenameFeature(form);
        fileToolbarFeature(form);
        imageCompressFeature(form);
    };
    const handleQuickreplyFeatures = () => {
        const form = document.querySelector(Selectors.Form.POST_QR);
        if (!form)
            return;
        filePasteFeature(form);
        fileRenameFeature(form);
        fileToolbarFeature(form);
        imageCompressFeature(form);
        clearFormOnCloseFeature(form);
    };
    const main = () => {
        DOMUtils.onElementLoaded(handleThreadFeatures, Selectors.Index.INDEX, true);
        DOMUtils.onElementLoaded(handleMainFormFeatures, Selectors.Form.POST, true);
        keybindToggleFeature();
        DOMUtils.onElementLoaded(handleQuickreplyFeatures, Selectors.Form.POST_QR);
    };
    try {
        DOMUtils.onContentLoaded(main, Selectors.Index.INDEX);
    }
    catch (err) {
        console.log("[tohno-chan-addons]", err);
    }

})();
//# sourceMappingURL=tohno-chan-addons.js.map
