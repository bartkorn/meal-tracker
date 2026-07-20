import { db } from "@/db";
import { meals, mealItems } from "@/db/schema";

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
