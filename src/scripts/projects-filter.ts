type SortMode = "featured" | "latest" | "title";

interface FilterState {
  domain: string;
  tags: Set<string>;
  sort: SortMode;
}

const SORTS: SortMode[] = ["featured", "latest", "title"];

/** 项目库的渐进增强：领域/标签筛选、排序、URL 状态与无结果态。 */
export function initProjectFilters(): void {
  const root = document.querySelector<HTMLElement>("[data-projects-root]");
  if (!root || root.dataset.bound === "true") return;
  root.dataset.bound = "true";

  const grid = root.querySelector<HTMLElement>("[data-project-grid]");
  const bar = root.querySelector<HTMLElement>("[data-filter-bar]");
  if (!grid) return;

  const items = [...grid.querySelectorAll<HTMLElement>("li[data-project-item]")];
  const domainButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-filter-domain]")];
  const tagButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-filter-tag]")];
  const sortSelect = root.querySelector<HTMLSelectElement>("[data-sort]");
  const visibleEl = root.querySelector<HTMLElement>("[data-visible-count]");
  const emptyState = root.querySelector<HTMLElement>("[data-empty-state]");
  const clearButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-clear-filters]")];

  const state: FilterState = { domain: "", tags: new Set(), sort: "featured" };
  const params = new URLSearchParams(window.location.search);

  const domainParam = params.get("domain");
  if (domainParam) state.domain = domainParam;

  const tagParam = params.get("tag");
  if (tagParam) {
    tagParam
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .forEach((tag) => state.tags.add(tag));
  }

  const sortParam = params.get("sort");
  if (sortParam && SORTS.includes(sortParam as SortMode)) state.sort = sortParam as SortMode;

  if (bar) bar.hidden = false;
  if (sortSelect) sortSelect.value = state.sort;

  const value = (item: HTMLElement, key: string): string => item.dataset[key] ?? "";

  const matches = (item: HTMLElement): boolean => {
    if (state.domain && value(item, "domain") !== state.domain) return false;
    const tags = new Set(value(item, "tags").split(" ").filter(Boolean));
    for (const tag of state.tags) {
      if (!tags.has(tag)) return false;
    }
    return true;
  };

  const compare = (a: HTMLElement, b: HTMLElement): number => {
    if (state.sort === "latest") {
      return value(b, "start").localeCompare(value(a, "start"));
    }
    if (state.sort === "title") {
      return value(a, "title").localeCompare(value(b, "title"), "zh-Hans-CN");
    }
    const featuredA = value(a, "featured") === "true" ? 1 : 0;
    const featuredB = value(b, "featured") === "true" ? 1 : 0;
    if (featuredA !== featuredB) return featuredB - featuredA;
    const orderA = Number(value(a, "order") || 999);
    const orderB = Number(value(b, "order") || 999);
    if (orderA !== orderB) return orderA - orderB;
    return value(b, "start").localeCompare(value(a, "start"));
  };

  const syncUrl = (): void => {
    const next = new URLSearchParams();
    if (state.domain) next.set("domain", state.domain);
    if (state.tags.size > 0) next.set("tag", [...state.tags].join(","));
    if (state.sort !== "featured") next.set("sort", state.sort);
    const query = next.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  };

  const render = (): void => {
    let visible = 0;
    for (const item of items) {
      const ok = matches(item);
      item.hidden = !ok;
      if (ok) visible += 1;
    }

    const sorted = [...items].sort(compare);
    for (const item of sorted) grid.append(item);

    if (visibleEl) visibleEl.textContent = String(visible);
    if (emptyState) emptyState.hidden = visible !== 0;

    for (const button of domainButtons) {
      button.setAttribute(
        "aria-pressed",
        String((button.dataset.filterDomain ?? "") === state.domain),
      );
    }
    for (const button of tagButtons) {
      button.setAttribute("aria-pressed", String(state.tags.has(button.dataset.filterTag ?? "")));
    }

    syncUrl();
  };

  for (const button of domainButtons) {
    button.addEventListener("click", () => {
      state.domain = button.dataset.filterDomain ?? "";
      render();
    });
  }

  for (const button of tagButtons) {
    button.addEventListener("click", () => {
      const tag = button.dataset.filterTag ?? "";
      if (!tag) return;
      if (state.tags.has(tag)) state.tags.delete(tag);
      else state.tags.add(tag);
      render();
    });
  }

  for (const button of clearButtons) {
    button.addEventListener("click", () => {
      state.domain = "";
      state.tags.clear();
      state.sort = "featured";
      if (sortSelect) sortSelect.value = state.sort;
      render();
    });
  }

  sortSelect?.addEventListener("change", () => {
    const next = sortSelect.value;
    state.sort = SORTS.includes(next as SortMode) ? (next as SortMode) : "featured";
    render();
  });

  render();
}
