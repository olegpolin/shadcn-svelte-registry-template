# [shadcn-svelte-registry-template](https://shadcn-svelte-registry-template.vercel.app)

A template for creating your own [shadcn-svelte](https://www.shadcn-svelte.com) compatible component registry.

The UI components are in `src/lib/registry/ui`, the docs for each component are in `src/lib/content/docs`, and the registry JSON file is `registry.json`.

Read the [shadcn-svelte registry docs](https://www.shadcn-svelte.com/docs/registry) for more information on how to make your own registry.

## Developing

Once you've installed dependencies with `npm install`, start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

To build your registry, run the build registry script:

```sh
npm run registry:build
```

This will generate the registry JSON files in `static/r`, using your `registry.json` file.

## Building

To create a production version of your app:

```sh
npm run build
```

This also runs the build registry script.

You can preview the production build with `npm run preview`.
