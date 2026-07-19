# UI Coding Standards

## Core rule: shadcn/ui only

All UI in this project must be built from [shadcn/ui](https://ui.shadcn.com) components. **No custom UI components are to be created.**

- Do not hand-roll buttons, inputs, dialogs, dropdowns, cards, tables, tooltips, forms, navigation, or any other visual element. If shadcn/ui offers a component for it, use that component.
- If a needed component doesn't exist yet in `src/components/ui`, install it via the shadcn CLI instead of writing it from scratch:

  ```bash
  npx shadcn@latest add <component>
  ```

- Do not fork, rewrite, or reimplement a shadcn component's internals to work around a limitation. Use the component's documented props/composition patterns (`asChild`, slots, variants, etc.) instead.
- Do not introduce other component libraries (MUI, Chakra, Ant Design, Radix used directly outside of what shadcn generates, react-bootstrap, etc.).

## Where components live

- Generated shadcn components live in `src/components/ui` (see `components.json` → `aliases.ui`). Treat this directory as generated/vendored code — extend via shadcn's own variant system (e.g. `cva`), not by editing structure outside what the CLI produced.
- Application code composes screens/features purely by assembling shadcn components — no new bespoke presentational components in `src/components` outside the `ui` folder.

## Styling

- Use Tailwind CSS utility classes for layout and spacing between shadcn components. Do not write custom CSS files or ad-hoc `<style>` blocks.
- Theme via the existing Tailwind/shadcn CSS variables in `src/app/globals.css` (base color `neutral`, style `base-nova`). Don't introduce a separate design-token or theme system.
- Icons come from `lucide-react` (the configured `iconLibrary`), matching the icons already used by shadcn components.

## Adding new UI

When a feature needs a UI element:

1. Check if an existing shadcn component in `src/components/ui` already covers it.
2. If not, install the appropriate shadcn component with the CLI (see command above).
3. Compose the feature using that component's props and shadcn's built-in variants/composition patterns.
4. Never write a new one-off component from raw HTML/JSX when a shadcn equivalent exists.

## Project setup reference

- `components.json`: style `base-nova`, base color `neutral`, RSC enabled, TypeScript, Tailwind CSS v4 (`@tailwindcss/postcss`).
- Path aliases: `@/components/ui` for shadcn components, `@/lib/utils` for the `cn()` helper, `@/hooks` for hooks.
