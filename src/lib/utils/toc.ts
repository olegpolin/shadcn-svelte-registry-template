export interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

type StackEntry = {
  depth: number;
  entry: TocEntry;
};

const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+#+)?$/;
const fenceRegex = /^\s*(```|~~~)/;

export function sanitizeHeadingTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+\{#[^}]+\}\s*$/, '')
    .trim();
}

export function slugifyHeadingTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getUniqueHeadingSlug(baseSlug: string, slugCounts: Map<string, number>): string {
  const count = slugCounts.get(baseSlug) ?? 0;
  slugCounts.set(baseSlug, count + 1);

  return count === 0 ? baseSlug : `${baseSlug}-${count}`;
}

export function generateToc(markdown: string): TocEntry[] {
  const toc: TocEntry[] = [];
  const stack: StackEntry[] = [];
  const slugCounts = new Map<string, number>();
  let index = 0;
  let lineNumber = 0;
  let inFrontmatter = false;
  let inCodeFence = false;

  while (index <= markdown.length) {
    const nextLineBreak = markdown.indexOf('\n', index);
    const line =
      nextLineBreak === -1
        ? markdown.slice(index).replace(/\r$/, '')
        : markdown.slice(index, nextLineBreak).replace(/\r$/, '');

    index = nextLineBreak === -1 ? markdown.length + 1 : nextLineBreak + 1;

    if (lineNumber === 0 && line.trim() === '---') {
      inFrontmatter = true;
      lineNumber += 1;
      continue;
    }

    if (inFrontmatter) {
      if (line.trim() === '---') {
        inFrontmatter = false;
      }
      lineNumber += 1;
      continue;
    }

    if (fenceRegex.test(line)) {
      inCodeFence = !inCodeFence;
      lineNumber += 1;
      continue;
    }

    if (!inCodeFence) {
      const match = headingRegex.exec(line);

      if (match) {
        const title = sanitizeHeadingTitle(match[2]);
        const baseSlug = slugifyHeadingTitle(title);

        if (baseSlug) {
          const entry: TocEntry = {
            title,
            url: `#${getUniqueHeadingSlug(baseSlug, slugCounts)}`,
            items: []
          };
          const depth = match[1].length;

          while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
            stack.pop();
          }

          if (stack.length === 0) {
            toc.push(entry);
          } else {
            stack[stack.length - 1].entry.items.push(entry);
          }

          stack.push({ depth, entry });
        }
      }
    }

    lineNumber += 1;
  }

  return toc;
}
