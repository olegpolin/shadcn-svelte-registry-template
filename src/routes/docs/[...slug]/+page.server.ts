import type { EntryGenerator, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { generateToc } from '$lib/utils/toc';

type ModuleWithMetadata = {
  metadata: { title: string; description: string };
};

const modules = import.meta.glob('/src/lib/content/docs/**/*.md', { eager: true }) as Record<string, ModuleWithMetadata>;
const rawModules = import.meta.glob('/src/lib/content/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>;

export const entries: EntryGenerator = () => {
  return Object.keys(modules).map((filePath) => {
    const slug = filePath
      .replace('/src/lib/content/docs/', '')
      .replace(/\.md$/, '');
    return { slug: slug === 'index' ? '' : slug };
  });
};

export const load: PageServerLoad = async ({ params }) => {
  const path = params.slug && params.slug.length > 0 ? params.slug : 'index';
  const filePath = `/src/lib/content/docs/${path}.md`;

  const mod = modules[filePath];
  const raw = rawModules[filePath];

  if (!mod || !raw) {
    error(404, 'Not Found');
  }

  return {
    meta: mod.metadata,
    toc: generateToc(raw),
    slug: params.slug
  };
};
