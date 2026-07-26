"use client"

import { Plus, Trash2 } from "lucide-react"

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

const NEW_FOOD_VALUE = "__new__"

export type Food = {
  id: number
  name: string
  caloriesPerUnit: number
}

export type ItemRow = {
  key: number
  foodId: string
  quantity: string
  newFoodName: string
  newFoodCalories: string
}

export function createEmptyItemRow(key: number): ItemRow {
  return { key, foodId: "", quantity: "1", newFoodName: "", newFoodCalories: "" }
}

export function FoodItemsEditor({
  items,
  foods,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: {
  items: ItemRow[]
  foods: Food[]
  onAddItem: () => void
  onRemoveItem: (key: number) => void
  onUpdateItem: (key: number, patch: Partial<ItemRow>) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Food items</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="size-4" />
          Add item
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((row) => {
          const isNew = row.foodId === NEW_FOOD_VALUE
          return (
            <div key={row.key} className="flex flex-col gap-2 rounded-md border p-3">
              <div className="flex items-center gap-2">
                <Select
                  value={row.foodId}
                  onValueChange={(value) =>
                    onUpdateItem(row.key, { foodId: value ?? "" })
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a food">
                      {(value: string | null) =>
                        value === NEW_FOOD_VALUE
                          ? "Create new food"
                          : foods.find((food) => String(food.id) === value)
                              ?.name ?? "Select a food"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {foods.map((food) => (
                      <SelectItem key={food.id} value={String(food.id)}>
                        {food.name}
                      </SelectItem>
                    ))}
                    <SelectItem value={NEW_FOOD_VALUE}>
                      + Create new food
                    </SelectItem>
                  </SelectContent>
                </Select>

                {!isNew && (
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    className="w-24"
                    value={row.quantity}
                    onChange={(e) =>
                      onUpdateItem(row.key, { quantity: e.target.value })
                    }
                    placeholder="Qty"
                  />
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(row.key)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {isNew && (
                <div className="flex items-center gap-2">
                  <Input
                    className="flex-1"
                    value={row.newFoodName}
                    onChange={(e) =>
                      onUpdateItem(row.key, { newFoodName: e.target.value })
                    }
                    placeholder="Food name"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    className="w-36"
                    value={row.newFoodCalories}
                    onChange={(e) =>
                      onUpdateItem(row.key, {
                        newFoodCalories: e.target.value,
                      })
                    }
                    placeholder="Calories/unit"
                  />
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    className="w-24"
                    value={row.quantity}
                    onChange={(e) =>
                      onUpdateItem(row.key, { quantity: e.target.value })
                    }
                    placeholder="Qty"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
