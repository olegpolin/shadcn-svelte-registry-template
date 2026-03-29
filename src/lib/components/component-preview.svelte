<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Button } from '$lib/registry/ui/button';
	import { cn } from '$lib/utils';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';

	const registryExampleModules = import.meta.glob('/src/lib/registry/examples/*.svelte', {
		eager: true,
		import: 'default'
	}) as Record<string, Component>;

	const registryExampleSourceModules = import.meta.glob('/src/lib/registry/examples/*.svelte', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;

	const getRegistryExample = (exampleName: string): Component | undefined => {
		return registryExampleModules[`/src/lib/registry/examples/${exampleName}.svelte`];
	};

	const getRegistryExampleSource = (exampleName: string): string | undefined => {
		return registryExampleSourceModules[`/src/lib/registry/examples/${exampleName}.svelte`];
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

	let copied = $state(false);
	let copyResetTimer: ReturnType<typeof setTimeout> | undefined;

	const copyToClipboard = async (text: string) => {
		if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
			return;
		}

		await navigator.clipboard.writeText(text);
		copied = true;

		if (copyResetTimer) {
			clearTimeout(copyResetTimer);
		}

		copyResetTimer = setTimeout(() => {
			copied = false;
		}, 2000);
	};

	$effect(() => {
		return () => {
			if (copyResetTimer) {
				clearTimeout(copyResetTimer);
			}
		};
	});
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
	class={cn("group relative mt-4 mb-12 flex flex-col gap-2 rounded-lg border", className)}
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
				class="preview flex min-h-112.5 w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
			>
				{#if example}
					{@render example()}
				{:else}
					{@render ExampleFallback()}
				{/if}
			</div>
		</div>
		<div
			data-slot="code"
			class="relative overflow-hidden **:data-rehype-pretty-code-figure:m-0! **:data-rehype-pretty-code-figure:rounded-t-none **:data-rehype-pretty-code-figure:border-t [&_pre]:max-h-100"
		>
			{#if children}
				{@render children()}
			{:else if previewSource}
				<Button
					data-slot="copy-button"
					size="icon"
					variant="ghost"
					class="bg-code absolute inset-e-2 top-3 z-10 size-7 hover:opacity-100 focus-visible:opacity-100"
					onclick={() => copyToClipboard(previewSource)}
				>
					<span class="sr-only" data-llm-ignore>Copy</span>
					{#if copied}
						<CheckIcon />
					{:else}
						<CopyIcon />
					{/if}
				</Button>
				<figure data-rehype-pretty-code-figure class="border-t">
					<pre class="bg-muted/30 overflow-x-auto p-4 text-sm leading-relaxed"><code>{previewSource}</code></pre>
				</figure>
			{/if}
		</div>
	</div>
</div>
