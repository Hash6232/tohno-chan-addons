import { QuickreplySelectorsEnum } from "@enums/selectorsEnum";
import "../../styles/quick-reply/compactFormattingButtons.scss";

const newLabel = (btn: HTMLInputElement) => {
  const { id, name: label, value: title } = btn;
  return `<label title="${title}" for="${id}">${label}</label>`;
};

const handleLabelClick = (e: MouseEvent) => {
  if (e.target !== e.currentTarget) return;

  const textarea = document.querySelector(QuickreplySelectorsEnum.TEXTAREA) as HTMLTextAreaElement | null;

  if (!textarea) return;

  textarea.focus();
};

export const compactFormattingButtons = () => {
  const formattingRow = document.querySelector(QuickreplySelectorsEnum.FORMATTING_ROW) as HTMLTableRowElement | null;

  if (!formattingRow) return;

  formattingRow.id = "qr-post-formatting";

  const buttons = formattingRow.querySelectorAll("input.btn") as NodeListOf<HTMLInputElement>;

  if (buttons.length < 1) return;

  const column = buttons[0].parentElement as HTMLTableColElement;
  column.insertAdjacentHTML("beforeend", "<div class='formatting-labels'></div>");
  const labelsContainer = column.lastElementChild as HTMLDivElement;

  for (const btn of buttons) {
    btn.id = "quick-reply-" + btn.name + "-btn";
    labelsContainer.insertAdjacentHTML("beforeend", newLabel(btn));

    const label = labelsContainer.lastElementChild as HTMLLabelElement | null;

    if (!label) return;

    label.addEventListener("click", handleLabelClick);
  }
};
