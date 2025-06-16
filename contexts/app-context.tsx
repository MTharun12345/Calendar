"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Event, Member, Document, EventCategory, CalendarView } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AppContextType {
  events: Event[]
  members: Member[]
  documents: Document[]
  categories: EventCategory[]
  currentView: CalendarView
  selectedCategories: string[]
  addEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  deleteEvent: (eventId: string) => void
  addMember: (member: Member) => void
  updateMember: (member: Member) => void
  deleteMember: (memberId: string) => void
  addCategory: (category: EventCategory) => void
  updateCategory: (category: EventCategory) => void
  deleteCategory: (categoryId: string) => void
  setCurrentView: (view: CalendarView) => void
  setSelectedCategories: (categories: string[]) => void
  exportCalendar: (format: "ics" | "csv" | "json") => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [currentView, setCurrentView] = useState<CalendarView>("month")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [categories, setCategories] = useState<EventCategory[]>([
    { id: "work", name: "Work", color: "blue", description: "Work-related events" },
    { id: "personal", name: "Personal", color: "green", description: "Personal activities" },
    { id: "meeting", name: "Meetings", color: "purple", description: "Team meetings and calls" },
    { id: "deadline", name: "Deadlines", color: "red", description: "Important deadlines" },
    { id: "social", name: "Social", color: "yellow", description: "Social events and gatherings" },
  ])

  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "Jan 2024",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      role: "Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "Feb 2024",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "+1 (555) 345-6789",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: "Mar 2024",
    },
  ])

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Project Proposal.pdf",
      type: "PDF",
      size: "2.4 MB",
      owner: "John Doe",
      modifiedDate: "2024-06-10T10:00:00Z",
    },
    {
      id: "2",
      name: "Team Guidelines.docx",
      type: "DOCX",
      size: "1.2 MB",
      owner: "Sarah Johnson",
      modifiedDate: "2024-06-08T14:30:00Z",
    },
    {
      id: "3",
      name: "Budget Analysis.xlsx",
      type: "XLSX",
      size: "856 KB",
      owner: "Mike Chen",
      modifiedDate: "2024-06-05T09:15:00Z",
    },
  ])

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event])
    toast({
      title: "Event created",
      description: `"${event.title}" has been added to your calendar.`,
    })
  }

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    toast({
      title: "Event updated",
      description: `"${updatedEvent.title}" has been updated.`,
    })
  }

  const deleteEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    toast({
      title: "Event deleted",
      description: event ? `"${event.title}" has been removed from your calendar.` : "Event has been deleted.",
      variant: "destructive",
    })
  }

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member])
    toast({
      title: "Member added",
      description: `${member.name} has been added to the team.`,
    })
  }

  const updateMember = (updatedMember: Member) => {
    setMembers((prev) => prev.map((member) => (member.id === updatedMember.id ? updatedMember : member)))
    toast({
      title: "Member updated",
      description: `${updatedMember.name}'s information has been updated.`,
    })
  }

  const deleteMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    setMembers((prev) => prev.filter((member) => member.id !== memberId))
    toast({
      title: "Member removed",
      description: member ? `${member.name} has been removed from the team.` : "Member has been removed.",
      variant: "destructive",
    })
  }

  const addCategory = (category: EventCategory) => {
    setCategories((prev) => [...prev, category])
    toast({
      title: "Category created",
      description: `"${category.name}" category has been added.`,
    })
  }

  const updateCategory = (updatedCategory: EventCategory) => {
    setCategories((prev) => prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
    toast({
      title: "Category updated",
      description: `"${updatedCategory.name}" category has been updated.`,
    })
  }

  const deleteCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
    // Remove category from events
    setEvents((prev) =>
      prev.map((event) => ({ ...event, category: event.category === categoryId ? undefined : event.category })),
    )
    toast({
      title: "Category deleted",
      description: category ? `"${category.name}" category has been removed.` : "Category has been deleted.",
      variant: "destructive",
    })
  }

  const exportCalendar = (format: "ics" | "csv" | "json") => {
    const filteredEvents =
      selectedCategories.length > 0
        ? events.filter((event) => event.category && selectedCategories.includes(event.category))
        : events

    let content = ""
    let filename = ""
    let mimeType = ""

    switch (format) {
      case "ics":
        content = generateICS(filteredEvents)
        filename = "calendar.ics"
        mimeType = "text/calendar"
        break
      case "csv":
        content = generateCSV(filteredEvents)
        filename = "calendar.csv"
        mimeType = "text/csv"
        break
      case "json":
        content = JSON.stringify(filteredEvents, null, 2)
        filename = "calendar.json"
        mimeType = "application/json"
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Calendar exported",
      description: `Calendar has been exported as ${format.toUpperCase()}.`,
    })
  }

  const generateICS = (events: Event[]) => {
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CALENDAR//EN\n"

    events.forEach((event) => {
      ics += "BEGIN:VEVENT\n"
      ics += `UID:${event.id}\n`
      ics += `DTSTART:${event.startTime.replace(/[-:]/g, "").replace("T", "")}00Z\n`
      ics += `DTEND:${event.endTime.replace(/[-:]/g, "").replace("T", "")}00Z\n`
      ics += `SUMMARY:${event.title}\n`
      if (event.description) ics += `DESCRIPTION:${event.description}\n`
      if (event.location) ics += `LOCATION:${event.location}\n`
      ics += "END:VEVENT\n"
    })

    ics += "END:VCALENDAR"
    return ics
  }

  const generateCSV = (events: Event[]) => {
    const headers = "Title,Description,Start Time,End Time,Category,Location\n"
    const rows = events
      .map(
        (event) =>
          `"${event.title}","${event.description || ""}","${event.startTime}","${event.endTime}","${event.category || ""}","${event.location || ""}"`,
      )
      .join("\n")
    return headers + rows
  }

  return (
    <AppContext.Provider
      value={{
        events,
        members,
        documents,
        categories,
        currentView,
        selectedCategories,
        addEvent,
        updateEvent,
        deleteEvent,
        addMember,
        updateMember,
        deleteMember,
        addCategory,
        updateCategory,
        deleteCategory,
        setCurrentView,
        setSelectedCategories,
        exportCalendar,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
