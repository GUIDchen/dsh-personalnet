import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL ?? "https://example.com";
const base = process.env.BASE_PATH ?? "/";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/search/") && !page.endsWith("/404/"),
    }),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  devToolbar: {
    enabled: false,
  },
});
