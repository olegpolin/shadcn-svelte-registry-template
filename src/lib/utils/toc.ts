export interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

export function generateToc(markdown: string): TocEntry[] {
  // 1. Strip YAML Frontmatter (to avoid parsing headings inside it)
  let text = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');

  // 2. Strip Code Blocks (to avoid false positive headings inside code)
  text = text.replace(/```[\s\S]*?```/g, '');

  // Regex to match ATX headings like "## Heading" (ignoring trailing hashes like "## Heading ##")
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+#+)?$/gm;
  const headings: { depth: number; title: string; url: string }[] = [];
  const slugCounts = new Map<string, number>();

  // 3. Extract and sanitize headings
  let match;
  while ((match = headingRegex.exec(text)) !== null) {
    const depth = match[1].length;
    const rawTitle = match[2];

    // Clean inline markdown formatting for the title
    const title = rawTitle
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')     // Remove links -> [Text](url)
      .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1')   // Remove bold/italic -> **Text**
      .replace(/`([^`]+)`/g, '$1')                 // Remove inline code -> `code`
      .replace(/<[^>]+>/g, '')                     // Remove raw HTML tags
      .trim();

    // Generate GitHub-style i18n-friendly slug
    // \p{L} = letters from any language, \p{N} = numbers from any language
    let slug = title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') 
      .trim()
      .replace(/\s+/g, '-');

    // Handle duplicate slugs (e.g., turning the second instance into #my-heading-1)
    if (slugCounts.has(slug)) {
      const count = slugCounts.get(slug)! + 1;
      slugCounts.set(slug, count);
      slug = `${slug}-${count}`;
    } else {
      slugCounts.set(slug, 0);
    }

    headings.push({ depth, title, url: `#${slug}` });
  }

  // 4. Build the hierarchical Tree (Velite's default format)
  const toc: TocEntry[] = [];
  const stack: { depth: number; entry: TocEntry }[] = [];

  for (const heading of headings) {
    const entry: TocEntry = {
      title: heading.title,
      url: heading.url,
      items: []
    };

    // Pop the stack until we find the parent (a heading with a lesser depth/higher hierarchy)
    while (stack.length > 0 && stack[stack.length - 1].depth >= heading.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Top-level heading
      toc.push(entry);
    } else {
      // Attach as a nested item to the closest parent
      stack[stack.length - 1].entry.items.push(entry);
    }

    // Push current entry to the stack for subsequent nested children
    stack.push({ depth: heading.depth, entry });
  }

  return toc;
}
