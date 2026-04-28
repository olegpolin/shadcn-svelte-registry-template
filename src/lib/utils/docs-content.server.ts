type RegistryExampleReferences = {
  previewNames: string[];
  sourceNames: string[];
};

type RegistryExampleSources = Record<string, string>;

const componentPreviewNameRegex = /<ComponentPreview\s[^>]*\bname=["']([^"']+)["']/g;
const registrySourceNameRegex = /<(?:ComponentPreview|CodeBlock)\s[^>]*\bname=["']([^"']+)["']/g;

const registryExampleSourceModules = import.meta.glob(
  '/src/lib/registry/examples/*.svelte',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>;

function collectUniqueMatches(markdown: string, regex: RegExp): string[] {
  const names = new Set<string>();
  let match: RegExpExecArray | null;

  regex.lastIndex = 0;

  while ((match = regex.exec(markdown)) !== null) {
    names.add(match[1]);
  }

  return [...names];
}

function getRegistryExampleSource(name: string): string | undefined {
  return registryExampleSourceModules[`/src/lib/registry/examples/${name}.svelte`];
}

export function extractRegistryExampleReferences(markdown: string): RegistryExampleReferences {
  return {
    previewNames: collectUniqueMatches(markdown, componentPreviewNameRegex),
    sourceNames: collectUniqueMatches(markdown, registrySourceNameRegex)
  };
}

export function getRegistryExampleSources(names: string[]): RegistryExampleSources {
  const sources: RegistryExampleSources = {};

  for (const name of names) {
    const source = getRegistryExampleSource(name);

    if (source) {
      sources[name] = source;
    }
  }

  return sources;
}
