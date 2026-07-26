"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { toast } from "sonner"

export function MealLoggedToast() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("mealLogged") !== "1") return

    toast.success("Meal logged successfully")

    const params = new URLSearchParams(searchParams)
    params.delete("mealLogged")
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }, [searchParams, pathname, router])

  return null
}
