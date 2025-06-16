"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarGrid } from "@/components/calendar-grid"
import { WeekView } from "@/components/week-view"
import { DayView } from "@/components/day-view"
import { EventModal } from "@/components/event-modal"
import { EventDetailsModal } from "@/components/event-details-modal"
import { CalendarViewSwitcher } from "@/components/calendar-view-switcher"
import { CategoryFilter } from "@/components/category-filter"
import { ExportCalendar } from "@/components/export-calendar"
import { useAppContext } from "@/contexts/app-context"
import type { Event } from "@/lib/types"

export function EventsPage() {
  const { events, currentView, selectedCategories, categories } = useAppContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Filter events by selected categories
  const filteredEvents =
    selectedCategories.length > 0
      ? events.filter((event) => event.category && selectedCategories.includes(event.category))
      : events

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsEventModalOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsDetailsModalOpen(true)
  }

  const renderCalendarView = () => {
    switch (currentView) {
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onDateChange={setCurrentDate}
          />
        )
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={filteredEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onDateChange={setCurrentDate}
          />
        )
      default:
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">{format(currentDate, "MMMM yyyy")}</h1>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="rounded-r-none">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous month</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextMonth} className="rounded-l-none border-l-0">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next month</span>
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSelectedDate(new Date())
                  setIsEventModalOpen(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>

            <CalendarGrid
              currentDate={currentDate}
              events={filteredEvents}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          </>
        )
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <CalendarViewSwitcher />
          <CategoryFilter />
        </div>

        <div className="flex items-center gap-2">
          <ExportCalendar />
          {currentView === "month" && (
            <Button
              onClick={() => {
                setSelectedDate(new Date())
                setIsEventModalOpen(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          )}
        </div>
      </div>

      {renderCalendarView()}

      {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          selectedDate={selectedDate}
          event={selectedEvent}
        />
      )}

      {isDetailsModalOpen && selectedEvent && (
        <EventDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  )
}
