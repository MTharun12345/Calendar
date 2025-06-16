"use client"

import type React from "react"

import { Calendar, CalendarDays, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/contexts/app-context"
import type { CalendarView } from "@/lib/types"

export function CalendarViewSwitcher() {
  const { currentView, setCurrentView } = useAppContext()

  const views: { value: CalendarView; label: string; icon: React.ComponentType<any> }[] = [
    { value: "month", label: "Month", icon: Calendar },
    { value: "week", label: "Week", icon: CalendarDays },
    { value: "day", label: "Day", icon: Clock },
  ]

  return (
    <div className="flex items-center border rounded-lg p-1 bg-muted/50">
      {views.map((view) => {
        const Icon = view.icon
        return (
          <Button
            key={view.value}
            variant={currentView === view.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView(view.value)}
            className={`flex items-center gap-2 ${
              currentView === view.value ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
