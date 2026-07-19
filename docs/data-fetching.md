# Data Fetching Standards

## Core rule: Server Components only

All data fetching in this app must be done via Server Components.

- Under absolutely no circumstances should route handlers (`src/app/api/**/route.ts`) be created to fetch data.
- No client-side fetching (`fetch`, `useEffect`, SWR, React Query, etc.) for reading data. If a screen needs data, fetch it in a Server Component and pass it down as props.
- Mutations that require client interactivity should use Server Actions, not route handlers.

## Database access goes through `/data`

- All database queries must be performed via helper functions defined in the `/data` directory (e.g. `data/meals.ts`, `data/foods.ts`).
- Server Components (and Server Actions) call these helper functions — they must never import `db` from `src/db` and query it directly.
- Helper functions must use Drizzle ORM's query builder. **Do not use raw SQL** (no `db.execute(sql\`...\`)`, no raw string queries).

## Per-user data isolation

A logged-in user must only ever be able to access their own data — never another user's.

- Every helper function in `/data` that reads or writes user-owned data (e.g. `meals`, `mealItems`) must take the current user's ID and filter/scope the Drizzle query by it (e.g. `where(eq(meals.userId, userId))`).
- Get the current user ID from Clerk's `auth()` inside the Server Component, then pass it into the `/data` helper — helpers must not read auth state themselves or trust a caller-supplied ID from anywhere other than the authenticated session.
- Never write a helper that fetches a row by its own `id` alone (e.g. `mealId`) without also constraining by `userId` — this would allow one user to read or mutate another user's row by guessing/enumerating IDs.
- `foods` is shared reference data (not user-owned), so it is not scoped by `userId`.

## Example

```ts
// data/meals.ts
import { db } from "@/db";
import { meals } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getMealsForUser(userId: string) {
  return db.query.meals.findMany({
    where: eq(meals.userId, userId),
    with: { items: { with: { food: true } } },
  });
}

export async function getMealForUser(userId: string, mealId: number) {
  return db.query.meals.findFirst({
    where: and(eq(meals.id, mealId), eq(meals.userId, userId)),
  });
}
```

```tsx
// app/dashboard/page.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";
import { getMealsForUser } from "@/data/meals";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const meals = await getMealsForUser(userId);
  // render meals
}
```
