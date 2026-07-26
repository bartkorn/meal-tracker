import { db } from "@/db";
import { foods } from "@/db/schema";

export async function getAllFoods() {
  return db.query.foods.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createFood(input: { name: string; caloriesPerUnit: number }) {
  const [food] = await db.insert(foods).values(input).returning();
  return food;
}
