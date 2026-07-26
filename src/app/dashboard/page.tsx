import { Suspense } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { UtensilsCrossed } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DatePickerLink } from "@/components/date-picker-link"
import { getMealsForUserOnDate } from "@/data/meals"
import { MealLoggedToast } from "./meal-logged-toast"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { userId } = await auth()
  if (!userId) return null

  const { date: dateParam } = await searchParams
  const date = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date()

  const meals = await getMealsForUserOnDate(userId, date)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <Suspense fallback={null}>
        <MealLoggedToast />
      </Suspense>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Track meals for any day.
        </p>
      </div>

      <DatePickerLink date={date} />

      <Card>
        <CardHeader>
          <CardTitle>Meals for {format(date, "EEEE, MMMM d, yyyy")}</CardTitle>
          <CardDescription>
            {meals.length} meal
            {meals.length === 1 ? "" : "s"} logged
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meals.length > 0 ? (
            <ScrollArea className="h-[360px] pr-4">
              <ul className="flex flex-col gap-3">
                {meals.map((meal) => {
                  const calories = meal.items.reduce(
                    (sum, item) =>
                      sum + (item.food?.caloriesPerUnit ?? 0) * item.quantity,
                    0
                  )
                  return (
                    <li key={meal.id}>
                      <Link
                        href={`/dashboard/meals/${meal.id}`}
                        className="hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {meal.name ?? "Meal"}
                            </span>
                            <Badge variant="secondary">
                              {format(meal.loggedAt, "p")}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(calories)} kcal
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
              <UtensilsCrossed className="size-8" />
              <p>No meals logged for this date.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
