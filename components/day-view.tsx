"use client"

import { format, addDays, subDays, isSameDay, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Event } from "@/lib/types"

interface DayViewProps {
  currentDate: Date
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
  onDateChange: (date: Date) => void
}

export function DayView({ currentDate, events, onDateClick, onEventClick, onDateChange }: DayViewProps) {
  const handlePreviousDay = () => {
    const newDate = subDays(currentDate, 1)
    onDateChange(newDate)
  }

  const handleNextDay = () => {
    const newDate = addDays(currentDate, 1)
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
  const dayEvents = getEventsForDate(currentDate)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{format(currentDate, "EEEE, MMMM d, yyyy")}</h2>
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={handlePreviousDay} className="rounded-r-none">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextDay} className="rounded-l-none border-l-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="grid grid-cols-2 border-b bg-muted/50">
          <div className="p-3 text-sm font-medium">Time</div>
          <div className="p-3 text-sm font-medium">Events</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {timeSlots.map((hour) => {
            const hourEvents = dayEvents.filter((event) => {
              const eventHour = new Date(event.startTime).getHours()
              return eventHour === hour
            })

            return (
              <div key={hour} className="grid grid-cols-2 border-b min-h-[60px]">
                <div className="p-3 text-sm text-muted-foreground border-r bg-muted/20">
                  {format(new Date().setHours(hour, 0, 0, 0), "h:mm a")}
                </div>
                <div
                  className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onDateClick(currentDate)}
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded border cursor-pointer mb-2 transition-colors",
                        getEventColor(event.color),
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm opacity-75 mt-1">
                        {format(parseISO(event.startTime), "h:mm a")} - {format(parseISO(event.endTime), "h:mm a")}
                      </div>
                      {event.description && <div className="text-xs opacity-60 mt-1">{event.description}</div>}
                      {event.location && <div className="text-xs opacity-60 mt-1">📍 {event.location}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
