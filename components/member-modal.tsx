"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppContext } from "@/contexts/app-context"
import type { Member } from "@/lib/types"

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
  member?: Member | null
}

export function MemberModal({ isOpen, onClose, member }: MemberModalProps) {
  const { addMember, updateMember } = useAppContext()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"Admin" | "Manager" | "Member">("Member")

  useEffect(() => {
    if (member) {
      setName(member.name)
      setEmail(member.email)
      setPhone(member.phone)
      setRole(member.role)
    } else {
      resetForm()
    }
  }, [member, isOpen])

  const resetForm = () => {
    setName("")
    setEmail("")
    setPhone("")
    setRole("Member")
  }

  const handleSubmit = () => {
    if (!name || !email) return

    const memberData: Member = {
      id: member?.id || uuidv4(),
      name,
      email,
      phone,
      role,
      avatar: "/placeholder.svg?height=40&width=40",
      joinedDate: member?.joinedDate || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    }

    if (member) {
      updateMember(memberData)
    } else {
      addMember(memberData)
    }

    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: "Admin" | "Manager" | "Member") => setRole(value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
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
            {member ? "Update Member" : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
