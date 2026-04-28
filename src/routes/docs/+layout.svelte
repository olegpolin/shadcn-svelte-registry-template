<script lang="ts">
  import type { LayoutProps } from './$types';
  import { page } from '$app/state';
  import * as Sidebar from '$lib/registry/ui/sidebar';

  let { children, data }: LayoutProps = $props();
  let sidebarNavLinks = $derived(data.sidebarNavLinks);
</script>

<Sidebar.Provider class="px-2">
  <Sidebar.Root
    class="max-md:hidden h-[calc(100svh-7.5rem)] xl:h-[calc(100svh-10rem)] sticky top-14.25 z-30 shrink-0 overscroll-none bg-transparent"
    collapsible="none"
  >
    <Sidebar.Content class="no-scrollbar overflow-x-hidden px-2">
      <div class="sticky h-8 -top-1 z-10 shrink-0 bg-linear-to-b from-background via-background/80 to-background/50 blur-xs"></div>
      {#each sidebarNavLinks as group (group.title)}
        <Sidebar.Group>
          <Sidebar.GroupLabel class="font-medium text-muted-foreground">
            {group.title}
          </Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {#each group.links as link}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton class="h-7.5 w-fit text-[0.8rem] font-medium data-[active=true]:bg-accent" isActive={page.url.pathname === link.href}>
                    {#snippet child({ props })}
                      <a {...props} href={link.href}>
                        <span class="absolute inset-0 flex w-full bg-transparent"></span>
                        {link.title}
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              {/each}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      {/each}
      <div class="sticky h-16 -bottom-1 z-10 shrink-0 bg-linear-to-t from-background via-background/80 to-background/50 blur-xs"></div>
    </Sidebar.Content>
  </Sidebar.Root>
  {@render children()}
</Sidebar.Provider>
