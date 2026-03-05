export type ComponentLink = {
  title: string;
  href: string;
}

export const sidebarNavLinks = [
  {
    title: 'Sections',
    links: [
      {
        title: 'Get Started',
        href: '/docs'
      },
      {
        title: 'Components',
        href: '/docs/components'
      }
    ]
  },
  {
    title: 'Get Started',
    links: [
      {
        title: 'Installation',
        href: '/docs/installation'
      },
      {
        title: 'Theming',
        href: '/docs/theming'
      },
      {
        title: 'Dark Mode',
        href: '/docs/dark-mode'
      },
      {
        title: 'CLI',
        href: '/docs/cli'
      }
    ]
  }
]

const modules = import.meta.glob('/src/lib/content/docs/components/*.md', { eager: true });

let components: ComponentLink[] = [];

for (const path in modules) {
  const module = modules[path] as { metadata: { title: string; description: string } };
  const componentMetadata = module.metadata;
  components.push({
    title: componentMetadata.title,
    href: `/docs/components/${path.split('/').pop()?.replace('.md', '')}`
  });
}

export const componentLinks = components;
