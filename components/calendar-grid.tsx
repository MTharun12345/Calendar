"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns"
import { cn } from "@/lib/utils"
import type { Event } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppContext } from "@/contexts/app-context"

interface CalendarGridProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
}

export function CalendarGrid({ currentDate, events, onDateClick, onEventClick }: CalendarGridProps) {
  const { updateEvent, categories } = useAppContext()
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null)
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null)

  useEffect(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    setCalendarDays(days)
  }, [currentDate])

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      if (!event.recurring && isSameDay(parseISO(event.date), date)) {
        return true
      }
      if (event.recurring === "weekly" && event.daysOfWeek?.includes(format(date, "EEEE").toLowerCase())) {
        return true
      }
      return false
    })
  }

  const getEventColor = (event: Event) => {
    // First try to get color from category
    if (event.category) {
      const category = categories.find((c) => c.id === event.category)
      if (category) {
        const colorMap = {
          blue: "bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30",
          green: "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30",
          red: "bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30",
          purple: "bg-purple-500/20 text-purple-700 border-purple-500/30 hover:bg-purple-500/30",
          yellow: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30",
        }
        return (
          colorMap[category.color as keyof typeof colorMap] ||
          "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
        )
      }
    }

    // Fallback to event color
    switch (event.color) {
      case "blue":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30 hover:bg-blue-500/30"
      case "green":
        return "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30"
      case "red":
        return "bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30"
      case "purple":
        return "bg-purple-500/20 text-purple-700 border-purple-500/30 hover:bg-purple-500/30"
      case "yellow":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30"
      default:
        return "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
    }
  }

  const handleDragStart = (e: React.DragEvent, event: Event) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverDate(date)
  }

  const handleDragLeave = () => {
    setDragOverDate(null)
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    setDragOverDate(null)

    if (draggedEvent && !isSameDay(parseISO(draggedEvent.date), date)) {
      const newDate = format(date, "yyyy-MM-dd")
      const timePart = draggedEvent.startTime.split("T")[1]
      const endTimePart = draggedEvent.endTime.split("T")[1]

      const updatedEvent: Event = {
        ...draggedEvent,
        date: newDate,
        startTime: `${newDate}T${timePart}`,
        endTime: `${newDate}T${endTimePart}`,
      }

      updateEvent(updatedEvent)
    }

    setDraggedEvent(null)
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b bg-muted/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-3 text-center font-semibold text-sm">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)
          const isDragOver = dragOverDate && isSameDay(dragOverDate, day)

          return (
            <div
              key={index}
              className={cn(
                "min-h-[120px] border-r border-b p-2 transition-colors hover:bg-muted/50 cursor-pointer",
                !isCurrentMonth && "text-muted-foreground bg-muted/20",
                isDragOver && "bg-blue-100 dark:bg-blue-900/20",
                "last:border-r-0 [&:nth-child(7n)]:border-r-0",
              )}
              onClick={() => onDateClick(day)}
              onDragOver={(e) => handleDragOver(e, day)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, day)}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    isCurrentDay && "bg-primary text-primary-foreground shadow-md",
                    !isCurrentDay && isCurrentMonth && "hover:bg-muted",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                <TooltipProvider delayDuration={300}>
                  {dayEvents.slice(0, 3).map((event) => {
                    const category = event.category ? categories.find((c) => c.id === event.category) : null

                    return (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "text-xs px-2 py-1 rounded border cursor-pointer transition-colors truncate",
                              getEventColor(event),
                              "select-none",
                            )}
                            draggable
                            onDragStart={(e) => handleDragStart(e, event)}
                            onClick={(e) => {
                              e.stopPropagation()
                              onEventClick(event)
                            }}
                          >
                            <div className="flex items-center gap-1">
                              {category && (
                                <div className={`w-2 h-2 rounded-full bg-${category.color}-500 flex-shrink-0`} />
                              )}
                              <div className="font-medium truncate">{event.title}</div>
                            </div>
                            <div className="text-xs opacity-75">{format(parseISO(event.startTime), "h:mm a")}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs">
                              {format(parseISO(event.startTime), "h:mm a")} -{" "}
                              {format(parseISO(event.endTime), "h:mm a")}
                            </p>
                            {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                            {event.location && <p className="text-xs text-muted-foreground">📍 {event.location}</p>}
                            {category && <p className="text-xs text-muted-foreground">🏷️ {category.name}</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </TooltipProvider>

                {dayEvents.length > 3 && (
                  <Badge variant="outline" className="w-full justify-center text-xs py-0.5">
                    +{dayEvents.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
