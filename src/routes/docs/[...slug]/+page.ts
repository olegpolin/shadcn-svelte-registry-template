export const prerender = true;

import type { EntryGenerator, PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { generateToc } from '$lib/utils/toc';

type PageMetadata = {
  title: string;
  description: string;
}

const modules = import.meta.glob('../../../lib/content/docs/**/*.md');
const rawModules = import.meta.glob('../../../lib/content/docs/**/*.md', {
  query: '?raw',
  import: 'default'
});

export const entries: EntryGenerator = () => {
  return Object.keys(modules).map((filePath) => {
    const slug = filePath
      .replace('../../../lib/content/docs/', '')
      .replace(/\.md$/, '');

    return { slug: slug === 'index' ? '' : slug };
  });
};

export const load: PageLoad = async ({ params }) => {
  const path = params.slug && params.slug.length > 0 ? params.slug : 'index';
  const filePath = `../../../lib/content/docs/${path}.md`;
  try {
    if (!modules[filePath] || !rawModules[filePath]) {
      error(404, 'Not Found');
    }
    const module = await modules[filePath]() as any;
    const rawString = await rawModules[filePath]() as string;
    const toc = generateToc(rawString);
    return {
      markdown: module.default,
      meta: module.metadata as PageMetadata,
      toc,
      slug: params.slug
    }
  } catch (e) {
    error(404, 'Not Found');
  }
};
