/** 全局搜索快捷键：⌘K / Ctrl+K 跳转搜索页或聚焦搜索框。 */
const isEditable = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
};

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    const input = document.querySelector<HTMLInputElement>("[data-search-input]");
    if (input) {
      input.focus();
      input.select();
      return;
    }
    window.location.href = `${import.meta.env.BASE_URL}search/?focus=1`;
    return;
  }

  if (event.key === "/" && !isEditable(event.target)) {
    const input = document.querySelector<HTMLInputElement>("[data-search-input]");
    if (input) {
      event.preventDefault();
      input.focus();
    }
  }
});
