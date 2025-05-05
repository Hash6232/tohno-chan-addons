import { Selectors as S } from "@shared/enums";
import FileUtils from "@shared/utils/fileUtils";
import { FormUtils, StringUtils, ValidationUtils } from "@shared/utils/globalUtils";

const toolbar = new (class Toolbar {
  readonly class = "file-toolbar";

  readonly buttons = {
    preview: { class: "preview-image", label: "P", title: "Preview image" },
    spoiler: { class: "spoiler-image", label: "S", title: "Spoiler image", name: "spoiler" },
    import: { class: "import-image", label: "U", title: "Import image from URL" },
    remove: { class: "remove-file", label: "×", title: "Remove file" },
  } as const;

  get html() {
    return this.template;
  }

  private get template() {
    return StringUtils.templateHandler`
    <div class="${this.class}">
      <div class="btn-container button" title="${this.buttons.preview.title}">
        <a href="javascript:;" class="${this.buttons.preview.class}">${this.buttons.preview.label}</a>
      </div>
      <div class="btn-container toggle" title="${this.buttons.spoiler.title}">
        <label>${this.buttons.spoiler.label}<input type="checkbox" 
          class="${this.buttons.spoiler.class}" 
          name="${this.buttons.spoiler.name}"
        /></label>
      </div>
      <div class="btn-container button" title="${this.buttons.import.title}">
        <a href="javascript:;" class="${this.buttons.import.class}">${this.buttons.import.label}</a>
      </div>
      <div class="btn-container button" title="${this.buttons.remove.title}">
        <a href="javascript:;" class="${this.buttons.remove.class}">${this.buttons.remove.label}</a>
      </div>
    </div>
    `;
  }
})();

const handleChangeFileInput = ({ currentTarget }: Event, form: HTMLFormElement) => {
  const input = currentTarget as HTMLInputElement | null;

  if (!input) return;

  // Reset toolbar display when no file is attached
  if (!ValidationUtils.inputHasFile(input)) {
    form.classList.toggle("has-attachment", false);
    form.classList.toggle("has-image", false);
    return;
  }

  form.classList.toggle("has-attachment", true);

  const file = input.files![0];

  if (!file) return;

  if (!ValidationUtils.fileIsImage(file)) return;

  form.classList.toggle("has-image", true);
};

const handlePreviewImage = (input: HTMLInputElement) => {
  if (!ValidationUtils.inputHasFile(input)) return;

  const file = input.files![0];

  if (!file) return;

  if (!ValidationUtils.fileIsImage(file)) return;

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => URL.revokeObjectURL(url);
  image.src = url;

  const modal = document.createElement("div");
  modal.id = "image-preview-modal";
  modal.appendChild(image);
  document.body.appendChild(modal);

  modal.addEventListener("click", ({ currentTarget }) => {
    (currentTarget as HTMLDivElement | null)?.remove();
  });
};

const handleImportImage = (input: HTMLInputElement) => {
  const url = prompt("Enter a valid image URL:");

  if (!url) return;

  FileUtils.fetchFile(url).then((file) => {
    if (!file) return;

    if (!ValidationUtils.fileIsImage(file)) return;

    FormUtils.setInputFile(input, file);
  });
};

const handleResetFileInput = (input: HTMLInputElement) => {
  input.value = "";

  input.dispatchEvent(new Event("change", { bubbles: true }));
};

const fileToolbarFeature = (form: HTMLFormElement) => {
  // Cleanup
  form.querySelector<HTMLDivElement>(`.${toolbar.class}`)?.remove();
  form.querySelector<HTMLTableColElement>(`td:has(.${toolbar.buttons.spoiler.class})`)?.remove();

  const spoiler = form.querySelector<HTMLInputElement>(S.Form.SPOILER);
  const fileInput = form.querySelector<HTMLInputElement>(S.Form.INPUT_FILE);

  if (!spoiler || !fileInput) return;

  spoiler.parentElement?.insertAdjacentHTML("beforeend", toolbar.html);

  /* Toolbar events */
  const previewBtn = form.querySelector<HTMLAnchorElement>(`.${toolbar.buttons.preview.class}`);
  previewBtn?.addEventListener("click", () => handlePreviewImage(fileInput));
  const importURLBtn = form.querySelector<HTMLAnchorElement>(`.${toolbar.buttons.import.class}`);
  importURLBtn?.addEventListener("click", () => handleImportImage(fileInput));
  const clearFileBtn = form.querySelector<HTMLAnchorElement>(`.${toolbar.buttons.remove.class}`);
  clearFileBtn?.addEventListener("click", () => handleResetFileInput(fileInput));

  /* File state watcher */
  fileInput.addEventListener("change", (e) => handleChangeFileInput(e, form));
};

export default fileToolbarFeature;
