<script lang="ts">
  import * as NavigationMenu from '$lib/registry/ui/navigation-menu';
  import * as DropdownMenu from '$lib/registry/ui/dropdown-menu';
  import * as Popover from '$lib/registry/ui/popover';
  import { Button, buttonVariants } from '$lib/registry/ui/button';
  import { Separator } from '$lib/registry/ui/separator';
  import { userPrefersMode } from 'mode-watcher';
  import { sidebarNavLinks, componentLinks } from '$lib/utils/navigation';
  import Logo from '$lib/assets/logo.svelte';
  import GitHubIcon from '$lib/assets/icons/github-icon.svelte';
  import ModeSwitcherIcon from '$lib/assets/icons/mode-switcher-icon.svelte';
  import SunIcon from '@lucide/svelte/icons/sun';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import MonitorIcon from '@lucide/svelte/icons/monitor';

  const navMenuLinks = [
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
      href:'/charts/area'
    },
    {
      title: 'Themes',
      href: '/themes'
    },
    {
      title: 'Colors',
      href: '/colors'
    }
  ]

  let mobileMenuOpen = $state(false);
</script>

{#snippet mobileLink({ title, href }: { title: string; href: string })}
  <a class="text-2xl font-medium active:opacity-60" href={href} onclick={() => (mobileMenuOpen = false)}>
    {title}
  </a>
{/snippet}

<header class="h-14 flex flex-row items-center justify-between gap-8 px-6 py-3">
  <Popover.Root bind:open={mobileMenuOpen}>
    <Popover.Trigger class={['md:hidden gap-2.5! p-0!', buttonVariants({ variant: 'ghost' })]}>
      <div class="h-8 flex flex-row items-center">
        <div class="relative size-4">
          <span
            class={[
              'bg-foreground absolute inset-s-0 block h-0.5 w-4 transition-all duration-100',
              mobileMenuOpen ? 'top-[0.4rem] -rotate-45' : 'top-1'
            ]}
          ></span>
          <span
            class={[
              'bg-foreground absolute inset-s-0 block h-0.5 w-4 transition-all duration-100',
              mobileMenuOpen ? 'top-[0.4rem] rotate-45' : 'top-2.5'
            ]}
          ></span>
        </div>
        <span class="sr-only">Toggle Menu</span>
      </div>
      <span class="flex items-center text-lg font-medium">Menu</span>
    </Popover.Trigger>
    <Popover.Content
      class="bg-background/50 h-(--bits-popover-content-available-height) w-(--bits-popover-content-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur"
      align="start"
      side="bottom"
      preventScroll
    >
      <div class="flex flex-col gap-8 overflow-auto p-6">
        <div class="flex flex-col gap-4">
          <span class="text-sm text-muted-foreground font-medium">Menu</span>
          <div class="flex flex-col gap-3">
            {@render mobileLink({ title: 'Home', href: '/' })}
            {#each navMenuLinks as navMenuLink}
              {@render mobileLink({ title: navMenuLink.title, href: navMenuLink.href })}
            {/each}
          </div>
        </div>

        {#each sidebarNavLinks as group (group.title)}
          <div class="flex flex-col gap-4">
            <span class="text-sm text-muted-foreground font-medium">{group.title}</span>
            <div class="flex flex-col gap-3">
              {#each group.links as groupLink}
                {@render mobileLink({ title: groupLink.title, href: groupLink.href })}
              {/each}
            </div>
          </div>
        {/each}

        <div class="flex flex-col gap-4">
          <span class="text-sm text-muted-foreground font-medium">Components</span>
          <div class="flex flex-col gap-3">
            {#each componentLinks as componentLink}
              {@render mobileLink({ title: componentLink.title, href: componentLink.href })}
            {/each}
          </div>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>

  <NavigationMenu.Root class="max-md:hidden">
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link>
          {#snippet child()}
            <Button variant="ghost" size="icon-sm" href="/">
              <Logo />
            </Button>
          {/snippet}
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      {#each navMenuLinks as navMenuLink}
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            {#snippet child()}
              <Button variant="ghost" size="sm" href={navMenuLink.href}>{navMenuLink.title}</Button>
            {/snippet}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/each}
    </NavigationMenu.List>
  </NavigationMenu.Root>

  <div class="flex flex-row items-center gap-4">
    <Button variant="ghost" size="icon-sm" href="https://github.com/olegpolin/shadcn-svelte-registry-template" target="_blank" rel="noopener noreferrer">
      <GitHubIcon />
    </Button>
    <Separator class="h-4" orientation="vertical" />
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}>
        <ModeSwitcherIcon />
        <span class="sr-only">Toggle theme</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.RadioGroup bind:value={userPrefersMode.current}>
          <DropdownMenu.RadioItem value="light">
            Light
            <DropdownMenu.Shortcut>
              <SunIcon />
            </DropdownMenu.Shortcut>
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark">
            Dark
            <DropdownMenu.Shortcut>
              <MoonIcon />
            </DropdownMenu.Shortcut>
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="system">
            System
            <DropdownMenu.Shortcut>
              <MonitorIcon />
            </DropdownMenu.Shortcut>
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</header>
