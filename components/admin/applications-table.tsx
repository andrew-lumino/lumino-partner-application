"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react" // Added useRef here
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Download,
  FileText,
  Search,
  ExternalLink,
  Trash2,
  RotateCcw,
  Info,
  Star,
  ClipboardCopy,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScheduleADisplay from "./schedule-a-display"
import ApplicationDetails from "./application-details"
import ApplicationFiles from "./application-files"
import Actions from "./actions"
import { formatDateTime } from "../utils"

type Application = Record<string, any>

// Move SEARCH_PREFIXES outside component to avoid hoisting issues
const SEARCH_PREFIXES = [
  { prefix: "name:", description: "Partner Full Name" },
  { prefix: "partner_name:", description: "Partner Full Name (alias)" },
  { prefix: "email:", description: "Partner Email" },
  { prefix: "partner_email:", description: "Partner Email (alias)" },
  { prefix: "phone:", description: "Partner Phone" },
  { prefix: "partner_phone:", description: "Partner Phone (alias)" },
  { prefix: "business:", description: "Business Name" },
  { prefix: "business_name:", description: "Business Name (alias)" },
  { prefix: "business_type:", description: "Business Type (LLC, Corp, etc.)" },
  { prefix: "principal:", description: "Principal Name" },
  { prefix: "principal_name:", description: "Principal Name (alias)" },
  { prefix: "address:", description: "Any address (Partner, Business, W9)" },
  { prefix: "city:", description: "Any city (Partner or Business)" },
  { prefix: "state:", description: "Any state (Partner or Business)" },
  { prefix: "zip:", description: "Any ZIP code (Partner or Business)" },
  { prefix: "status:", description: "Application status" },
  { prefix: "agent:", description: "Account Manager/Agent name" },
  { prefix: "id:", description: "Application UUID" },
  { prefix: "federal_tax_id:", description: "Federal Tax ID" },
  { prefix: "tax_id:", description: "Federal Tax ID (alias)" },
  { prefix: "website:", description: "Website URL" },
  { prefix: "website_url:", description: "Website URL (alias)" },
  { prefix: "w9_name:", description: "W9 Form Name" },
  { prefix: "w9_business:", description: "W9 Business Name" },
  { prefix: "w9_business_name:", description: "W9 Business Name (alias)" },
  { prefix: "w9_classification:", description: "W9 Tax Classification" },
  { prefix: "tax_classification:", description: "W9 Tax Classification (alias)" },
  { prefix: "w9_tin:", description: "W9 TIN Number" },
  { prefix: "tin:", description: "W9 TIN Number (alias)" },
  { prefix: "signature_name:", description: "Signature Full Name" },
  { prefix: "bank_account:", description: "Bank Account Number" },
  { prefix: "account_number:", description: "Bank Account Number (alias)" },
  { prefix: "routing:", description: "Bank Routing Number" },
  { prefix: "routing_number:", description: "Bank Routing Number (alias)" },
  { prefix: "dob:", description: "Date of Birth (YYYY-MM-DD, >date, <date)" },
  { prefix: "date_of_birth:", description: "Date of Birth (alias)" },
  { prefix: "created:", description: "Application date (today, last7days, >date)" },
  { prefix: "submitted:", description: "Application date (alias)" },
  { prefix: "signature_date:", description: "Signature Date" },
  { prefix: "conduct_date:", description: "Code of Conduct Date" },
  { prefix: "custom:", description: "Custom Schedule A (true/false or search content)" },
  { prefix: "schedule_a:", description: "Custom Schedule A (alias)" },
  {
    prefix: "has:",
    description:
      "Has field (custom_schedule, drivers_license, voided_check, w9, signature, bank_info, dob, principal, website)",
  },
  {
    prefix: "missing:",
    description:
      "Missing field (name, email, phone, business, principal, address, tax_id, website, agent, signature, drivers_license, voided_check, bank_info, w9, custom_schedule)",
  },
]

// Helper function for date queries - move outside component
// Also update the evaluateDateQuery function to be more robust
function evaluateDateQuery(dateValue: any, query: string): boolean {
  // Add safety checks to prevent crashes
  if (!dateValue || !query) return false

  try {
    const date = new Date(dateValue)

    // Check if date is valid
    if (isNaN(date.getTime())) return false

    const today = new Date()
    const queryLower = query.toLowerCase().trim()

    // Handle relative dates
    if (queryLower === "today") {
      return date.toISOString().split("T")[0] === today.toISOString().split("T")[0]
    }

    if (queryLower === "yesterday") {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return date.toISOString().split("T")[0] === yesterday.toISOString().split("T")[0]
    }

    if (queryLower.includes("last") && queryLower.includes("days")) {
      const days = Number.parseInt(queryLower.match(/\d+/)?.[0] || "0")
      if (isNaN(days)) return false

      const cutoff = new Date(today)
      cutoff.setDate(cutoff.getDate() - days)
      return date >= cutoff
    }

    // Handle comparison operators
    if (query.startsWith(">")) {
      const compareDate = new Date(query.substring(1))
      if (isNaN(compareDate.getTime())) return false
      return date > compareDate
    }

    if (query.startsWith("<")) {
      const compareDate = new Date(query.substring(1))
      if (isNaN(compareDate.getTime())) return false
      return date < compareDate
    }

    if (query.startsWith(">=")) {
      const compareDate = new Date(query.substring(2))
      if (isNaN(compareDate.getTime())) return false
      return date >= compareDate
    }

    if (query.startsWith("<=")) {
      const compareDate = new Date(query.substring(2))
      if (isNaN(compareDate.getTime())) return false
      return date <= compareDate
    }

    // Exact date match
    const queryDate = new Date(query)
    if (isNaN(queryDate.getTime())) return false
    return date.toISOString().split("T")[0] === queryDate.toISOString().split("T")[0]
  } catch (error) {
    // If any error occurs, just return false instead of crashing
    return false
  }
}

export default function ApplicationsTable({ applications: initialApplications }: { applications: Application[] }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [appToDelete, setAppToDelete] = useState<Application | null>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState(SEARCH_PREFIXES)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const ITEMS_PER_PAGE = 20

  // Initialize with first page of data
  useEffect(() => {
    setApplications(initialApplications.slice(0, ITEMS_PER_PAGE))
    setHasMore(initialApplications.length > ITEMS_PER_PAGE)
  }, [initialApplications])

  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    const lastChar = value.slice(-1)
    const lastWord = value.split(" ").pop() || ""

    if (lastChar === "/" || lastWord.startsWith("/")) {
      const query = lastWord.startsWith("/") ? lastWord.substring(1) : ""
      setSuggestions(SEARCH_PREFIXES.filter((p) => p.prefix.toLowerCase().includes(query.toLowerCase())))
      setShowSuggestions(true)
      setActiveSuggestionIndex(0)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        if (suggestions[activeSuggestionIndex]) {
          handleSelectSuggestion(suggestions[activeSuggestionIndex].prefix)
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false)
      }
    }
  }

  const handleSelectSuggestion = (prefix: string) => {
    const terms = searchTerm.split(" ")
    terms.pop() // remove the current term being typed
    terms.push(prefix)
    setSearchTerm(terms.join(" "))
    setShowSuggestions(false)
  }

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const safeStringConversion = (value: any): string => {
    if (value === null || value === undefined) return ""
    if (typeof value === "string") return value
    if (typeof value === "number") return String(value)
    if (typeof value === "boolean") return String(value)
    if (typeof value === "object") {
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }
    return String(value)
  }

  // Replace your entire filteredApplications logic with this safe version:
  const filteredApplications = applications.filter((app) => {
    const query = searchTerm.toLowerCase().trim()
    if (!query) return true

    // Date range filter from dedicated inputs
    const appDate = new Date(app.created_at).toISOString().split("T")[0]
    if (startDate && appDate < startDate) return false
    if (endDate && appDate > endDate) return false

    const tokens = query.match(/(?:[^\s"]+|"[^"]*")+/g) || []

    return tokens.every((token) => {
      let isNegated = false
      if (token.startsWith("!")) {
        isNegated = true
        token = token.substring(1)
      }

      const match = token.match(/^([\w_]+):(.*)/)
      let result = false

      if (match) {
        const key = match[1]
        const value = match[2].replace(/"/g, "")

        if (!key || value === undefined) {
          return true
        }

        switch (key) {
          case "name":
          case "partner_name":
            result = safeStringConversion(app.partner_full_name).toLowerCase().includes(value)
            break

          case "email":
          case "partner_email":
            result = safeStringConversion(app.partner_email).toLowerCase().includes(value)
            break

          case "phone":
          case "partner_phone":
            result = safeStringConversion(app.partner_phone).toLowerCase().includes(value)
            break

          case "business":
          case "business_name":
            result = safeStringConversion(app.business_name).toLowerCase().includes(value)
            break

          case "business_type":
            result = safeStringConversion(app.business_type).toLowerCase().includes(value)
            break

          case "principal":
          case "principal_name":
            result = safeStringConversion(app.principal_name).toLowerCase().includes(value)
            break

          case "address":
            const addressFields = [
              safeStringConversion(app.partner_address),
              safeStringConversion(app.business_address),
              safeStringConversion(app.w9_address),
              `${safeStringConversion(app.partner_city)} ${safeStringConversion(app.partner_state)}`,
              `${safeStringConversion(app.business_city)} ${safeStringConversion(app.business_state)}`,
            ]
            result = addressFields.some((field) => field.toLowerCase().includes(value))
            break

          case "city":
            result = [safeStringConversion(app.partner_city), safeStringConversion(app.business_city)].some((city) =>
              city.toLowerCase().includes(value),
            )
            break

          case "state":
            result = [safeStringConversion(app.partner_state), safeStringConversion(app.business_state)].some((state) =>
              state.toLowerCase().includes(value),
            )
            break

          case "zip":
            result = [safeStringConversion(app.partner_zip), safeStringConversion(app.business_zip)].some((zip) =>
              zip.toLowerCase().includes(value),
            )
            break

          case "status":
            result = safeStringConversion(app.status).toLowerCase().includes(value)
            break

          case "agent":
            result = safeStringConversion(app.agent || "direct")
              .toLowerCase()
              .includes(value)
            break

          case "id":
            result = safeStringConversion(app.id).toLowerCase() === value
            break

          case "federal_tax_id":
          case "tax_id":
            result = safeStringConversion(app.federal_tax_id).toLowerCase().includes(value)
            break

          case "website":
          case "website_url":
            result = safeStringConversion(app.website_url).toLowerCase().includes(value)
            break

          case "w9_name":
            result = safeStringConversion(app.w9_name).toLowerCase().includes(value)
            break

          case "w9_business":
          case "w9_business_name":
            result = safeStringConversion(app.w9_business_name).toLowerCase().includes(value)
            break

          case "w9_classification":
          case "tax_classification":
            result = safeStringConversion(app.w9_tax_classification).toLowerCase().includes(value)
            break

          case "w9_tin":
          case "tin":
            result = safeStringConversion(app.w9_tin).toLowerCase().includes(value)
            break

          case "signature_name":
            result = safeStringConversion(app.signature_full_name).toLowerCase().includes(value)
            break

          case "bank_account":
          case "account_number":
            result = safeStringConversion(app.bank_account_number).includes(value)
            break

          case "routing":
          case "routing_number":
            result = safeStringConversion(app.bank_routing_number).toLowerCase().includes(value)
            break

          case "dob":
          case "date_of_birth":
            try {
              result = evaluateDateQuery(app.date_of_birth, value)
            } catch (error) {
              result = false
            }
            break

          case "created":
          case "submitted":
            try {
              result = evaluateDateQuery(app.created_at, value)
            } catch (error) {
              result = false
            }
            break

          case "signature_date":
            try {
              result = evaluateDateQuery(app.signature_date, value)
            } catch (error) {
              result = false
            }
            break

          case "conduct_date":
            try {
              result = evaluateDateQuery(app.code_of_conduct_date, value)
            } catch (error) {
              result = false
            }
            break

          case "has":
            if (!value) {
              result = true
              break
            }

            switch (value) {
              case "custom_schedule":
                result = !!app.custom_schedule_a
                break
              case "drivers_license":
                result = !!app.drivers_license_url
                break
              case "voided_check":
                result = !!app.voided_check_url
                break
              case "w9":
                result = !!(app.w9_name || app.w9_tin)
                break
              case "signature":
                result = !!app.code_of_conduct_signature
                break
              case "bank_info":
                result = !!(app.bank_account_number && app.bank_routing_number)
                break
              case "dob":
                result = !!app.date_of_birth
                break
              case "principal":
                result = !!app.principal_name
                break
              case "website":
                result = !!app.website_url
                break
              default:
                result = false
            }
            break

          case "missing":
            if (!value) {
              result = true
              break
            }

            const fieldMappings: Record<string, string> = {
              name: "partner_full_name",
              email: "partner_email",
              phone: "partner_phone",
              business: "business_name",
              principal: "principal_name",
              address: "partner_address",
              city: "partner_city",
              state: "partner_state",
              zip: "partner_zip",
              tax_id: "federal_tax_id",
              website: "website_url",
              agent: "agent",
              signature: "code_of_conduct_signature",
              drivers_license: "drivers_license_url",
              voided_check: "voided_check_url",
              bank_account: "bank_account_number",
              routing: "bank_routing_number",
              dob: "date_of_birth",
              w9_name: "w9_name",
              w9_tin: "w9_tin",
            }

            const field = fieldMappings[value] || value

            if (value === "custom_schedule") {
              result = !app.custom_schedule_a
            } else if (value === "agent") {
              result = !app.agent || app.agent === "direct"
            } else if (value === "bank_info") {
              result = !(app.bank_account_number && app.bank_routing_number)
            } else if (value === "w9") {
              result = !(app.w9_name || app.w9_tin)
            } else {
              const fieldValue = (app as Record<string, unknown>)[field]
              result = !fieldValue
            }
            break

          case "custom":
          case "schedule_a":
            if (!value) {
              result = true
              break
            }

            if (value === "true" || value === "yes" || value === "1") {
              result = !!app.custom_schedule_a
            } else if (value === "false" || value === "no" || value === "0") {
              result = !app.custom_schedule_a
            } else {
              // Search within custom schedule a content - SAFE VERSION
              try {
                const customScheduleText = safeStringConversion(app.custom_schedule_a)
                result = customScheduleText.toLowerCase().includes(value)
              } catch (error) {
                result = false
              }
            }
            break

          default:
            result = false
        }
      } else {
        // General search - safe string conversion
        const generalValue = token.replace(/"/g, "")
        if (!generalValue) return true

        const searchFields = [
          safeStringConversion(app.partner_full_name),
          safeStringConversion(app.partner_email),
          safeStringConversion(app.business_name),
          safeStringConversion(app.principal_name),
          safeStringConversion(app.agent || "direct"),
          safeStringConversion(app.status),
          safeStringConversion(app.business_type),
          safeStringConversion(app.partner_city),
          safeStringConversion(app.partner_state),
          safeStringConversion(app.business_city),
          safeStringConversion(app.business_state),
        ]

        result = searchFields.some((field) => field.toLowerCase().includes(generalValue))
      }

      return isNegated ? !result : result
    })
  })

  // Rest of your component code stays the same...
  const loadMoreApplications = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const res = await fetch(`/api/applications?page=${page + 1}&limit=${ITEMS_PER_PAGE}`)
      const data = await res.json()

      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false)
      }

      setApplications((prev) => [...prev, ...data])
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error("Error loading more applications:", error)
    } finally {
      setLoadingMore(false)
    }
  }, [page, loadingMore, hasMore])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreApplications()
        }
      },
      { threshold: 1.0 },
    )

    const sentinel = document.getElementById("scroll-sentinel")
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel)
      }
    }
  }, [loadMoreApplications, hasMore, loadingMore])

  const sanitize = (str: string) => str.replace(/[/\\?%*:|"<>]/g, "-")

  const getFileExtension = (url: string) => {
    const match = url.match(/\.\w+$/)
    return match ? match[0] : ""
  }

  const exportToCsv = () => {
    if (filteredApplications.length === 0) return

    const headers = Object.keys(filteredApplications[0])
    const csvRows = [
      headers.join(","),
      ...filteredApplications.map((row) =>
        headers
          .map((fieldName) => {
            const value = row[fieldName]
            const escaped = ("" + (value === null || value === undefined ? "" : value)).replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(","),
      ),
    ]

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "lumino-partner-applications.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderValue = (value: any) => {
    if (typeof value === "string" && value.startsWith("https://")) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          View File <ExternalLink className="h-3 w-3" />
        </a>
      )
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"
    }
    if (typeof value === "object" && value !== null) {
      return <span className="italic text-blue-600">Custom Schedule A Applied</span>
    }
    return value || "-"
  }

  const deleteApplication = async (id: string) => {
    try {
      const res = await fetch(`/api/delete-application`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error("Failed to delete")

      // Remove from local state instead of full reload
      setApplications((prev) => prev.filter((app) => app.id !== id))
    } catch (error) {
      console.error("Error deleting application:", error)
      alert("An error occurred while deleting.")
    }
  }

  const refreshApplications = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/applications")
      const data = await res.json()
      setApplications(data.slice(0, ITEMS_PER_PAGE))
      setPage(1)
      setHasMore(data.length > ITEMS_PER_PAGE)
    } catch (error) {
      console.error("Error refreshing applications:", error)
      alert("Failed to refresh applications.")
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  const handleCopyLink = (app: Application) => {
    if (!app.id) return

    const link = `https://partner.golumino.com/?id=${app.id}`
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Invite link copied to clipboard",
        })
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link",
          variant: "destructive",
        })
      })
  }

  const AreYouSure = () => (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-700">
          This will permanently delete the application for <strong>{appToDelete?.partner_full_name}</strong>. This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!appToDelete) return
              await deleteApplication(appToDelete.id)
              setDeleteDialogOpen(false)
              setAppToDelete(null)
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Add status badge helper
  const getStatusBadge = (status: string) => {
    const statusColors = {
      invited: "bg-blue-100 text-blue-800",
      submitted: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
      >
        {status || "Unknown"}
      </span>
    )
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <TooltipProvider>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    placeholder="Search or type / for commands..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    className="pl-10"
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-lg text-sm leading-relaxed">
                  <p>
                    <b>Pro Tip 💡:</b> Use smart search to filter partner applications by any field.
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <code className="bg-slate-700 text-white px-1">john</code> → matches anything with "john"
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">!john</code> → excludes anything with "john"
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">agent:smith</code> → filter by agent/account
                      manager
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">email:test</code> → searches in partner email field
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">status:submitted</code> → filter by application
                      status
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">business_type:llc</code> → filter by business type
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">state:ca</code> → filter by any state (partner or
                      business)
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">missing:email</code> → finds apps missing email
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">has:custom_schedule</code> → has custom schedule A
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">has:drivers_license</code> → has uploaded driver's
                      license
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">has:w9</code> → has W9 information
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">missing:signature</code> → missing code of conduct
                      signature
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">custom:true</code> → has custom schedule A
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">created:today</code> → submitted today
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">created:{">"}2024-01-01</code> → submitted after
                      date
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">dob:{">"}1990-01-01</code> → date of birth after
                      date
                    </li>
                    <li>
                      <code className="bg-slate-700 text-white px-1">missing:bank_info & !test</code> → combine with "&"
                    </li>
                  </ul>
                  <p className="mt-3 text-xs text-gray-500">
                    Type <b>/</b> for quick shortcuts like <b>/name</b>, <b>/email</b>, <b>/status</b>, etc.
                  </p>
                </TooltipContent>
              </Tooltip>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {suggestions.map((s, index) => (
                      <li
                        key={s.prefix}
                        className={`px-3 py-2 cursor-pointer text-sm ${
                          index === activeSuggestionIndex ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleSelectSuggestion(s.prefix)
                        }}
                      >
                        <span className="font-medium">{s.prefix}</span>
                        <span className="text-gray-500 ml-2">{s.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-[150px]"
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-[150px]"
                placeholder="End Date"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent side="bottom">Filter results by creation date range.</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshApplications} disabled={loading}>
                <RotateCcw className={`mr-2 h-4 w-4 ${loading ? "animate-reverse-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={exportToCsv} disabled={filteredApplications.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </TooltipProvider>

        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredApplications.length} of {applications.length} applications
          {hasMore && " (loading more as you scroll)"}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Partner Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Team Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {app.custom_schedule_a && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      {app.partner_full_name || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{app.partner_email || "-"}</TableCell>
                  <TableCell>{app.business_name || "-"}</TableCell>
                  <TableCell>{app.agent?.toUpperCase() || "DIRECT"}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog onOpenChange={(open) => !open && setSelectedApplication(null)}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={() => setSelectedApplication(app)}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem onSelect={() => handleCopyLink(app)}>
                            <ClipboardCopy className="mr-2 h-4 w-4" />
                            Copy Invite Link
                          </DropdownMenuItem>
                          {app.drivers_license_url && (
                            <DropdownMenuItem asChild>
                              <a
                                href={`/api/download?url=${encodeURIComponent(app.drivers_license_url)}&filename=${sanitize(app.partner_full_name || "Unknown")} - Driver's License${getFileExtension(app.drivers_license_url)}`}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download License
                              </a>
                            </DropdownMenuItem>
                          )}
                          {app.voided_check_url && (
                            <DropdownMenuItem asChild>
                              <a
                                href={`/api/download?url=${encodeURIComponent(app.voided_check_url)}&filename=${sanitize(app.partner_full_name || "Unknown")} - Voided Check${getFileExtension(app.voided_check_url)}`}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download Check
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onSelect={() => {
                              setAppToDelete(app)
                              setDeleteDialogOpen(true)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {selectedApplication && (
                        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <DialogHeader className="p-0">
                                <DialogTitle className="text-xl font-semibold">
                                  Application Details: {selectedApplication.partner_full_name || "Unknown"}
                                </DialogTitle>
                              </DialogHeader>

                              <div className="mt-2 sm:mt-0">
                                <Actions selectedApplication={selectedApplication} />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="block">
                                  Submitted on: {formatDateTime(selectedApplication.created_at)}
                                </span>
                                <span className="block">
                                  Team Member:{" "}
                                  {selectedApplication.agent ? selectedApplication.agent.toUpperCase() : "DIRECT"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Tabs defaultValue="details" className="w-full flex-1 flex flex-col min-h-0">
                            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                              <TabsTrigger value="details">Application Details</TabsTrigger>
                              <TabsTrigger value="schedule">Schedule A</TabsTrigger>
                              <TabsTrigger value="files">Files</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="flex-1 overflow-y-auto p-4">
                              <ApplicationDetails selectedApplication={selectedApplication} />
                            </TabsContent>

                            <TabsContent value="schedule" className="flex-1 overflow-y-auto p-4">
                              <ScheduleADisplay application={selectedApplication} />
                            </TabsContent>

                            <TabsContent value="files" className="flex-1 overflow-y-auto p-4 space-y-6">
                              <ApplicationFiles selectedApplication={selectedApplication} />
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div id="scroll-sentinel" className="h-10 flex items-center justify-center">
            {loadingMore && (
              <div className="flex items-center gap-2 text-gray-500">
                <RotateCcw className="h-4 w-4 animate-spin" />
                Loading more applications...
              </div>
            )}
            {!hasMore && applications.length > ITEMS_PER_PAGE && (
              <div className="text-gray-500 text-sm">All applications loaded ({applications.length} total)</div>
            )}
          </div>
        </div>
      </div>
      <AreYouSure />
    </>
  )
}
