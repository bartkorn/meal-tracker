# Authentication Standards

## Core rule: Clerk only

All authentication in this app is handled by [Clerk](https://clerk.com). **Do not introduce another auth solution** (NextAuth, custom JWT/session handling, Passport, etc.) and do not hand-roll sign-in/sign-up flows, password handling, or session logic.

- Auth UI must use Clerk's prebuilt components (`<SignIn />`, `<SignUp />`, `<SignInButton />`, `<SignUpButton />`, `<UserButton />`, `<Show when="signed-in">` / `<Show when="signed-out">`), imported from `@clerk/nextjs`. Do not build custom login/signup forms.
- Route protection is centralized in `src/proxy.ts` via `clerkMiddleware` and `createRouteMatcher`. Add new public (unauthenticated) routes to the `isPublicRoute` matcher there — do not add ad-hoc auth checks in individual pages to work around the middleware.
- The whole app is wrapped in `<ClerkProvider>` in `src/app/layout.tsx`. Do not add a second provider or re-wrap subtrees.

## Getting the current user

- In Server Components and Server Actions, get the current user via `auth()` from `@clerk/nextjs/server`:

  ```ts
  import { auth } from "@clerk/nextjs/server";

  const { userId } = await auth();
  if (!userId) return null; // or redirect, depending on context
  ```

- Per `docs/data-fetching.md`, `userId` must be read from Clerk in the Server Component/Action and passed explicitly into `/data` helper functions. Helper functions must never call `auth()` themselves or trust a `userId` from any other source (e.g. request body, query params).
- Do not use client-side Clerk hooks (`useAuth`, `useUser`, etc.) to gate data access or fetch user-owned data — this app fetches exclusively in Server Components per `docs/data-fetching.md`. Client-side Clerk hooks are only acceptable for purely presentational UI state (e.g. conditionally rendering UI chrome), not for authorization decisions.

## Authorization

- Route-level protection (is this request allowed at all) belongs in `src/proxy.ts`.
- Data-level authorization (can this user see/modify this row) belongs in the `/data` helpers, scoped by `userId` as described in `docs/data-fetching.md`. Never rely on middleware alone to enforce per-user data isolation.

## Sign-in / sign-up pages

- Dedicated auth pages live at `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`, rendering Clerk's `<SignIn />` / `<SignUp />` catch-all components. Keep new auth-related routes in this same catch-all pattern rather than building custom routing for auth screens.
- For quick sign-in/sign-up entry points elsewhere in the UI (e.g. header), use `<SignInButton mode="modal" />` / `<SignUpButton mode="modal" />` as already done in `src/app/layout.tsx`, rather than linking to a custom modal implementation.
