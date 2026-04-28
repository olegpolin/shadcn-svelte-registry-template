<script lang="ts">
  import type { PageProps } from './$types';
  import { setContext } from 'svelte';
  import Seo from '$lib/components/seo.svelte';
  import { Badge } from '$lib/registry/ui/badge';
  import DocsToc from '$lib/components/docs-toc.svelte';
  import { slugifyHeadingTitle } from '$lib/utils/toc';
  import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';

  let { data }: PageProps = $props();
  let Markdown = $derived(data.markdown);
  let markdownContainer = $state<HTMLElement | null>(null);

  // Provide example components and componentLinks to child components via context.
  // This is used by ComponentPreview (rendered inside mdsvex markdown)
  // to resolve example components without an eager import.meta.glob.
  setContext('exampleComponents', data.exampleComponents);
  setContext('componentLinks', data.componentLinks);

  function syncHeadingIds(root: HTMLElement) {
    const headings = root.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6');
    const slugCounts = new Map<string, number>();

    for (const heading of headings) {
      const baseSlug = slugifyHeadingTitle(heading.textContent?.trim() ?? '');
      if (!baseSlug) {
        continue;
      }

      const count = slugCounts.get(baseSlug) ?? 0;
      slugCounts.set(baseSlug, count + 1);
      heading.id = count === 0 ? baseSlug : `${baseSlug}-${count}`;
    }
  }

  $effect(() => {
    data.slug;

    if (markdownContainer) {
      syncHeadingIds(markdownContainer);
    }
  });
</script>

<Seo
  title={data.meta.title}
  description={data.meta.description || 'Documentation for shadcn-svelte registry template.'}
/>

<div class="min-w-0 flex flex-row-reverse items-stretch text-[1.05rem] sm:text-[15px] xl:w-full pt-4">
  <div class="sticky top-14.25 z-30 ms-auto hidden h-[calc(100svh-1.5rem)] xl:h-[calc(100svh-4rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
    {#if data.toc.length}
			<div class="no-scrollbar overflow-y-auto px-8 pt-4">
				<DocsToc toc={{ items: data.toc }} />
				<div class="h-12"></div>
			</div>
		{/if}
  </div>
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
      <div class="flex flex-col gap-2">
				<div class="flex flex-col gap-2">
					<div class="flex items-start justify-between pb-2">
						<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
              {data.meta.title}
            </h1>
          </div>
          <p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
            {data.meta.description}
          </p>
        </div>
        {#if data.slug.startsWith('components/')}
          <div class="flex items-center space-x-2 pt-4">
            <Badge
              href={`https://www.shadcn-svelte.com/docs/components/${data.slug.replace('components/', '')}`}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View shadcn-svelte docs
              <ArrowUpRightIcon />
            </Badge>
          </div>
        {/if}
      </div>
      <div class={[data.slug !== 'components' && 'prose-docs ', 'w-full flex-1 mt-8']} bind:this={markdownContainer}>
				<Markdown />
			</div>
    </div>
  </div>
</div>
