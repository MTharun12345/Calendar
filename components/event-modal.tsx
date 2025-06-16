"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useAppContext } from "@/contexts/app-context"
import type { Event } from "@/lib/types"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  event?: Event | null
}

export function EventModal({ isOpen, onClose, selectedDate, event }: EventModalProps) {
  const { addEvent, updateEvent, categories, members } = useAppContext()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [color, setColor] = useState("blue")
  const [category, setCategory] = useState("none")
  const [recurring, setRecurring] = useState<"none" | "weekly" | "monthly">("none")
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([])
  const [attendees, setAttendees] = useState<string[]>([])
  const [newAttendee, setNewAttendee] = useState("")

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || "")
      setLocation(event.location || "")
      setStartTime(format(new Date(event.startTime), "HH:mm"))
      setEndTime(format(new Date(event.endTime), "HH:mm"))
      setColor(event.color || "blue")
      setCategory(event.category || "none")
      setRecurring(event.recurring || "none")
      setDaysOfWeek(event.daysOfWeek || [])
      setAttendees(event.attendees || [])
    } else {
      resetForm()
    }
  }, [event, isOpen])

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setLocation("")
    setStartTime("09:00")
    setEndTime("10:00")
    setColor("blue")
    setCategory("none")
    setRecurring("none")
    setDaysOfWeek([])
    setAttendees([])
    setNewAttendee("")
  }

  const handleSubmit = () => {
    if (!title || !startTime || !endTime || !selectedDate) return

    const formattedDate = format(selectedDate, "yyyy-MM-dd")
    const startDateTime = `${formattedDate}T${startTime}:00`
    const endDateTime = `${formattedDate}T${endTime}:00`

    const eventData: Event = {
      id: event?.id || uuidv4(),
      title,
      description,
      location,
      date: formattedDate,
      startTime: startDateTime,
      endTime: endDateTime,
      color,
      category: category === "none" ? undefined : category,
      recurring: recurring === "none" ? undefined : recurring,
      daysOfWeek: recurring === "weekly" ? daysOfWeek : undefined,
      attendees: attendees.length > 0 ? attendees : undefined,
    }

    if (event) {
      updateEvent(eventData)
    } else {
      addEvent(eventData)
    }

    resetForm()
    onClose()
  }

  const handleDayToggle = (day: string) => {
    setDaysOfWeek((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]))
  }

  const addAttendee = () => {
    if (newAttendee && !attendees.includes(newAttendee)) {
      setAttendees([...attendees, newAttendee])
      setNewAttendee("")
    }
  }

  const removeAttendee = (attendee: string) => {
    setAttendees(attendees.filter((a) => a !== attendee))
  }

  const addMemberAsAttendee = (memberEmail: string) => {
    if (!attendees.includes(memberEmail)) {
      setAttendees([...attendees, memberEmail])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? "Edit Event" : "Add New Event"}
            {selectedDate && (
              <span className="block text-sm font-normal text-muted-foreground mt-1">
                {format(selectedDate, "MMMM d, yyyy")}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description (optional)"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      Blue
                    </div>
                  </SelectItem>
                  <SelectItem value="green">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      Green
                    </div>
                  </SelectItem>
                  <SelectItem value="red">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      Red
                    </div>
                  </SelectItem>
                  <SelectItem value="purple">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                      Purple
                    </div>
                  </SelectItem>
                  <SelectItem value="yellow">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500" />
                      Yellow
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recurring">Recurring</Label>
            <Select value={recurring} onValueChange={(value: "none" | "weekly" | "monthly") => setRecurring(value)}>
              <SelectTrigger id="recurring">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">One-time</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recurring === "weekly" && (
            <div className="grid gap-2">
              <Label>Repeat on days</Label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={daysOfWeek.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={day} className="capitalize text-sm">
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Attendees</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder="Enter email address"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
                />
                <Button type="button" onClick={addAttendee} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {members.length > 0 && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Quick add team members:</Label>
                  <div className="flex flex-wrap gap-1">
                    {members.map((member) => (
                      <Button
                        key={member.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addMemberAsAttendee(member.email)}
                        disabled={attendees.includes(member.email)}
                        className="text-xs"
                      >
                        {member.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {attendees.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {attendees.map((attendee) => (
                    <Badge key={attendee} variant="secondary" className="flex items-center gap-1">
                      {attendee}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAttendee(attendee)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {event ? "Update Event" : "Add Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
