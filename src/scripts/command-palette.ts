const SHORTCUT_FLAG = "__dshPaletteShortcut";

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function currentDialog(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>("[data-palette-dialog]");
}

function openPalette(): void {
  const dialog = currentDialog();
  if (!dialog) return;
  if (dialog.open) {
    dialog.close();
    return;
  }
  dialog.showModal();
  const input = dialog.querySelector<HTMLInputElement>("[data-palette-input]");
  const items = [...dialog.querySelectorAll<HTMLElement>("[data-palette-item]")];
  for (const item of items) item.hidden = false;
  input?.focus();
  input?.select();
  selectItem(dialog, 0);
}

function selectItem(dialog: HTMLDialogElement, index: number): void {
  const items = [...dialog.querySelectorAll<HTMLElement>("[data-palette-item]")].filter(
    (item) => !item.hidden,
  );
  items.forEach((item, itemIndex) => {
    item.setAttribute("aria-selected", String(itemIndex === index));
  });
  const active = items[index];
  if (active) active.scrollIntoView({ block: "nearest" });
}

function filteredItems(dialog: HTMLDialogElement): HTMLElement[] {
  return [...dialog.querySelectorAll<HTMLElement>("[data-palette-item]")].filter(
    (item) => !item.hidden,
  );
}

function runItem(item: HTMLElement): void {
  const href = item.dataset.href;
  if (href) {
    window.location.href = href;
    return;
  }

  if (item.dataset.action === "theme") {
    document.querySelector<HTMLButtonElement>("[data-theme-toggle]")?.click();
    return;
  }

  if (item.dataset.action === "copy-email") {
    const email = item.dataset.email ?? "";
    void navigator.clipboard?.writeText(email).then(() => {
      const hint = item.querySelector<HTMLElement>(".hint");
      if (hint) {
        const original = hint.textContent;
        hint.textContent = "已复制";
        window.setTimeout(() => {
          hint.textContent = original;
        }, 1500);
      }
    });
  }
}

export function initCommandPalette(): void {
  const dialog = currentDialog();
  if (!dialog || dialog.dataset.bound === "true") return;
  dialog.dataset.bound = "true";

  const input = dialog.querySelector<HTMLInputElement>("[data-palette-input]");
  const empty = dialog.querySelector<HTMLElement>("[data-palette-empty]");

  const filter = (): void => {
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    for (const item of dialog.querySelectorAll<HTMLElement>("[data-palette-item]")) {
      const label = (item.dataset.label ?? item.textContent ?? "").toLowerCase();
      const matches = query.length === 0 || label.includes(query);
      item.hidden = !matches;
      if (matches) visible += 1;
    }
    if (empty) empty.hidden = visible !== 0;
    selectItem(dialog, 0);
  };

  input?.addEventListener("input", filter);

  input?.addEventListener("keydown", (event) => {
    const items = filteredItems(dialog);
    if (items.length === 0) {
      if (event.key === "Enter") event.preventDefault();
      return;
    }
    const currentIndex = items.findIndex((item) => item.getAttribute("aria-selected") === "true");
    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectItem(dialog, (currentIndex + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      selectItem(dialog, (currentIndex - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = items[currentIndex] ?? items[0];
      if (active) {
        dialog.close();
        runItem(active);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });

  dialog.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target === dialog) {
      dialog.close();
      return;
    }
    const item = target.closest<HTMLElement>("[data-palette-item]");
    if (item) {
      dialog.close();
      runItem(item);
    }
  });

  dialog.addEventListener("close", () => {
    if (input) input.value = "";
    if (empty) empty.hidden = true;
    for (const item of dialog.querySelectorAll<HTMLElement>("[data-palette-item]")) {
      item.hidden = false;
      item.setAttribute("aria-selected", "false");
    }
  });

  if (!(SHORTCUT_FLAG in window)) {
    (window as unknown as Record<string, boolean>)[SHORTCUT_FLAG] = true;
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
        return;
      }
      if (event.key === "/" && !isEditable(event.target)) {
        const search = document.querySelector<HTMLInputElement>("[data-search-input]");
        if (search) {
          event.preventDefault();
          search.focus();
        }
      }
    });
  }
}

document.addEventListener("astro:page-load", initCommandPalette);
