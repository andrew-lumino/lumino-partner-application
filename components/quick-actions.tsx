"use client"

import { useState } from "react"
import { Mail, Download, Printer, LinkIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import jsPDF from "jspdf"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@clerk/nextjs"

interface QuickActionsProps {
  show: boolean
  applicationData?: any
  scheduleAData?: any
  fileUrls?: {
    drivers_license_url?: string | null
    voided_check_url?: string | null
  }
}

interface DownloadOptions {
  scheduleA: boolean
  applicationInfo: boolean
  fileUploads: boolean
  compressed: boolean
}

export function QuickActions({ show, applicationData, scheduleAData, fileUrls }: QuickActionsProps) {
  const { isSignedIn } = useAuth()
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
    scheduleA: true,
    applicationInfo: true,
    fileUploads: false,
    compressed: false,
  })
  const [printOptions, setPrintOptions] = useState<DownloadOptions>({
    scheduleA: true,
    applicationInfo: true,
    fileUploads: false,
    compressed: false,
  })
  const [merchantEmail, setMerchantEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const { toast } = useToast()

  // Only show if both show prop is true AND user is signed in
  if (!show || !isSignedIn) return null

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("Partner Application Support Request")
    const body = encodeURIComponent(
      `Hello Lumino Support Team,\n\nI need assistance with my partner application.\n\n` +
        (applicationData?.partnerFullName ? `Partner Name: ${applicationData.partnerFullName}\n` : "") +
        (applicationData?.id ? `Application ID: ${applicationData.id}\n` : "") +
        `\nPlease describe your issue below:\n\n\nBest regards`,
    )
    window.open(`mailto:support@golumino.com?subject=${subject}&body=${body}`)
  }

  const generateScheduleAPDF = () => {
    const doc = new jsPDF("l", "mm", "a4")
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Header
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("LUMINO SCHEDULE A - FEE SCHEDULE", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    // Application info if available
    if (applicationData) {
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      if (applicationData.partnerFullName) {
        doc.text(`Partner: ${applicationData.partnerFullName}`, 20, yPosition)
        yPosition += 5
      }
      if (applicationData.businessName) {
        doc.text(`Business: ${applicationData.businessName}`, 20, yPosition)
        yPosition += 5
      }
      yPosition += 5
    }

    // Schedule type indicator
    doc.setFontSize(10)
    doc.setFont("helvetica", "italic")
    const scheduleType = scheduleAData ? "Custom Schedule A Applied" : "Default Schedule A"
    doc.text(scheduleType, 20, yPosition)
    yPosition += 15

    // Default schedule data structure
    const defaultScheduleA = {
      equipment: {
        category: "Equipment & Software",
        option1: "SkyTab, SumUp, Clover POS",
        option2: "Lumino Terminals, Pax, Dejavoo, Valor, Verifone",
        option3: "Lumino Invoicing, E-Commerce Integrations",
        option4: "Financial Services",
      },
      associationFees: {
        category: "Association Fees (Interchange, dues, assessments from Card Associations)",
        option1: "Pass-through 60%",
        option2: "Pass-through 75%",
        option3: "Pass-through 50%",
        option4: "Pass-through 60%",
      },
      visaMcFee: {
        category: "Visa/MC Transaction Fee",
        option1: "$0.05",
        option2: "$0.03",
        option3: "$0.05",
        option4: "-",
      },
      otherTransactionFee: {
        category: "Other Transaction Fee (AMEX, Discover, EBT, etc.)",
        option1: "$0.05",
        option2: "$0.03",
        option3: "$0.05",
        option4: "-",
      },
      binSponsorship: {
        category: "BIN Sponsorship",
        option1: "5 bps",
        option2: "3 bps",
        option3: "15 bps",
        option4: "-",
      },
      amexOptBlue: {
        category: "AMEX OptBlue / Processor Access",
        option1: "25 bps",
        option2: "25 bps",
        option3: "25 bps",
        option4: "-",
      },
      monthlySupportFee: {
        category: "Monthly Program Support Fee",
        option1: "$4.75",
        option2: "$4.75",
        option3: "$4.75",
        option4: "-",
      },
      monthlyMinimum: {
        category: "Monthly Minimum",
        option1: "$0.00",
        option2: "$0.00",
        option3: "$0.00",
        option4: "-",
      },
      chargebackFee: {
        category: "Chargeback Fee",
        option1: "$15.00",
        option2: "$15.00",
        option3: "$15.00",
        option4: "-",
      },
      retrievalRequest: {
        category: "Retrieval Request",
        option1: "$5.00",
        option2: "$5.00",
        option3: "$5.00",
        option4: "-",
      },
      bonusProgram: {
        category: "Bonus Program Upfront",
        option1: "18x Monthly Residual",
        option2: "1x Monthly Residual",
        option3: "-",
        option4: "-",
      },
      saasFees: {
        category: "SaaS Fees",
        option1: "See RDR/Fraud Schedule",
        option2: "See RDR/Fraud Schedule",
        option3: "See RDR/Fraud Schedule",
        option4: "-",
      },
      equipmentCost: {
        category: "Monthly Equipment Cost",
        option1: "See Equipment Schedule",
        option2: "See Equipment Schedule",
        option3: "See Equipment Schedule",
        option4: "-",
      },
      sbaLoans: {
        category: "SBA Loans (SBA Acquisition Loan Funding)",
        option1: "-",
        option2: "-",
        option3: "-",
        option4: "5% Fee",
      },
      creditCards: {
        category: "0% Interest Credit Cards",
        option1: "-",
        option2: "-",
        option3: "-",
        option4: "5% Fee",
      },
      bridgeLoans: {
        category: "Bank Statement Bridge Loans",
        option1: "-",
        option2: "-",
        option3: "-",
        option4: "3% Fee",
      },
      equipmentFinancing: {
        category: "Equipment Financing",
        option1: "-",
        option2: "-",
        option3: "-",
        option4: "3% Fee",
      },
      creditOptimization: {
        category: "Credit Optimization",
        option1: "-",
        option2: "-",
        option3: "-",
        option4: "25% Fee",
      },
    }

    // Table setup
    const colWidths = [90, 45, 45, 45, 40]
    const headers = ["Fee Category", "Option 1", "Option 2", "Option 3", "Option 4"]

    // Function to check if we need a new page and add headers if so
    const checkNewPage = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - 20) {
        doc.addPage()
        yPosition = 20

        // Re-add headers on new page
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        let xPosition = 20
        headers.forEach((header, index) => {
          doc.text(header, xPosition, yPosition)
          xPosition += colWidths[index]
        })
        yPosition += 10
      }
    }

    // Table headers
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    let xPosition = 20
    headers.forEach((header, index) => {
      doc.text(header, xPosition, yPosition)
      xPosition += colWidths[index]
    })
    yPosition += 10

    // Table data
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)

    Object.entries(defaultScheduleA).forEach(([key, defaultRow]) => {
      const customRow = scheduleAData?.[key]
      const rowHeight = 15 // Increased row height for better spacing

      // Check if we need a new page before adding this row
      checkNewPage(rowHeight)

      xPosition = 20

      // Category name
      const categoryLines = doc.splitTextToSize(defaultRow.category, colWidths[0] - 5)
      doc.text(categoryLines, xPosition, yPosition)

      // Option values
      xPosition += colWidths[0]
      for (let i = 1; i <= 4; i++) {
        const fieldKey = `option${i}` as keyof typeof defaultRow
        const value = customRow?.[fieldKey] || defaultRow[fieldKey] || "-"
        const isCustom = customRow && customRow[fieldKey] && customRow[fieldKey] !== defaultRow[fieldKey]

        if (isCustom) {
          doc.setFont("helvetica", "bold")
        }

        const valueLines = doc.splitTextToSize(value, colWidths[i] - 3)
        doc.text(valueLines, xPosition, yPosition)

        if (isCustom) {
          doc.setFont("helvetica", "normal")
        }

        xPosition += colWidths[i]
      }

      yPosition += Math.max(rowHeight, categoryLines.length * 5)
    })

    // Footer
    yPosition += 10
    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    doc.text("Generated by Lumino Partner Portal", 20, yPosition)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 5)

    return doc
  }

  const generateApplicationInfoPDF = () => {
    const doc = new jsPDF("p", "mm", "a4")
    let yPosition = 20

    // Header
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("PARTNER APPLICATION INFORMATION", 105, yPosition, { align: "center" })
    yPosition += 20

    if (!applicationData) {
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("No application data available", 20, yPosition)
      return doc
    }

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    // Partner Information
    doc.setFont("helvetica", "bold")
    doc.text("PARTNER INFORMATION", 20, yPosition)
    yPosition += 8
    doc.setFont("helvetica", "normal")

    const partnerFields = [
      ["Full Name", applicationData.partnerFullName],
      ["Email", applicationData.partnerEmail],
      ["Phone", applicationData.partnerPhone],
      ["Address", applicationData.partnerAddress],
      ["City", applicationData.partnerCity],
      ["State", applicationData.partnerState],
      ["ZIP Code", applicationData.partnerZip],
      ["Date of Birth", applicationData.dateOfBirth],
    ]

    partnerFields.forEach(([label, value]) => {
      if (value) {
        doc.text(`${label}: ${value}`, 20, yPosition)
        yPosition += 5
      }
    })

    yPosition += 5

    // Business Information
    doc.setFont("helvetica", "bold")
    doc.text("BUSINESS INFORMATION", 20, yPosition)
    yPosition += 8
    doc.setFont("helvetica", "normal")

    const businessFields = [
      ["Business Name", applicationData.businessName],
      ["Business Type", applicationData.businessType],
      ["Federal Tax ID", applicationData.federalTaxId],
      ["Website", applicationData.websiteUrl],
      ["Business Address", applicationData.businessAddress],
      ["Business City", applicationData.businessCity],
      ["Business State", applicationData.businessState],
      ["Business ZIP", applicationData.businessZip],
      ["Principal Name", applicationData.principalName],
    ]

    businessFields.forEach(([label, value]) => {
      if (value) {
        doc.text(`${label}: ${value}`, 20, yPosition)
        yPosition += 5
      }
    })

    yPosition += 5

    // Banking Information (if available)
    if (applicationData.bankAccountNumber || applicationData.bankRoutingNumber) {
      doc.setFont("helvetica", "bold")
      doc.text("BANKING INFORMATION", 20, yPosition)
      yPosition += 8
      doc.setFont("helvetica", "normal")

      if (applicationData.bankAccountNumber) {
        doc.text(
          `Account Number: ${"*".repeat(applicationData.bankAccountNumber.length - 4)}${applicationData.bankAccountNumber.slice(-4)}`,
          20,
          yPosition,
        )
        yPosition += 5
      }
      if (applicationData.bankRoutingNumber) {
        doc.text(`Routing Number: ${applicationData.bankRoutingNumber}`, 20, yPosition)
        yPosition += 5
      }
    }

    return doc
  }

  const downloadFiles = async (options: DownloadOptions) => {
    const files: { name: string; content: Blob }[] = []

    // Generate Schedule A PDF
    if (options.scheduleA) {
      const scheduleDoc = generateScheduleAPDF()
      const scheduleBlob = new Blob([scheduleDoc.output("blob")], { type: "application/pdf" })
      files.push({
        name: "Schedule-A.pdf",
        content: scheduleBlob,
      })
    }

    // Generate Application Info PDF
    if (options.applicationInfo) {
      const appDoc = generateApplicationInfoPDF()
      const appBlob = new Blob([appDoc.output("blob")], { type: "application/pdf" })
      files.push({
        name: "Application-Information.pdf",
        content: appBlob,
      })
    }

    // Add file uploads if requested and available
    if (options.fileUploads && fileUrls) {
      try {
        if (fileUrls.drivers_license_url) {
          // Handle both remote URLs and data URLs
          if (fileUrls.drivers_license_url.startsWith("data:")) {
            // Convert data URL to blob
            const response = await fetch(fileUrls.drivers_license_url)
            const blob = await response.blob()
            files.push({
              name: `Drivers-License.${blob.type.split("/")[1] || "jpg"}`,
              content: blob,
            })
          } else {
            // Remote URL
            const response = await fetch(fileUrls.drivers_license_url)
            if (response.ok) {
              const blob = await response.blob()
              files.push({
                name: `Drivers-License.${blob.type.split("/")[1] || "jpg"}`,
                content: blob,
              })
            }
          }
        }
        if (fileUrls.voided_check_url) {
          // Handle both remote URLs and data URLs
          if (fileUrls.voided_check_url.startsWith("data:")) {
            // Convert data URL to blob
            const response = await fetch(fileUrls.voided_check_url)
            const blob = await response.blob()
            files.push({
              name: `Voided-Check.${blob.type.split("/")[1] || "jpg"}`,
              content: blob,
            })
          } else {
            // Remote URL
            const response = await fetch(fileUrls.voided_check_url)
            if (response.ok) {
              const blob = await response.blob()
              files.push({
                name: `Voided-Check.${blob.type.split("/")[1] || "jpg"}`,
                content: blob,
              })
            }
          }
        }
      } catch (error) {
        console.error("Error downloading files:", error)
      }
    }

    if (files.length === 0) return

    if (options.compressed && files.length > 1) {
      // Without JSZip, download files individually with a note
      console.log("Note: Downloading files individually as ZIP compression requires additional dependencies")
      files.forEach((file, index) => {
        setTimeout(() => {
          const link = document.createElement("a")
          link.href = URL.createObjectURL(file.content)
          link.download = file.name
          link.click()
        }, index * 500) // Stagger downloads to avoid browser blocking
      })
    } else {
      // Download individual files
      files.forEach((file) => {
        const link = document.createElement("a")
        link.href = URL.createObjectURL(file.content)
        link.download = file.name
        link.click()
      })
    }
  }

  const printDocuments = (options: DownloadOptions) => {
    let printContent = ""

    if (options.scheduleA) {
      printContent += `
        <div style="page-break-after: always;">
          <h1 style="text-align: center; margin-bottom: 20px;">LUMINO SCHEDULE A - FEE SCHEDULE</h1>
          ${applicationData?.partnerFullName ? `<p><strong>Partner:</strong> ${applicationData.partnerFullName}</p>` : ""}
          ${applicationData?.businessName ? `<p><strong>Business:</strong> ${applicationData.businessName}</p>` : ""}
          <p><em>${scheduleAData ? "Custom Schedule A Applied" : "Default Schedule A"}</em></p>
          <p><strong>Note:</strong> This is a simplified print version. For the complete formatted Schedule A, please download the PDF version.</p>
        </div>
      `
    }

    if (options.applicationInfo && applicationData) {
      printContent += `
        <div style="page-break-after: always;">
          <h1 style="text-align: center; margin-bottom: 20px;">PARTNER APPLICATION INFORMATION</h1>
          <h2>Partner Information</h2>
          ${applicationData.partnerFullName ? `<p><strong>Full Name:</strong> ${applicationData.partnerFullName}</p>` : ""}
          ${applicationData.partnerEmail ? `<p><strong>Email:</strong> ${applicationData.partnerEmail}</p>` : ""}
          ${applicationData.partnerPhone ? `<p><strong>Phone:</strong> ${applicationData.partnerPhone}</p>` : ""}
          ${applicationData.partnerAddress ? `<p><strong>Address:</strong> ${applicationData.partnerAddress}</p>` : ""}
          
          <h2>Business Information</h2>
          ${applicationData.businessName ? `<p><strong>Business Name:</strong> ${applicationData.businessName}</p>` : ""}
          ${applicationData.businessType ? `<p><strong>Business Type:</strong> ${applicationData.businessType}</p>` : ""}
          ${applicationData.federalTaxId ? `<p><strong>Federal Tax ID:</strong> ${applicationData.federalTaxId}</p>` : ""}
          ${applicationData.websiteUrl ? `<p><strong>Website:</strong> ${applicationData.websiteUrl}</p>` : ""}
        </div>
      `
    }

    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Lumino Partner Documents</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.4; margin: 20px; }
                h1 { color: #333; }
                h2 { color: #666; margin-top: 20px; }
                p { margin: 5px 0; }
                @media print { 
                  body { margin: 0; }
                  .page-break { page-break-after: always; }
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleSelectAll = (type: "download" | "print", checked: boolean) => {
    const options = {
      scheduleA: checked,
      applicationInfo: checked,
      fileUploads: checked && !!fileUrls && (!!fileUrls.drivers_license_url || !!fileUrls.voided_check_url),
      compressed: type === "download" ? downloadOptions.compressed : false,
    }

    if (type === "download") {
      setDownloadOptions(options)
    } else {
      setPrintOptions(options)
    }
  }

  const handleSendInvite = async () => {
    if (!merchantEmail || !merchantEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    try {
      // Get the current invite ID from URL
      const urlParams = new URLSearchParams(window.location.search)
      const inviteId = urlParams.get("id")

      if (!inviteId) {
        throw new Error("No invite ID found")
      }

      const response = await fetch("/api/send-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: merchantEmail,
          inviteId: inviteId,
          agent: applicationData?.partnerFullName || "Lumino Team",
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please contact support.")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to send invite")
      }

      toast({
        title: "Success!",
        description: `Invite sent to ${merchantEmail}`,
      })
      setMerchantEmail("")
    } catch (error) {
      console.error("Error sending invite:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invite",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyLink = async () => {
    setIsCopying(true)
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      toast({
        title: "Copied!",
        description: "Application link copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="mt-8">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <CardTitle className="text-lg">Agent Actions</CardTitle>
              <CardDescription>
                You can pre-fill this application and send it to the merchant. Sensitive fields (SSN, bank details,
                etc.) and file uploads may be left blank for the merchant to complete.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Merchant Email Address</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="merchant@example.com"
                value={merchantEmail}
                onChange={(e) => setMerchantEmail(e.target.value)}
                disabled={isSending}
              />
              <Button onClick={handleSendInvite} disabled={isSending || !merchantEmail}>
                <Mail className="mr-2 h-4 w-4" />
                {isSending ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-blue-50 px-2 text-muted-foreground">OR</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Copy Application Link</label>
            <p className="text-sm text-muted-foreground">Generate a link you can share manually with the merchant</p>
            <Button variant="outline" onClick={handleCopyLink} disabled={isCopying} className="w-full bg-transparent">
              <LinkIcon className="mr-2 h-4 w-4" />
              {isCopying ? "Copying..." : "Click 'Copy Link' to generate a shareable link"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:left-auto md:right-4 md:transform-none z-50">
        <div className="flex items-center gap-2 bg-white shadow-lg rounded-lg border p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmailSupport}
            className="flex items-center gap-2 bg-transparent"
          >
            <Mail className="h-4 w-4" />
            Email Support
          </Button>

          <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Download Documents</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all-download"
                    checked={
                      downloadOptions.scheduleA && downloadOptions.applicationInfo && downloadOptions.fileUploads
                    }
                    onCheckedChange={(checked) => handleSelectAll("download", !!checked)}
                  />
                  <label htmlFor="select-all-download" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="schedule-a"
                      checked={downloadOptions.scheduleA}
                      onCheckedChange={(checked) => setDownloadOptions((prev) => ({ ...prev, scheduleA: !!checked }))}
                    />
                    <label htmlFor="schedule-a" className="text-sm">
                      Schedule A (PDF)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="app-info"
                      checked={downloadOptions.applicationInfo}
                      onCheckedChange={(checked) =>
                        setDownloadOptions((prev) => ({ ...prev, applicationInfo: !!checked }))
                      }
                    />
                    <label htmlFor="app-info" className="text-sm">
                      Application Information (PDF)
                    </label>
                  </div>

                  {fileUrls && (fileUrls.drivers_license_url || fileUrls.voided_check_url) && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="file-uploads"
                        checked={downloadOptions.fileUploads}
                        onCheckedChange={(checked) =>
                          setDownloadOptions((prev) => ({ ...prev, fileUploads: !!checked }))
                        }
                      />
                      <label htmlFor="file-uploads" className="text-sm">
                        File Uploads
                      </label>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="compressed"
                      checked={downloadOptions.compressed}
                      onCheckedChange={(checked) => setDownloadOptions((prev) => ({ ...prev, compressed: !!checked }))}
                    />
                    <label htmlFor="compressed" className="text-sm">
                      Download multiple files (staggered)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      downloadFiles(downloadOptions)
                      setDownloadDialogOpen(false)
                    }}
                    disabled={
                      !downloadOptions.scheduleA && !downloadOptions.applicationInfo && !downloadOptions.fileUploads
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Print Documents</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all-print"
                    checked={printOptions.scheduleA && printOptions.applicationInfo}
                    onCheckedChange={(checked) => handleSelectAll("print", !!checked)}
                  />
                  <label htmlFor="select-all-print" className="text-sm font-medium">
                    Select All
                  </label>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="print-schedule-a"
                      checked={printOptions.scheduleA}
                      onCheckedChange={(checked) => setPrintOptions((prev) => ({ ...prev, scheduleA: !!checked }))}
                    />
                    <label htmlFor="print-schedule-a" className="text-sm">
                      Schedule A (Simplified)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="print-app-info"
                      checked={printOptions.applicationInfo}
                      onCheckedChange={(checked) =>
                        setPrintOptions((prev) => ({ ...prev, applicationInfo: !!checked }))
                      }
                    />
                    <label htmlFor="print-app-info" className="text-sm">
                      Application Information
                    </label>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Note: File uploads cannot be printed directly. Use download option for files.
                </p>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setPrintDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      printDocuments(printOptions)
                      setPrintDialogOpen(false)
                    }}
                    disabled={!printOptions.scheduleA && !printOptions.applicationInfo}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
