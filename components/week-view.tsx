"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Event } from "@/lib/types"

interface WeekViewProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
  onDateChange: (date: Date) => void
}

export function WeekView({ currentDate, events, onDateClick, onEventClick, onDateChange }: WeekViewProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])

  useEffect(() => {
    const startDate = startOfWeek(currentDate)
    const endDate = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    setWeekDays(days)
  }, [currentDate])

  const handlePreviousWeek = () => {
    const newDate = subWeeks(currentDate, 1)
    onDateChange(newDate)
  }

  const handleNextWeek = () => {
    const newDate = addWeeks(currentDate, 1)
    onDateChange(newDate)
  }

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

  const getEventColor = (color?: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30"
      case "green":
        return "bg-green-500/20 text-green-700 border-green-500/30"
      case "red":
        return "bg-red-500/20 text-red-700 border-red-500/30"
      case "purple":
        return "bg-purple-500/20 text-purple-700 border-purple-500/30"
      case "yellow":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      default:
        return "bg-primary/20 text-primary border-primary/30"
    }
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </h2>
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek} className="rounded-r-none">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextWeek} className="rounded-l-none border-l-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="grid grid-cols-8 border-b bg-muted/50">
          <div className="p-3 text-sm font-medium">Time</div>
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="p-3 text-center">
              <div className="text-sm font-medium">{format(day, "EEE")}</div>
              <div className={cn("text-lg font-semibold mt-1", isSameDay(day, new Date()) && "text-primary")}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {timeSlots.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b min-h-[60px]">
              <div className="p-2 text-xs text-muted-foreground border-r">
                {format(new Date().setHours(hour, 0, 0, 0), "h:mm a")}
              </div>
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day).filter((event) => {
                  const eventHour = new Date(event.startTime).getHours()
                  return eventHour === hour
                })

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="border-r p-1 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onDateClick(day)}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs p-1 rounded border cursor-pointer mb-1 truncate",
                          getEventColor(event.color),
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick(event)
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="opacity-75">{format(parseISO(event.startTime), "h:mm a")}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
