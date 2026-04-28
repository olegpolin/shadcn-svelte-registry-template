<script lang="ts" module>
  export type TocItem = {
    title: string;
    url: string;
    items?: TocItem[];
  };

  export type TableOfContents = {
    items?: TocItem[];
  };

  type FlattenedTocItem = {
    title: string;
    url: string;
    depth: number;
  };

  type DocsTocHref = `/docs#${string}` | `/docs/${string}#${string}`;

  function flattenToc(items: TocItem[], depth = 0, result: FlattenedTocItem[] = []): FlattenedTocItem[] {
    for (const item of items) {
      result.push({
        title: item.title,
        url: item.url,
        depth
      });

      if (item.items && item.items.length > 0) {
        flattenToc(item.items, depth + 1, result);
      }
    }

    return result;
  }
</script>

<script lang="ts">
  import { resolve } from '$app/paths';

  let {
    toc,
    slug,
    class: className
  }: { toc: TableOfContents; slug: string; class?: string } = $props();

  const flattenedToc = $derived(flattenToc(toc.items ?? []));

  function getDocsTocHref(slug: string, hash: string): DocsTocHref {
    return (slug === 'index' ? `/docs${hash}` : `/docs/${slug}${hash}`) as DocsTocHref;
  }
</script>

{#if flattenedToc.length}
  <div class={['flex flex-col gap-2 p-4 pt-0 text-sm', className]}>
    <p class="text-muted-foreground bg-background sticky top-0 h-6 text-xs">On This Page</p>
    {#each flattenedToc as item (item.url)}
      <a
        href={resolve(getDocsTocHref(slug, item.url))}
        class="text-muted-foreground hover:text-foreground text-[0.8rem] no-underline transition-colors data-[depth=1]:ps-4 data-[depth=2]:ps-6"
        data-depth={item.depth}
      >
        {item.title}
      </a>
    {/each}
  </div>
{/if}
