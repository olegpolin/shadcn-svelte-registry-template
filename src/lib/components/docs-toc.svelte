<script lang="ts">
  import { resolve } from '$app/paths';
  import type { TocEntry } from '$lib/utils/toc';

  let {
    entries,
    slug,
    class: className
  }: { entries: TocEntry[]; slug: string; class?: string } = $props();

  const hrefPrefix = $derived(resolve(slug === 'index' ? '/docs' : `/docs/${slug}`));
</script>

{#if entries.length}
  <div class={['flex flex-col gap-2 p-4 pt-0 text-sm', className]}>
    <p class="text-muted-foreground bg-background sticky top-0 h-6 text-xs">On This Page</p>
    {#each entries as item (item.url)}
      <a
        href={`${hrefPrefix}${item.url}`}
        class="text-muted-foreground hover:text-foreground text-[0.8rem] no-underline transition-colors data-[depth=1]:ps-4 data-[depth=2]:ps-6"
        data-depth={item.depth}
      >
        {item.title}
      </a>
    {/each}
  </div>
{/if}
