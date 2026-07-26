"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateMealForUser } from "@/data/meals";

const updateMealSchema = z.object({
  mealId: z.number().int().positive(),
  name: z.string().min(1),
  loggedAt: z.coerce.date(),
  items: z
    .array(
      z.object({
        foodId: z.number().int().positive(),
        quantity: z.number().positive(),
      })
    )
    .min(1),
});

export async function updateMeal(
  mealId: number,
  name: string,
  loggedAt: Date,
  items: { foodId: number; quantity: number }[]
) {
  const input = updateMealSchema.parse({ mealId, name, loggedAt, items });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const meal = await updateMealForUser(userId, input.mealId, input);
  if (!meal) throw new Error("Meal not found");

  redirect("/dashboard?mealUpdated=1");
}
