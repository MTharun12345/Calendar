"use client"

import { format, parseISO } from "date-fns"
import { CalendarDays, Clock, Edit, Trash, FileText, MapPin, Users, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { EventModal } from "./event-modal"
import { EmailNotifications } from "./email-notifications"
import { useAppContext } from "@/contexts/app-context"
import type { Event } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event
}

export function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const { deleteEvent, categories } = useAppContext()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

  const handleDelete = () => {
    deleteEvent(event.id)
    setIsDeleteDialogOpen(false)
    onClose()
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
    onClose()
  }

  const getColorDisplay = (color?: string) => {
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      yellow: "bg-yellow-500",
    }
    return colorMap[color as keyof typeof colorMap] || "bg-primary"
  }

  const category = event.category ? categories.find((c) => c.id === event.category) : null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${getColorDisplay(event.color)}`} />
              {event.title}
              {category && (
                <Badge variant="outline" className="ml-2">
                  {category.name}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {format(parseISO(event.startTime), "h:mm a")} - {format(parseISO(event.endTime), "h:mm a")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>
                {event.recurring === "weekly"
                  ? "Weekly on " + event.daysOfWeek?.map((day) => day.slice(0, 3)).join(", ")
                  : event.recurring === "monthly"
                    ? "Monthly on " + format(parseISO(event.date), "do")
                    : format(parseISO(event.date), "MMMM d, yyyy")}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}

            {event.description && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 mt-0.5" />
                <p className="text-sm">{event.description}</p>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Attendees ({event.attendees.length})</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {event.attendees.map((attendee) => (
                    <Badge key={attendee} variant="secondary" className="text-xs">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {event.recurring === "weekly" && event.daysOfWeek && (
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Recurring Days</h4>
                <div className="flex flex-wrap gap-2">
                  {event.daysOfWeek.map((day) => (
                    <Badge key={day} variant="outline" className="capitalize">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={() => setIsEmailModalOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reminders
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{event.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isEditModalOpen && (
        <EventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          selectedDate={parseISO(event.date)}
          event={event}
        />
      )}

      {isEmailModalOpen && (
        <EmailNotifications isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} event={event} />
      )}
    </>
  )
}
