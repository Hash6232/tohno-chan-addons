import { SelectorsEnum } from "@shared/enums";
import "./index.scss";

const newLabel = (button: HTMLInputElement) => {
  const { id, name: label, value: title } = button;
  return `<label title="${title}" for="${id}">${label}</label>`;
};

const customFormattingButtons = () => {
  const formattingRow = document.querySelector(SelectorsEnum.QR_FORMATTING_ROW) as HTMLTableRowElement | null;

  if (!formattingRow) return;

  const column = formattingRow.firstElementChild as HTMLTableColElement | null;

  if (!column) return;

  column.insertAdjacentHTML("beforeend", "<div class='formatting-labels'></div>");
  const labelsContainer = column.lastElementChild as HTMLDivElement;

  const buttons = formattingRow.querySelectorAll("input.btn") as NodeListOf<HTMLInputElement>;

  for (const button of buttons) {
    button.id = "q-" + button.name + "-btn";
    labelsContainer.insertAdjacentHTML("beforeend", newLabel(button));
  }
};

export default customFormattingButtons;
