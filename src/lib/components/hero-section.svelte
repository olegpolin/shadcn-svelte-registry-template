<script lang="ts">
  import { Button } from '$lib/registry/ui/button';
  import { badgeVariants } from '$lib/registry/ui/badge';
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

  interface Props {
    title: string;
    description: string;
    primaryCta: {
      text: string;
      href: string;
    };
    secondaryCta: {
      text: string;
      href: string;
    };
  }
  let { title, description, primaryCta, secondaryCta }: Props = $props();
</script>

<div class="w-full mx-auto px-2">
  <div class="max-w-350 3xl:max-w-screen-2xl flex flex-col items-center gap-2 text-center xl:gap-4 px-4 lg:px-8 py-8 md:py-16 lg:py-20 mx-auto">
    <a class={badgeVariants({ variant: 'secondary', class: 'bg-transparent' })} href="https://www.shadcn-svelte.com" target="_blank" rel="noopener noreferrer">
      <span class="bg-[#ff3e00] size-2 rounded-full"></span>
      Based on shadcn-svelte
      <ArrowRightIcon />
    </a>
    <h1 class="max-w-4xl text-4xl xl:text-5xl text-balance font-semibold tracking-tight xl:tracking-tighter lg:leading-[1.1]">{title}</h1>
    <p class="max-w-3xl sm:text-lg text-balance">{description}</p>
    <div class="w-full flex flex-row items-center justify-center gap-2 pt-2">
      <Button size="sm" href={primaryCta.href}>{primaryCta.text}</Button>
      <Button variant="ghost" size="sm" href={secondaryCta.href}>{secondaryCta.text}</Button>
    </div>
  </div>
</div>
