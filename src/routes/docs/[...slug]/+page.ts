export const prerender = true;

import type { PageLoad } from './$types';
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

export const load: PageLoad = async ({ params }) => {
  let path = 'index';
  if (params.slug.length > 0) {
    path = params.slug;
  }
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
