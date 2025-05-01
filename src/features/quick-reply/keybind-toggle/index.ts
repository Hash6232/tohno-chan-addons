const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key !== "q") return;

  const active = document.activeElement as HTMLElement | null;

  if (active) {
    const isTypingField =
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable;
    
    if (isTypingField) return;
  }

  window.dispatchEvent(new CustomEvent('cite'));
};

const keybindToggleFeature = () => {
  document.addEventListener("keydown", handleKeyPress);
};

export default keybindToggleFeature;
