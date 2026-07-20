"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createMeal } from "./actions"

type Food = {
  id: number
  name: string
  caloriesPerUnit: number
}

type ItemRow = {
  key: number
  foodId: string
  quantity: string
}

export function NewMealForm({ foods }: { foods: Food[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [loggedAt, setLoggedAt] = useState(() =>
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  )
  const [items, setItems] = useState<ItemRow[]>([
    { key: 0, foodId: "", quantity: "1" },
  ])

  function addItem() {
    setItems((rows) => [
      ...rows,
      { key: rows.length === 0 ? 0 : rows[rows.length - 1].key + 1, foodId: "", quantity: "1" },
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

    const parsedItems = items
      .filter((row) => row.foodId !== "")
      .map((row) => ({
        foodId: Number(row.foodId),
        quantity: Number(row.quantity),
      }))

    if (parsedItems.length === 0) {
      setError("Add at least one food item.")
      return
    }

    startTransition(async () => {
      try {
        await createMeal(name, new Date(loggedAt), parsedItems)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create meal."
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

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Food items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            Add item
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((row) => (
            <div key={row.key} className="flex items-center gap-2">
              <Select
                value={row.foodId}
                onValueChange={(value) =>
                  updateItem(row.key, { foodId: value ?? "" })
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a food">
                    {(value: string | null) =>
                      foods.find((food) => String(food.id) === value)?.name ??
                      "Select a food"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {foods.map((food) => (
                    <SelectItem key={food.id} value={String(food.id)}>
                      {food.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="0"
                step="any"
                className="w-24"
                value={row.quantity}
                onChange={(e) =>
                  updateItem(row.key, { quantity: e.target.value })
                }
                placeholder="Qty"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(row.key)}
                disabled={items.length === 1}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

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
          {isPending ? "Saving..." : "Save meal"}
        </Button>
      </div>
    </form>
  )
}
