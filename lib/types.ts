export interface Event {
  id: string
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  color?: string
  recurring?: "weekly" | "monthly"
  daysOfWeek?: string[]
  category?: string
  location?: string
  attendees?: string[]
}

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  role: "Admin" | "Manager" | "Member"
  avatar: string
  joinedDate: string
}

export interface Document {
  id: string
  name: string
  type: string
  size: string
  owner: string
  modifiedDate: string
}

export interface EventCategory {
  id: string
  name: string
  color: string
  description?: string
}

export type CalendarView = "month" | "week" | "day"
