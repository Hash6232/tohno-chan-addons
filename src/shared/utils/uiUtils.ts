type NewButtonOptions = { label: string; title: string };

export const createNewButtonTemplate = ({ label, title }: NewButtonOptions) => {
  return `<div title="${title}" class="btn-container btn"><a href="javascript:;">${label}</a></div>`;
};

type NewToggleOption = { label: string; title: string; id: string };

export const createNewToggleTemplate = ({ label, title, id }: NewToggleOption) => {
  return (
    `<div title="${title}" class="btn-container toggle">` +
    `<input id="${id}" type="checkbox" />` +
    `<label for="${id}">${label}</label>` +
    `</div>`
  );
};
