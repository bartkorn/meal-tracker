"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, UtensilsCrossed } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type Meal = {
  id: string
  name: string
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack"
  calories: number
  time: string
}

const placeholderMeals: Meal[] = [
  {
    id: "1",
    name: "Oatmeal with berries",
    type: "Breakfast",
    calories: 320,
    time: "7:30 AM",
  },
  {
    id: "2",
    name: "Grilled chicken salad",
    type: "Lunch",
    calories: 480,
    time: "12:15 PM",
  },
  {
    id: "3",
    name: "Greek yogurt",
    type: "Snack",
    calories: 150,
    time: "3:45 PM",
  },
  {
    id: "4",
    name: "Salmon with roasted vegetables",
    type: "Dinner",
    calories: 610,
    time: "7:00 PM",
  },
]

export default function DashboardPage() {
  const [date, setDate] = React.useState<Date>(new Date())

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Track meals for any day.
        </p>
      </div>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => selected && setDate(selected)}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <Card>
        <CardHeader>
          <CardTitle>Meals for {format(date, "EEEE, MMMM d, yyyy")}</CardTitle>
          <CardDescription>
            {placeholderMeals.length} meal
            {placeholderMeals.length === 1 ? "" : "s"} logged
          </CardDescription>
        </CardHeader>
        <CardContent>
          {placeholderMeals.length > 0 ? (
            <ScrollArea className="h-[360px] pr-4">
              <ul className="flex flex-col gap-3">
                {placeholderMeals.map((meal) => (
                  <li
                    key={meal.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{meal.name}</span>
                        <Badge variant="secondary">{meal.type}</Badge>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {meal.time}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {meal.calories} kcal
                    </span>
                  </li>
                ))}
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
