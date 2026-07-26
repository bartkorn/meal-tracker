"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

import { Calendar } from "@/components/ui/calendar"

export function MonthCalendar({ today }: { today: Date }) {
  const router = useRouter()

  return (
    <Calendar
      mode="single"
      defaultMonth={today}
      selected={undefined}
      locale={enUS}
      onSelect={(selected) => {
        if (!selected) return
        router.push(`/dashboard/day?date=${format(selected, "yyyy-MM-dd")}`)
      }}
      className="rounded-lg border"
    />
  )
}
