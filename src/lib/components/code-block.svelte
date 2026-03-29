<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '$lib/registry/ui/button';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';

	const registryExampleSourceModules = import.meta.glob('/src/lib/registry/examples/*.svelte', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;

	const getRegistryExampleSource = (exampleName: string): string | undefined => {
		return registryExampleSourceModules[`/src/lib/registry/examples/${exampleName}.svelte`];
	};

	let {
		source,
		name,
		class: className,
		children
	}: {
		source?: string;
		name?: string;
		class?: string;
		children?: Snippet;
	} = $props();

	let resolvedSource = $derived(source ?? (name ? getRegistryExampleSource(name) : undefined));

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

<div
	data-slot="code"
	class={['relative overflow-hidden rounded-lg **:data-rehype-pretty-code-figure:m-0! **:data-rehype-pretty-code-figure:rounded-t-none [&_pre]:max-h-100', className]}
>
	{#if children}
		{@render children()}
	{:else if resolvedSource}
		<Button
			data-slot="copy-button"
			size="icon"
			variant="ghost"
			class="bg-code absolute inset-e-2 top-3 z-10 size-7 hover:opacity-100 focus-visible:opacity-100"
			onclick={() => copyToClipboard(resolvedSource)}
		>
			<span class="sr-only" data-llm-ignore>Copy</span>
			{#if copied}
				<CheckIcon />
			{:else}
				<CopyIcon />
			{/if}
		</Button>
		<figure data-rehype-pretty-code-figure>
			<pre class="bg-muted/30 overflow-x-auto p-4 text-sm leading-relaxed"><code>{resolvedSource}</code></pre>
		</figure>
	{/if}
</div>
