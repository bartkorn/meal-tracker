"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

import { Calendar } from "@/components/ui/calendar"

export function MonthCalendar({
  today,
  loggedDates,
}: {
  today: Date
  loggedDates: Date[]
}) {
  const router = useRouter()

  return (
    <Calendar
      mode="single"
      defaultMonth={today}
      selected={undefined}
      locale={enUS}
      modifiers={{ logged: loggedDates }}
      onSelect={(selected) => {
        if (!selected) return
        router.push(`/dashboard/day?date=${format(selected, "yyyy-MM-dd")}`)
      }}
      className="w-full [--cell-size:--spacing(10)]"
      classNames={{
        root: "w-full",
        month: "w-full",
      }}
    />
  )
}
