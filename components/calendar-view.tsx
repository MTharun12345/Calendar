"use client"

import { useState } from "react"
import { format, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarGrid } from "@/components/calendar-grid"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { EventModal } from "@/components/event-modal"
import { EventDetailsModal } from "@/components/event-details-modal"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Event } from "@/lib/types"
import { events as initialEvents } from "@/lib/data"

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isMobile = useMediaQuery("(max-width: 768px)")

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

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent])
    setIsEventModalOpen(false)
  }

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setIsDetailsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setIsDetailsModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title="Events > Little Tigers Karate" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h1>
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
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>

          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        </main>
      </div>

      {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onAddEvent={handleAddEvent}
          selectedDate={selectedDate}
          event={selectedEvent}
        />
      )}

      {isDetailsModalOpen && selectedEvent && (
        <EventDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          event={selectedEvent}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  )
}
