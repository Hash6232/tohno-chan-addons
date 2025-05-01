namespace UIUtils {
  export namespace Buttons {
    const createContainer = (title?: string) => {
      const container = document.createElement("div");
      container.className = "btn-container";
      if (title) container.title = title;

      return container;
    };

    type ButtonTemplate = {
      label: string;
      title?: string;
      class?: string;
      onClick?: (e: MouseEvent) => void;
    };

    export const createButton = (template: ButtonTemplate) => {
      const container = createContainer(template.title);
      container.classList.add("button");

      const button = document.createElement("a");
      button.textContent = template.label;
      button.href = "javascript:;";

      if (template.class) button.className = template.class;
      if (template.onClick) button.addEventListener("click", template.onClick);

      container.appendChild(button);

      return container;
    };

    type ToggleTemplate = {
      label: string;
      title?: string;
      class?: string;
      name?: string;
      onChange?: (e: Event) => void;
    };

    export const createToggle = (template: ToggleTemplate) => {
      const container = createContainer(template.title);
      container.classList.add("toggle");

      const label = document.createElement("label");
      label.textContent = template.label;
      const toggle = document.createElement("input");
      toggle.type = "checkbox";

      if (template.class) toggle.className = template.class;
      if (template.name) toggle.name = template.name;
      if (template.onChange) toggle.addEventListener("change", template.onChange);

      label.appendChild(toggle);
      container.appendChild(label);

      return container;
    };
  }
}

export default UIUtils;
