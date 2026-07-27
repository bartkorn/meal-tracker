import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import Link from "next/link"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getAllFoods } from "@/data/foods"
import { getMealForUser } from "@/data/meals"
import { EditMealForm } from "./edit-meal-form"

export default async function EditMealPage({
  params,
}: {
  params: Promise<{ mealId: string }>
}) {
  const { userId } = await auth()
  if (!userId) return null

  const { mealId } = await params
  const parsedMealId = Number(mealId)
  if (!Number.isInteger(parsedMealId) || parsedMealId <= 0) notFound()

  const [meal, foods] = await Promise.all([
    getMealForUser(userId, parsedMealId),
    getAllFoods(),
  ])

  if (!meal) notFound()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/day" />}>
              Day
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit meal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit meal</h1>
        <p className="text-muted-foreground text-sm">
          Update your meal's details and food items.
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
          <EditMealForm
            meal={{
              id: meal.id,
              name: meal.name,
              loggedAt: meal.loggedAt,
              items: meal.items.map((item) => ({
                foodId: item.foodId,
                quantity: item.quantity,
              })),
            }}
            foods={foods}
          />
        </CardContent>
      </Card>
    </div>
  )
}
