import { db } from "@/db";

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
