import type { PageLoad } from './$types';
import type { Component } from 'svelte';
import { error } from '@sveltejs/kit';

const modules = import.meta.glob('/src/lib/content/docs/**/*.md');

export const load: PageLoad = async ({ params, data }) => {
  const path = params.slug && params.slug.length > 0 ? params.slug : 'index';
  const filePath = `/src/lib/content/docs/${path}.md`;

  if (!modules[filePath]) {
    error(404, 'Not Found');
  }

  const module = await modules[filePath]() as { default: Component };
  return {
    ...data,
    markdown: module.default
  };
};
