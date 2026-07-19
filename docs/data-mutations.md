# Data Mutation Standards

## Core rule: Server Actions only

All data mutations (create/update/delete) must be performed via Server Actions. Route handlers (`src/app/api/**/route.ts`) must never be used for mutations, consistent with `docs/data-fetching.md`.

- Server Actions live in co-located files named `actions.ts` (e.g. `src/app/dashboard/actions.ts`), placed next to the route/component that uses them.
- Each file must start with `"use server"`.
- Client Components trigger mutations by importing and calling these Server Actions directly (e.g. from a form's `action` prop, or a button's `onClick` via a wrapped handler) — never via `fetch` to a route handler.

## Explicit parameters, no `FormData`

- Server Actions must take explicitly typed parameters — every parameter must have an explicit TypeScript type. Do not type parameters as `any` or leave them inferred from unchecked input.
- Server Actions must **not** accept a `FormData` parameter. If a form needs to submit to an action, collect the individual field values and call the action with typed arguments (e.g. via a client-side handler) rather than passing the raw `FormData` object through.

```ts
// app/dashboard/actions.ts
"use server";

export async function logMeal(name: string, quantity: number, foodId: number) {
  // ...
}
```

## Validate with Zod

- Every Server Action must validate its arguments with [Zod](https://zod.dev) before doing anything else. Define a Zod schema for the action's input and parse (not just type) the arguments at the top of the function.
- If validation fails, the action must not proceed to call any `/data` helper or touch the database.

```ts
// app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createMealForUser } from "@/data/meals";

const logMealSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  foodId: z.number().int().positive(),
});

export async function logMeal(name: string, quantity: number, foodId: number) {
  const input = logMealSchema.parse({ name, quantity, foodId });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return createMealForUser(userId, input);
}
```

## Database access goes through `/data`

- Server Actions must never import `db` from `src/db` and mutate it directly. All writes go through helper functions defined in `src/data` (e.g. `data/meals.ts`), same as reads — see `docs/data-fetching.md`.
- `/data` helper functions must use Drizzle ORM's query builder for mutations (`db.insert(...)`, `db.update(...)`, `db.delete(...)`). Do not use raw SQL.
- Server Actions are responsible for validation (Zod) and auth (Clerk); `/data` helpers are responsible for the actual Drizzle write and per-user scoping.

## Per-user data isolation

- As with reads, get the current user's ID via Clerk's `auth()` inside the Server Action, then pass it explicitly into the `/data` helper. Helpers must not read auth state themselves.
- Every `/data` helper that mutates user-owned data must scope the Drizzle query by `userId` (e.g. `where(eq(meals.userId, userId))` on updates/deletes), so one user can never mutate another user's rows.

```ts
// data/meals.ts
import { db } from "@/db";
import { meals } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createMealForUser(
  userId: string,
  input: { name: string; quantity: number; foodId: number }
) {
  return db.insert(meals).values({ ...input, userId });
}

export async function deleteMealForUser(userId: string, mealId: number) {
  return db.delete(meals).where(and(eq(meals.id, mealId), eq(meals.userId, userId)));
}
```
