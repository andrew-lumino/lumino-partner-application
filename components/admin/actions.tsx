"use client"

import { Button } from "@/components/ui/button"
import { CloudLightning } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, FolderDown, FileDown, FileText } from "lucide-react"
import { generateCompleteAgreementPDF } from "./generate-agreement-pdf"

interface ActionsProps {
  selectedApplication: Record<string, any>
}

export default function Actions({ selectedApplication }: ActionsProps) {
  const getFileExtension = (url: string) => {
    const match = url.match(/\.\w+$/)
    return match ? match[0] : ""
  }

  const sanitize = (str: string) => str.replace(/[/\\?%*:|"<>]/g, "-")

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = `/api/download?url=${encodeURIComponent(url)}&filename=${filename}`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleDownloadCompleteAgreement = async () => {
    try {
      await generateCompleteAgreementPDF(selectedApplication)
    } catch (error) {
      console.error("Error generating complete agreement:", error)
      alert("Failed to generate agreement PDF. Please try again.")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <CloudLightning className="h-4 w-4 mr-2" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <a href={`mailto:${selectedApplication?.partner_email}`} target="_blank" rel="noopener noreferrer">
            <Mail className="mr-2 h-4 w-4" />
            Contact Partner
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleDownloadCompleteAgreement}>
          <FileText className="mr-2 h-4 w-4" />
          Download Complete Agreement
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            const app = selectedApplication
            if (!app) return

            const headers = Object.keys(app).filter(
              (key) =>
                ![
                  "w9_fatca_code",
                  "w9_llc_classification",
                  "w9_other_classification",
                  "w9_exempt_payee_code",
                  "w9_t_i_n_type",
                  "w9_t_i_n",
                  "agent",
                  "status",
                  "custom_schedule_a",
                  "custom_message",
                ].includes(key),
            )
            const csvRow = headers.map((key) => {
              const val = app[key]
              return `"${String(val ?? "").replace(/"/g, '""')}"`
            })

            const blob = new Blob([headers.join(",") + "\n" + csvRow.join(",")], {
              type: "text/csv;charset=utf-8;",
            })

            const a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = `${sanitize(app.partner_full_name || "Unknown")} - Application.csv`
            a.click()
          }}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download Application CSV
        </DropdownMenuItem>

        {selectedApplication?.drivers_license_url && selectedApplication?.voided_check_url && (
          <DropdownMenuItem
            onSelect={() => {
              const ext1 = getFileExtension(selectedApplication.drivers_license_url)
              const ext2 = getFileExtension(selectedApplication.voided_check_url)

              downloadFile(
                selectedApplication.drivers_license_url,
                `${sanitize(selectedApplication.partner_full_name || "Unknown Partner")} - Driver's License${ext1}`,
              )
              downloadFile(
                selectedApplication.voided_check_url,
                `${sanitize(selectedApplication.partner_full_name || "Unknown Partner")} - Voided Check${ext2}`,
              )
            }}
          >
            <FolderDown className="mr-2 h-4 w-4" />
            Download Submitted Files
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
