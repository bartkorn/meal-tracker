"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createFood as createFoodForUser } from "@/data/foods";

const createFoodSchema = z.object({
  name: z.string().min(1),
  caloriesPerUnit: z.number().int().positive(),
});

export async function createFood(name: string, caloriesPerUnit: number) {
  const input = createFoodSchema.parse({ name, caloriesPerUnit });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return createFoodForUser(input);
}
