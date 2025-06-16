"use client"
import { Download, FileText, Database, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppContext } from "@/contexts/app-context"

export function ExportCalendar() {
  const { exportCalendar, selectedCategories } = useAppContext()

  const exportOptions = [
    {
      format: "ics" as const,
      label: "iCalendar (.ics)",
      description: "Import into other calendar apps",
      icon: FileText,
    },
    {
      format: "csv" as const,
      label: "CSV (.csv)",
      description: "Open in spreadsheet apps",
      icon: Database,
    },
    {
      format: "json" as const,
      label: "JSON (.json)",
      description: "For developers and data analysis",
      icon: Code,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {exportOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => exportCalendar(option.format)}
              className="flex items-start gap-3 p-3"
            >
              <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
                {selectedCategories.length > 0 && (
                  <div className="text-xs text-blue-600 mt-1">Filtered by {selectedCategories.length} categories</div>
                )}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
