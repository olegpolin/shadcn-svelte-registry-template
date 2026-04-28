export type ComponentLink = {
  title: string;
  href: string;
}

export const headerLinks = [
  {
    title: 'Docs',
    href: '/docs/installation'
  },
  {
    title: 'Components',
    href: '/docs/components'
  },
  {
    title: 'Blocks',
    href: '/blocks'
  },
  {
    title: 'Charts',
    href:'/charts'
  },
  {
    title: 'Colors',
    href: '/colors'
  }
];

export type SidebarNavGroup = {
  title: string;
  links: ComponentLink[];
};

/**
 * Builds the sidebar navigation links given a list of component links.
 * This function is pure — the glob-based component discovery is done
 * server-side in navigation.server.ts.
 */
export function buildSidebarNavLinks(componentLinks: ComponentLink[]): SidebarNavGroup[] {
  return [
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
    },
    {
      title: 'Components',
      links: componentLinks
    }
  ];
}
