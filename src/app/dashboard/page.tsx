import { auth } from "@clerk/nextjs/server"

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
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  getDailyCaloriesForUserInMonth,
  getLoggedDatesForUser,
} from "@/data/meals"
import { MonthCalendar } from "./month-calendar"
import { MonthlyCaloriesChart } from "./monthly-calories-chart"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) return null

  const today = new Date()
  const loggedDates = await getLoggedDatesForUser(userId)
  const dailyCalories = await getDailyCaloriesForUserInMonth(
    userId,
    today.getFullYear(),
    today.getMonth()
  )

  const daysWithData = dailyCalories.filter((d) => d.calories > 0)
  const averageDailyCalories =
    daysWithData.length > 0
      ? Math.round(
          daysWithData.reduce((sum, d) => sum + d.calories, 0) /
            daysWithData.length
        )
      : 0

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Pick a day to view or log meals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly calories</CardTitle>
          <CardDescription>
            {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-4xl font-bold tracking-tight">
              {averageDailyCalories.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">
              average kcal / day logged
            </span>
          </div>
          <MonthlyCaloriesChart data={dailyCalories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a day to jump to it.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <MonthCalendar today={today} loggedDates={loggedDates} />
        </CardContent>
      </Card>
    </div>
  )
}
