<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';
  import { ModeWatcher } from 'mode-watcher';
  import * as Tooltip from '$lib/registry/ui/tooltip';
  import Header from '$lib/components/header.svelte';
  import Footer from '$lib/components/footer.svelte';
  import type { LayoutProps } from './$types';

  let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta property="og:image" content={`${page.url.origin}/logo.png`} />
</svelte:head>

<ModeWatcher defaultMode="dark"/>

<div class="min-h-svh flex flex-col">
  <Header sidebarNavLinks={data.sidebarNavLinks} />

  <main class="flex-1 flex flex-col">
    <Tooltip.Provider>
      {@render children()}
    </Tooltip.Provider>
  </main>

  <Footer />
</div>
