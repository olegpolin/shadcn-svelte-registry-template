import type { LayoutServerLoad } from './$types';
import { componentLinks } from '$lib/utils/navigation.server';
import { buildSidebarNavLinks } from '$lib/utils/navigation';

export const load: LayoutServerLoad = () => {
  return {
    componentLinks,
    sidebarNavLinks: buildSidebarNavLinks(componentLinks)
  };
};
