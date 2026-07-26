import { auth } from "@clerk/nextjs/server"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { MonthCalendar } from "./month-calendar"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) return null

  const today = new Date()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Pick a day to view or log meals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a day to jump to it.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <MonthCalendar today={today} />
        </CardContent>
      </Card>
    </div>
  )
}
