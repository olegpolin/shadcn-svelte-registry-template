<script lang="ts">
  import type { PageProps } from './$types';
  import type { Attachment } from 'svelte/attachments';
  import Seo from '$lib/components/seo.svelte';
  import { Badge } from '$lib/registry/ui/badge';
  import DocsToc from '$lib/components/docs-toc.svelte';
  import { getUniqueHeadingSlug, slugifyHeadingTitle } from '$lib/utils/toc';
  import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';

  let { data }: PageProps = $props();
  let Markdown = $derived(data.markdown);

  function syncHeadingIds(node: HTMLElement) {
    const slugCounts = new Map<string, number>();
    const headings = node.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6');

    for (const heading of headings) {
      const baseSlug = slugifyHeadingTitle(heading.textContent?.trim() ?? '');
      if (!baseSlug) {
        continue;
      }

      heading.id = getUniqueHeadingSlug(baseSlug, slugCounts);
    }
  }

  function headingIds(_slug: string): Attachment<HTMLElement> {
    return (node) => {
      syncHeadingIds(node);
    };
  }
</script>

<Seo
  title={data.meta.title}
  description={data.meta.description || 'Documentation for shadcn-svelte registry template.'}
/>

<div class="min-w-0 flex flex-row-reverse items-stretch text-[1.05rem] sm:text-[15px] xl:w-full pt-4">
  <div class="sticky top-14.25 z-30 ms-auto hidden h-[calc(100svh-1.5rem)] xl:h-[calc(100svh-4rem)] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
    {#if data.toc.length}
      <div class="no-scrollbar overflow-y-auto px-8 pt-4">
        <DocsToc toc={{ items: data.toc }} slug={data.slug} />
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
      <div
        class={[data.slug !== 'components' && 'prose-docs', 'w-full flex-1 mt-8']}
        {@attach headingIds(data.slug)}
      >
        <Markdown />
      </div>
    </div>
  </div>
</div>
