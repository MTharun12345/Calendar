"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Users, FileText, Settings, Home, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "events", label: "Events", icon: Calendar, href: "/events" },
    { id: "members", label: "Members", icon: Users, href: "/members" },
    { id: "documents", label: "Documents", icon: FileText, href: "/documents" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-blue-600 to-purple-700 text-white transition-all duration-300 relative flex flex-col",
        open ? "w-64" : "w-16",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-background text-foreground border shadow-md hover:bg-muted md:flex hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </Button>

      <div className="p-4 flex items-center border-b border-white/20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          {open && (
            <h1 className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              CALENDAR
            </h1>
          )}
        </div>
      </div>

      <nav className="mt-6 flex-1">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-white hover:bg-white/20 transition-all duration-200",
                            isActive && "bg-white/20 shadow-lg",
                            !open && "justify-center px-2",
                          )}
                        >
                          <item.icon className={cn("h-5 w-5", open && "mr-3")} />
                          {open && <span className="font-medium">{item.label}</span>}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {!open && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </TooltipProvider>
      </nav>

      <div className="p-4 mt-auto border-t border-white/20">
        <div className={cn("flex items-center", !open && "justify-center")}>
          <Avatar className="h-10 w-10 ring-2 ring-white/30">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
            <AvatarFallback className="bg-white text-blue-600 font-semibold">JD</AvatarFallback>
          </Avatar>
          {open && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold truncate">John Doe</p>
              <p className="text-xs text-white/70 truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
