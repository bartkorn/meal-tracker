import { db } from "@/db";

export async function getAllFoods() {
  return db.query.foods.findMany({
    orderBy: { name: "asc" },
  });
}
