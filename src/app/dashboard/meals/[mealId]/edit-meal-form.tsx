"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FoodItemsEditor,
  createEmptyItemRow,
  type Food,
  type ItemRow,
} from "../food-items-editor"
import { createFood } from "../actions"
import { updateMeal } from "./actions"

type Meal = {
  id: number
  name: string | null
  loggedAt: Date
  items: { foodId: number; quantity: number }[]
}

export function EditMealForm({ meal, foods }: { meal: Meal; foods: Food[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(meal.name ?? "")
  const [loggedAt, setLoggedAt] = useState(() =>
    format(meal.loggedAt, "yyyy-MM-dd'T'HH:mm")
  )
  const [items, setItems] = useState<ItemRow[]>(() =>
    meal.items.length > 0
      ? meal.items.map((item, index) => ({
          key: index,
          foodId: String(item.foodId),
          quantity: String(item.quantity),
          newFoodName: "",
          newFoodCalories: "",
        }))
      : [createEmptyItemRow(0)]
  )

  function addItem() {
    setItems((rows) => [
      ...rows,
      createEmptyItemRow(rows.length === 0 ? 0 : rows[rows.length - 1].key + 1),
    ])
  }

  function removeItem(key: number) {
    setItems((rows) => rows.filter((row) => row.key !== key))
  }

  function updateItem(key: number, patch: Partial<ItemRow>) {
    setItems((rows) =>
      rows.map((row) => (row.key === key ? { ...row, ...patch } : row))
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const relevantRows = items.filter((row) => row.foodId !== "")

    if (relevantRows.length === 0) {
      setError("Add at least one food item.")
      return
    }

    startTransition(async () => {
      try {
        const parsedItems = await Promise.all(
          relevantRows.map(async (row) => {
            if (row.foodId === "__new__") {
              const food = await createFood(
                row.newFoodName,
                Number(row.newFoodCalories)
              )
              return { foodId: food.id, quantity: Number(row.quantity) }
            }
            return {
              foodId: Number(row.foodId),
              quantity: Number(row.quantity),
            }
          })
        )

        await updateMeal(meal.id, name, new Date(loggedAt), parsedItems)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update meal."
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Meal name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Breakfast"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="loggedAt">Date &amp; time</Label>
        <Input
          id="loggedAt"
          type="datetime-local"
          value={loggedAt}
          onChange={(e) => setLoggedAt(e.target.value)}
          required
        />
      </div>

      <FoodItemsEditor
        items={items}
        foods={foods}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onUpdateItem={updateItem}
      />

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
