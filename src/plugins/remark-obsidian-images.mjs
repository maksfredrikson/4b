import { visit } from 'unist-util-visit';

/**
 * Remark plugin: converts Obsidian wiki-embed image syntax ![[file.ext]]
 * into standard markdown image nodes so Astro can process them normally.
 *
 * Assumes images live in an `assets/` subdirectory relative to the .md file.
 */
export function remarkObsidianImages() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      const pattern = /!\[\[([^\]]+)\]\]/g;
      if (!pattern.test(node.value)) return;
      pattern.lastIndex = 0;

      const parts = [];
      let last = 0;
      let match;

      while ((match = pattern.exec(node.value)) !== null) {
        if (match.index > last) {
          parts.push({ type: 'text', value: node.value.slice(last, match.index) });
        }
        const filename = match[1];
        parts.push({
          type: 'image',
          url: `./assets/${filename}`,
          alt: filename,
          title: null,
        });
        last = match.index + match[0].length;
      }

      if (last < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(last) });
      }

      if (parts.length > 0 && !(parts.length === 1 && parts[0].type === 'text')) {
        parent.children.splice(index, 1, ...parts);
      }
    });
  };
}
