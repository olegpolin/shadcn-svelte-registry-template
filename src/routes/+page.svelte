<script lang="ts">
  import HeroSection from "$lib/components/hero-section.svelte";

  const title = 'The Foundation for your Design System';
  const description = 'A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.';
</script>

<HeroSection
  {title}
  {description}
  primaryCta={{
    text: 'Get Started',
    href: '/docs/installation'
  }}
  secondaryCta={{
    text: 'View Components',
    href: '/docs/components'
  }}
/>
