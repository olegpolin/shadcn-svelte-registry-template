<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { ModeWatcher } from 'mode-watcher';
  import Header from '$lib/components/header.svelte';
  import Footer from '$lib/components/footer.svelte';
  import type { LayoutProps } from './$types';

  let { children, data }: LayoutProps = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher defaultMode="dark"/>

<div class="min-h-svh flex flex-col">
  <Header sidebarNavLinks={data.sidebarNavLinks} />

  <main class="flex-1 flex flex-col">
    {@render children()}
  </main>

  <Footer />
</div>
