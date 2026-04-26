<script lang="ts">
  import type { Component, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import CodeBlock from '$lib/components/code-block.svelte';
  import { cn } from '$lib/utils';
  import { getRegistryExampleSource } from '$lib/utils/registry-sources';

  const registryExampleModules = import.meta.glob('/src/lib/registry/examples/*.svelte', {
    eager: true,
    import: 'default'
  }) as Record<string, Component>;

  const getRegistryExample = (exampleName: string): Component | undefined => {
    return registryExampleModules[`/src/lib/registry/examples/${exampleName}.svelte`];
  };

  let {
    class: className,
    align = "center",
    component,
    example,
    children,
    name,
    ...restProps
  }: HTMLAttributes<HTMLElement> & {
    align?: "center" | "start" | "end";
    hideCode?: boolean;
    example?: Snippet;
    component?: Component;
    name: string;
  } = $props();

  let registryExample = $derived(getRegistryExample(name));
  let previewComponent = $derived(component ?? registryExample);
  let previewSource = $derived(getRegistryExampleSource(name));
</script>

{#snippet ExampleFallback()}
  {#if previewComponent}
    {@const PreviewComponent = previewComponent}
    <PreviewComponent />
  {:else}
    <p class="text-muted-foreground text-sm">
      Component
      <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
        {name}
      </code>
      not found in registry.
    </p>
  {/if}
{/snippet}

<div
  class={cn("no-prose-docs group relative mt-4 mb-12 flex flex-col gap-2 rounded-lg border", className)}
  {...restProps}
>
  <div>
    <div
      data-slot="preview"
      class="preview flex w-full justify-center data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
      data-llm-ignore
    >
      <div
        data-align={align}
        class="preview flex min-h-112.5 w-full justify-center border-b p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
      >
        {#if example}
          {@render example()}
        {:else}
          {@render ExampleFallback()}
        {/if}
      </div>
    </div>
    <CodeBlock class="rounded-none" source={previewSource} {children} />
  </div>
</div>
