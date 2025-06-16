"use client"

import { useState, useEffect } from "react"
import { format, isToday } from "date-fns"
import { Calendar, Users, FileText, Plus, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/contexts/app-context"
import { EventModal } from "@/components/event-modal"

export function HomePage() {
  const { events, members, documents } = useAppContext()
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [todayEvents, setTodayEvents] = useState<any[]>([])

  useEffect(() => {
    const today = new Date()
    const todaysEvents = events.filter((event) => isToday(new Date(event.date)))
    setTodayEvents(todaysEvents)
  }, [events])

  const stats = [
    {
      title: "Total Events",
      value: events.length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Team Members",
      value: members.length,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Documents",
      value: documents.length,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "This Month",
      value: events.filter((event) => {
        const eventDate = new Date(event.date)
        const now = new Date()
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
      }).length,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening today, {format(new Date(), "MMMM d, yyyy")}
          </p>
        </div>
        <Button
          onClick={() => setIsEventModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Quick Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Today's Events
            </CardTitle>
            <CardDescription>
              {todayEvents.length === 0 ? "No events scheduled for today" : `${todayEvents.length} events scheduled`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events today. Enjoy your free time!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                      ${event.color === "blue" ? "border-blue-500 text-blue-700" : ""}
                      ${event.color === "green" ? "border-green-500 text-green-700" : ""}
                      ${event.color === "red" ? "border-red-500 text-red-700" : ""}
                      ${event.color === "purple" ? "border-purple-500 text-purple-700" : ""}
                    `}
                    >
                      {event.color}
                    </Badge>
                  </div>
                ))}
                {todayEvents.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">+{todayEvents.length - 3} more events</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest changes and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New member added</p>
                  <p className="text-xs text-muted-foreground">Sarah Johnson joined the team</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Document uploaded</p>
                  <p className="text-xs text-muted-foreground">Project proposal.pdf was added</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Event updated</p>
                  <p className="text-xs text-muted-foreground">Team meeting time changed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isEventModalOpen && (
        <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} selectedDate={new Date()} />
      )}
    </div>
  )
}
