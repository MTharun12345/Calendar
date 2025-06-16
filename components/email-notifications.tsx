"use client"

import { useState } from "react"
import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppContext } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import type { Event } from "@/lib/types"

interface EmailNotificationsProps {
  isOpen: boolean
  onClose: () => void
  event: Event
}

export function EmailNotifications({ isOpen, onClose, event }: EmailNotificationsProps) {
  const { members } = useAppContext()
  const { toast } = useToast()
  const [subject, setSubject] = useState(`Reminder: ${event.title}`)
  const [message, setMessage] = useState(`You have an upcoming event: ${event.title}`)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [reminderTime, setReminderTime] = useState("15")

  const handleMemberToggle = (memberEmail: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberEmail) ? prev.filter((email) => email !== memberEmail) : [...prev, memberEmail],
    )
  }

  const handleSendReminders = () => {
    // Simulate sending email reminders
    const recipients = selectedMembers.length > 0 ? selectedMembers : event.attendees || []

    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please select members or add attendees to the event.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would integrate with an email service
    console.log("Sending email reminders:", {
      subject,
      message,
      recipients,
      reminderTime,
      event: event.id,
    })

    toast({
      title: "Reminders sent",
      description: `Email reminders sent to ${recipients.length} recipients.`,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email Reminders
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Email message"
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reminder-time">Send reminder</Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger id="reminder-time">
                <SelectValue placeholder="Select reminder time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">At event time</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Recipients</Label>

            {event.attendees && event.attendees.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Event Attendees ({event.attendees.length})</Label>
                <div className="text-sm bg-muted/50 p-2 rounded">{event.attendees.join(", ")}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Additional Team Members</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.email)}
                      onCheckedChange={() => handleMemberToggle(member.email)}
                    />
                    <Label htmlFor={member.id} className="flex items-center gap-2 cursor-pointer">
                      <span>{member.name}</span>
                      <span className="text-xs text-muted-foreground">({member.email})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendReminders}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Reminders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
