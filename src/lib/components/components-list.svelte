<script lang="ts">
  import { getContext } from 'svelte';
  import type { ComponentLink } from '$lib/utils/navigation';

  const componentLinks = getContext<ComponentLink[]>('componentLinks') ?? [];
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
  {#each componentLinks as link (link.title)}
    <a href={link.href} class="text-lg font-medium underline-offset-4 hover:underline md:text-base">
      {link.title}
    </a>
  {/each}
</div>
