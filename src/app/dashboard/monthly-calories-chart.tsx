"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  calories: {
    label: "Calories",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function MonthlyCaloriesChart({
  data,
}: {
  data: { day: number; calories: number }[]
}) {
  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <BarChart data={data} barCategoryGap={2}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={2}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelKey="day" />}
        />
        <Bar
          dataKey="calories"
          fill="var(--color-calories)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
