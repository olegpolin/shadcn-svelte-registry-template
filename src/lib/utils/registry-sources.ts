/**
 * Shared module for raw registry example source strings.
 * Centralizes the import.meta.glob so it's deduplicated across
 * component-preview.svelte and code-block.svelte.
 */
const registryExampleSourceModules = import.meta.glob(
  '/src/lib/registry/examples/*.svelte',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

export function getRegistryExampleSource(name: string): string | undefined {
  return registryExampleSourceModules[`/src/lib/registry/examples/${name}.svelte`];
}
