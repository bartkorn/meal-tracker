import { auth } from "@clerk/nextjs/server"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { getAllFoods } from "@/data/foods"
import { NewMealForm } from "./new-meal-form"

export default async function NewMealPage() {
  const { userId } = await auth()
  if (!userId) return null

  const foods = await getAllFoods()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">New meal</h1>
        <p className="text-muted-foreground text-sm">
          Log a meal and the foods it contains.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal details</CardTitle>
          <CardDescription>
            Give your meal a name and add at least one food item.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewMealForm foods={foods} />
        </CardContent>
      </Card>
    </div>
  )
}
