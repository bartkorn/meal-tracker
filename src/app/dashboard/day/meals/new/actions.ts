"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createMealForUser } from "@/data/meals";

const createMealSchema = z.object({
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

export async function createMeal(
  name: string,
  loggedAt: Date,
  items: { foodId: number; quantity: number }[]
) {
  const input = createMealSchema.parse({ name, loggedAt, items });

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await createMealForUser(userId, input);

  redirect("/dashboard/day?mealLogged=1");
}
