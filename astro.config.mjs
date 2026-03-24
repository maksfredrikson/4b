// @ts-check
import { defineConfig } from 'astro/config';
import { remarkObsidianImages } from './src/plugins/remark-obsidian-images.mjs';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkObsidianImages],
  },
});
