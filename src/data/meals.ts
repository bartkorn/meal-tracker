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

export async function getLoggedDatesForUser(userId: string) {
  const rows = await db.query.meals.findMany({
    where: { userId },
    columns: { loggedAt: true },
  });

  const dates = new Set(
    rows.map((row) => {
      const d = new Date(row.loggedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  return Array.from(dates, (time) => new Date(time));
}

export async function getDailyCaloriesForUserInMonth(
  userId: string,
  year: number,
  month: number
) {
  const startOfMonth = new Date(year, month, 1);
  const startOfNextMonth = new Date(year, month + 1, 1);

  const rows = await db.query.meals.findMany({
    where: {
      userId,
      loggedAt: { gte: startOfMonth, lt: startOfNextMonth },
    },
    with: { items: { with: { food: true } } },
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalsByDay = new Array(daysInMonth).fill(0) as number[];

  for (const meal of rows) {
    const day = new Date(meal.loggedAt).getDate();
    const calories = meal.items.reduce(
      (sum, item) => sum + (item.food?.caloriesPerUnit ?? 0) * item.quantity,
      0
    );
    totalsByDay[day - 1] += calories;
  }

  return totalsByDay.map((calories, index) => ({
    day: index + 1,
    calories: Math.round(calories),
  }));
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
