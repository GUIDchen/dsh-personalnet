interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results?: { title: string; url: string; excerpt: string }[];
}

interface PagefindModule {
  options: (options: Record<string, unknown>) => Promise<void>;
  search: (query: string, options?: Record<string, unknown>) => Promise<{ results: unknown[] }>;
}

type Result = { data: () => Promise<PagefindResultData> };

let pagefind: PagefindModule | null = null;
let loading: Promise<PagefindModule> | null = null;

async function loadPagefind(): Promise<PagefindModule> {
  if (pagefind) return pagefind;
  if (!loading) {
    loading = import(/* @vite-ignore */ `${import.meta.env.BASE_URL}pagefind/pagefind.js`).then(
      async (module: PagefindModule) => {
        pagefind = module;
        return module;
      },
    );
  }
  return loading;
}

/** 只把 <mark> 渲染为高亮，其余内容一律作为文本节点插入。 */
function renderExcerpt(target: HTMLElement, excerpt: string): void {
  target.replaceChildren();
  const parts = excerpt.split(/(<mark>.*?<\/mark>)/g);
  for (const part of parts) {
    const match = /^<mark>(.*?)<\/mark>$/s.exec(part);
    if (match) {
      const mark = document.createElement("mark");
      mark.textContent = match[1] ?? "";
      target.append(mark);
    } else if (part) {
      target.append(document.createTextNode(part));
    }
  }
}

function debounce<T extends (...args: never[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return ((...args: never[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function initSearch(): void {
  const root = document.querySelector<HTMLElement>("[data-search-root]");
  if (!root || root.dataset.bound === "true") return;
  root.dataset.bound = "true";

  const input = root.querySelector<HTMLInputElement>("[data-search-input]");
  const status = root.querySelector<HTMLElement>("[data-search-status]");
  const list = root.querySelector<HTMLOListElement>("[data-search-results]");
  const empty = root.querySelector<HTMLElement>("[data-search-empty]");
  const form = root.querySelector<HTMLFormElement>("[data-search-form]");
  if (!input || !status || !list) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("focus") === "1" || params.get("q")) {
    input.focus();
    if (params.get("q")) input.value = params.get("q") ?? "";
  }

  const setStatus = (text: string) => {
    status.textContent = text;
  };

  const render = async (query: string): Promise<void> => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      list.replaceChildren();
      if (empty) empty.hidden = true;
      setStatus(trimmed ? "再输入一个字符开始搜索" : "输入关键词开始搜索");
      return;
    }

    setStatus("搜索中…");
    try {
      const engine = await loadPagefind();
      await engine.options({ excerptLength: 28 });
      const search = await engine.search(trimmed);
      const results = await Promise.all(
        (search.results as Result[]).slice(0, 20).map((result) => result.data()),
      );

      list.replaceChildren();
      for (const result of results) {
        const item = document.createElement("li");
        item.className = "search-result";

        const link = document.createElement("a");
        link.href = result.url;
        link.className = "result-link";
        link.textContent = result.meta.title ?? result.url;
        item.append(link);

        const excerpt = document.createElement("p");
        excerpt.className = "result-excerpt";
        renderExcerpt(excerpt, result.excerpt);
        item.append(excerpt);

        list.append(item);
      }

      if (empty) empty.hidden = results.length !== 0;
      setStatus(
        results.length === 0
          ? `没有找到与「${trimmed}」相关的内容`
          : `找到 ${results.length} 个与「${trimmed}」相关的结果`,
      );
    } catch {
      list.replaceChildren();
      if (empty) empty.hidden = false;
      setStatus("搜索索引尚未生成，请先运行构建，或浏览项目库。");
    }
  };

  const update = debounce(() => {
    void render(input.value);
  }, 160);

  input.addEventListener("input", update);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    void render(input.value);
  });

  list.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = [...list.querySelectorAll<HTMLAnchorElement>("a")];
    if (links.length === 0) return;
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown" ? index + 1 : index - 1;
    const target = links[(next + links.length) % links.length];
    event.preventDefault();
    target?.focus();
  });

  if (input.value) void render(input.value);
}

document.addEventListener("astro:page-load", initSearch);
