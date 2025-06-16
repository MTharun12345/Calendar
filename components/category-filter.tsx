"use client"

import { useState } from "react"
import { Filter, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppContext } from "@/contexts/app-context"
import { CategoryModal } from "./category-modal"

export function CategoryFilter() {
  const { categories, selectedCategories, setSelectedCategories } = useAppContext()
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
  }

  const getCategoryColor = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500/20 text-blue-700 border-blue-500/30",
      green: "bg-green-500/20 text-green-700 border-green-500/30",
      red: "bg-red-500/20 text-red-700 border-red-500/30",
      purple: "bg-purple-500/20 text-purple-700 border-purple-500/30",
      yellow: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
    }
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500/20 text-gray-700 border-gray-500/30"
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Categories
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filter by Categories</h4>
                <Button variant="ghost" size="sm" onClick={() => setIsCategoryModalOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-3 h-3 rounded-full bg-${category.color}-500`} />
                      <label htmlFor={category.id} className="text-sm font-medium cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {selectedCategories.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {selectedCategories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId)
              if (!category) return null

              return (
                <Badge
                  key={categoryId}
                  variant="outline"
                  className={`${getCategoryColor(category.color)} flex items-center gap-1`}
                >
                  {category.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryToggle(categoryId)} />
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {isCategoryModalOpen && (
        <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
      )}
    </>
  )
}
