import { db } from "@/db";
import { meals, mealItems } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getMealsForUserOnDate(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return db.query.meals.findMany({
    where: {
      userId,
      loggedAt: { gte: startOfDay, lt: endOfDay },
    },
    with: { items: { with: { food: true } } },
    orderBy: { loggedAt: "asc" },
  });
}

export async function getMealForUser(userId: string, mealId: number) {
  return db.query.meals.findFirst({
    where: { id: mealId, userId },
    with: { items: { with: { food: true } } },
  });
}

export async function updateMealForUser(
  userId: string,
  mealId: number,
  input: {
    name: string;
    loggedAt: Date;
    items: { foodId: number; quantity: number }[];
  }
) {
  const [meal] = await db
    .update(meals)
    .set({ name: input.name, loggedAt: input.loggedAt })
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
    .returning();

  if (!meal) return undefined;

  await db.delete(mealItems).where(eq(mealItems.mealId, meal.id));

  if (input.items.length > 0) {
    await db.insert(mealItems).values(
      input.items.map((item) => ({
        mealId: meal.id,
        foodId: item.foodId,
        quantity: item.quantity,
      }))
    );
  }

  return meal;
}

export async function createMealForUser(
  userId: string,
  input: {
    name: string;
    loggedAt: Date;
    items: { foodId: number; quantity: number }[];
  }
) {
  const [meal] = await db
    .insert(meals)
    .values({ userId, name: input.name, loggedAt: input.loggedAt })
    .returning();

  if (input.items.length > 0) {
    await db.insert(mealItems).values(
      input.items.map((item) => ({
        mealId: meal.id,
        foodId: item.foodId,
        quantity: item.quantity,
      }))
    );
  }

  return meal;
}
