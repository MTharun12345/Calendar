import { v4 as uuidv4 } from "uuid"
import type { Event } from "./types"

export const events: Event[] = [
  {
    id: uuidv4(),
    title: "Team Meeting",
    date: "2025-06-13",
    startTime: "2025-06-13T10:00:00",
    endTime: "2025-06-13T11:30:00",
    color: "blue",
    participants: {
      current: 8,
      total: 10,
    },
  },
  {
    id: uuidv4(),
    title: "Project Review",
    date: "2025-06-13",
    startTime: "2025-06-13T14:00:00",
    endTime: "2025-06-13T15:00:00",
    color: "green",
    participants: {
      current: 5,
      total: 6,
    },
  },
  {
    id: uuidv4(),
    title: "Client Call",
    date: "2025-06-15",
    startTime: "2025-06-15T11:00:00",
    endTime: "2025-06-15T12:00:00",
    color: "purple",
    participants: {
      current: 3,
      total: 4,
    },
  },
  {
    id: uuidv4(),
    title: "Little Tigers Karate",
    recurring: "weekly",
    date: "2025-06-10",
    startTime: "2025-06-10T16:00:00",
    endTime: "2025-06-10T17:30:00",
    color: "red",
    daysOfWeek: ["monday", "wednesday", "friday"],
    participants: {
      current: 25,
      total: 30,
    },
  },
  {
    id: uuidv4(),
    title: "Yoga Class",
    recurring: "weekly",
    date: "2025-06-11",
    startTime: "2025-06-11T08:00:00",
    endTime: "2025-06-11T09:00:00",
    color: "yellow",
    daysOfWeek: ["tuesday", "thursday"],
    participants: {
      current: 12,
      total: 15,
    },
  },
]
