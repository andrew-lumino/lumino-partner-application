"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, AlertTriangle, Upload, FileText, X, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { getAgreementText } from "./getAgreementText"
import { cn } from "@/lib/utils"
import jsPDF from "jspdf"
import { renderWelcomeStep } from "./steps/renderWelcomeStep"
import { renderScheduleAStep } from "./steps/renderScheduleAStep"
import { QuickActions } from "@/components/quick-actions"
import { AgreementReview } from "@/components/agreement-review"
import { defaultScheduleA } from "./getAgreementText"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type StepStatus = "not_visited" | "visited" | "completed" | "error"

interface Step {
  id: string
  label: string
  status: StepStatus
}

interface FormData {
  codeOfConductSignature: string
  codeOfConductDate: string
  partnerFullName: string
  partnerEmail: string
  partnerPhone: string
  partnerAddress: string
  partnerCity: string
  partnerState: string
  partnerZip: string
  businessName: string
  principalName: string
  businessAddress: string
  businessCity: string
  businessState: string
  businessZip: string
  businessPhone: string
  federalTaxId: string
  businessType: "Sole" | "LLC" | "Partnership" | "Corp" | ""
  websiteUrl: string
  dateOfBirth: string
  bankAccountNumber: string
  bankRoutingNumber: string
  w9Name: string
  w9BusinessName: string
  w9TaxClassification: "individual" | "c-corp" | "s-corp" | "partnership" | "trust" | "llc" | "other" | ""
  w9LlcClassification: "C" | "S" | "P" | ""
  w9OtherClassification: string
  w9ExemptPayeeCode: string
  w9FatcaCode: string
  w9Address: string
  w9CityStateZip: string
  w9TINType: "ssn" | "ein" | ""
  w9TIN: string
  signatureDate: string
  signatureFullName: string
}

interface FileUploadState {
  file: File | null
  preview: string | null
  uploadStatus: "idle" | "uploading" | "success" | "error"
  uploadedUrl: string | null
  error: string | null
}

const MAX_FILE_SIZE_MB = 10

export default function LuminoPartnerApplication() {
  const [currentStep, setCurrentStep] = useState(0)
  const [inviteId, setInviteId] = useState<string | null>(null)
  const [customScheduleA, setCustomScheduleA] = useState<any>(null)
  const [customMessage, setCustomMessage] = useState<any>(null)
  const [isSkipMode, setIsSkipMode] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    if (id) {
      setInviteId(id)
      fetchCustomData(id)
    }
    const hasApplicationParam = urlParams.get("application") === "true"
    const hasIdParam = urlParams.has("id")
    setShowQuickActions(hasApplicationParam || hasIdParam)

    const skipEnabled = ["skip", "agent"].some((k) => (urlParams.get(k) ?? "").toLowerCase() === "true")
    if (skipEnabled) {
      setIsSkipMode(true)
    }
  }, [])

  const fetchCustomData = async (inviteId: string) => {
    try {
      const response = await fetch(`/api/get-custom-schedule-a?id=${inviteId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.custom_schedule_a) {
          setCustomScheduleA(data.custom_schedule_a)
        }
        if (data.custom_message) {
          setCustomMessage(data.custom_message)
        }
      }
    } catch (error) {
      console.error("Error fetching custom data:", error)
    }
  }

  const [steps, setSteps] = useState<Step[]>([
    { id: "welcome", label: "Welcome", status: "visited" },
    { id: "scheduleA", label: "Schedule A", status: "visited" },
    { id: "codeOfConduct", label: "Code of Conduct", status: "not_visited" },
    { id: "partnerInfo", label: "Partner Info", status: "not_visited" },
    { id: "w9", label: "W-9", status: "not_visited" },
    { id: "uploads", label: "Uploads", status: "not_visited" },
    { id: "review", label: "Review & Sign", status: "not_visited" },
    { id: "confirmation", label: "Confirmation", status: "not_visited" },
  ])

  const [formData, setFormData] = useState<FormData>({
    codeOfConductSignature: "",
    codeOfConductDate: new Date().toISOString().split("T")[0],
    partnerFullName: "",
    partnerEmail: "",
    partnerPhone: "",
    partnerAddress: "",
    partnerCity: "",
    partnerState: "",
    partnerZip: "",
    businessName: "",
    principalName: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessPhone: "",
    federalTaxId: "",
    businessType: "",
    websiteUrl: "",
    w9Name: "",
    w9BusinessName: "",
    w9TaxClassification: "",
    w9LlcClassification: "",
    w9OtherClassification: "",
    w9ExemptPayeeCode: "",
    w9FatcaCode: "",
    w9Address: "",
    w9CityStateZip: "",
    w9TINType: "",
    w9TIN: "",
    signatureDate: new Date().toISOString().split("T")[0],
    signatureFullName: "",
    dateOfBirth: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
  })

  const [driversLicense, setDriversLicense] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploadStatus: "idle",
    uploadedUrl: null,
    error: null,
  })

  const [voidedCheck, setVoidedCheck] = useState<FileUploadState>({
    file: null,
    preview: null,
    uploadStatus: "idle",
    uploadedUrl: null,
    error: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasScrolledAgreement, setHasScrolledAgreement] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCertified, setIsCertified] = useState(false)

  const agreementScrollRef = useRef<HTMLDivElement>(null)

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const uploadFileToSupabase = async (
    file: File,
    setFileState: React.Dispatch<React.SetStateAction<FileUploadState>>,
  ) => {
    setFileState((prev) => ({ ...prev, uploadStatus: "uploading", error: null }))

    try {
      const reader = new FileReader()
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const response = await fetch("/api/upload-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileContent,
          filename: file.name,
          contentType: file.type,
          email: formData.partnerEmail || "unknown",
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Upload failed")
      }

      setFileState((prev) => ({
        ...prev,
        uploadStatus: "success",
        uploadedUrl: result.url,
        error: null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed"
      setFileState((prev) => ({
        ...prev,
        uploadStatus: "error",
        error: errorMessage,
      }))
    }
  }

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileState: React.Dispatch<React.SetStateAction<FileUploadState>>,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileState((prev) => ({
        ...prev,
        uploadStatus: "error",
        error: `File size exceeds ${MAX_FILE_SIZE_MB}MB`,
      }))
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFileState((prev) => ({
        ...prev,
        file,
        preview: reader.result as string,
      }))
    }
    reader.readAsDataURL(file)

    await uploadFileToSupabase(file, setFileState)
  }

  const removeFile = (setFileState: React.Dispatch<React.SetStateAction<FileUploadState>>) => {
    setFileState({
      file: null,
      preview: null,
      uploadStatus: "idle",
      uploadedUrl: null,
      error: null,
    })
  }

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {}
    switch (stepIndex) {
      case 2:
        if (!formData.codeOfConductSignature) newErrors.codeOfConductSignature = "Signature is required."
        if (!formData.codeOfConductDate) newErrors.codeOfConductDate = "Date is required."
        break
      case 3:
        if (!formData.partnerFullName) newErrors.partnerFullName = "Full Name is required."
        if (!formData.partnerEmail) newErrors.partnerEmail = "Email is required."
        if (!formData.businessName) newErrors.businessName = "Business Name is required."
        if (!formData.federalTaxId) newErrors.federalTaxId = "Federal Tax ID is required."
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required."
        if (!formData.bankAccountNumber) newErrors.bankAccountNumber = "Account number is required."
        if (!formData.bankRoutingNumber) newErrors.bankRoutingNumber = "Routing number is required."
        break
      case 4:
        if (!formData.w9Name) newErrors.w9Name = "Name is required."
        if (!formData.w9TaxClassification) newErrors.w9TaxClassification = "Tax classification is required."
        if (formData.w9TaxClassification === "llc" && !formData.w9LlcClassification)
          newErrors.w9LlcClassification = "LLC classification is required."
        if (!formData.w9Address) newErrors.w9Address = "Address is required."
        if (!formData.w9CityStateZip) newErrors.w9CityStateZip = "City, State, ZIP is required."
        if (!formData.w9TIN) newErrors.w9TIN = "Taxpayer Identification Number is required."
        break
      case 5:
        if (driversLicense.uploadStatus !== "success")
          newErrors.driversLicense = "Driver's License must be uploaded successfully."
        if (voidedCheck.uploadStatus !== "success")
          newErrors.voidedCheck = "Voided Check must be uploaded successfully."
        break
      case 6:
        if (!hasScrolledAgreement) newErrors.agreement = "You must read the agreement to continue."
        if (!formData.signatureFullName) newErrors.signature = "Typed signature is required."
        if (!formData.signatureDate) newErrors.signatureDate = "Date is required."
        if (!isCertified) newErrors.certification = "You must check the certification box to proceed."
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateStepStatus = (stepIndex: number, status: StepStatus) => {
    setSteps((prev) => prev.map((step, index) => (index === stepIndex ? { ...step, status } : step)))
  }

  const handleNext = () => {
    if (isSkipMode || currentStep === 0 || currentStep === 1) {
      updateStepStatus(currentStep, "completed")
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateStepStatus(nextStep, "visited")
      return
    }

    const isValid = validateStep(currentStep)

    if (isValid) {
      updateStepStatus(currentStep, "completed")
    } else {
      updateStepStatus(currentStep, "error")
    }

    if (currentStep < steps.length - 2) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateStepStatus(nextStep, "visited")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (isSkipMode) {
      setCurrentStep(stepIndex)
      if (steps[stepIndex].status === "not_visited") {
        updateStepStatus(stepIndex, "visited")
      }
      return
    }

    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const getAgreementTextForDisplay = () => {
    return getAgreementText(formData, customScheduleA)
  }

  const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
    const res = await fetch(imageUrl)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const createSignaturePNG = (signatureText: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        resolve("")
        return
      }

      canvas.width = 400
      canvas.height = 100

      ctx.font = "600 32px cursive"
      ctx.fillStyle = "#1f2937"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillText(signatureText, canvas.width / 2, canvas.height / 2)

      const dataURL = canvas.toDataURL("image/png")
      resolve(dataURL)
    })
  }

  const createPdfDocument = async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4")
      const pageHeight = doc.internal.pageSize.getHeight()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let y = margin

      const signatureImgData = await getBase64ImageFromUrl("/images/ceo-signature.png")

      let userSignaturePNG = ""
      if (formData.signatureFullName) {
        userSignaturePNG = await createSignaturePNG(formData.signatureFullName)
      }

      const checkNewPage = (requiredHeight: number) => {
        if (y + requiredHeight > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
      }

      const addSectionTitle = (title: string) => {
        y += 10
        checkNewPage(16)
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text(title, margin, y)
        y += 8
      }

      const addField = (label: string, value: string) => {
        if (!value) return
        const valueLines = doc.splitTextToSize(value, pageWidth - margin * 2 - 45)
        const requiredHeight = valueLines.length * 5 + 2
        checkNewPage(requiredHeight)

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold")
        doc.text(`${label}:`, margin, y)

        doc.setFont("helvetica", "normal")
        doc.text(valueLines, margin + 45, y)
        y += requiredHeight
      }

      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("Lumino Partner Application Summary", pageWidth / 2, y, { align: "center" })
      y += 8

      addSectionTitle("Partner Information")
      addField("Full Name", formData.partnerFullName)
      addField("Email", formData.partnerEmail)
      addField("Phone", formData.partnerPhone)
      addField(
        "Address",
        `${formData.partnerAddress}, ${formData.partnerCity}, ${formData.partnerState} ${formData.partnerZip}`,
      )

      addSectionTitle("Business Information")
      addField("Business Name", formData.businessName)
      addField("Principal Name", formData.principalName)
      addField(
        "Business Address",
        `${formData.businessAddress}, ${formData.businessCity}, ${formData.businessState} ${formData.businessZip}`,
      )
      addField("Business Phone", formData.businessPhone)
      addField("Federal Tax ID", formData.federalTaxId)
      addField("Business Type", formData.businessType)
      addField("Website URL", formData.websiteUrl)

      addSectionTitle("W-9 Information")
      addField("Name on Tax Return", formData.w9Name)
      addField("Business Name", formData.w9BusinessName)
      addField(
        "Tax Classification",
        `${formData.w9TaxClassification} ${formData.w9TaxClassification === "llc" ? `(${formData.w9LlcClassification})` : ""}`,
      )
      addField("Address", formData.w9Address)
      addField("City, State, ZIP", formData.w9CityStateZip)
      addField("TIN", `${formData.w9TINType.toUpperCase()}: ${formData.w9TIN}`)

      addSectionTitle("Signature")
      if (userSignaturePNG && formData.signatureFullName) {
        checkNewPage(25)
        try {
          doc.addImage(userSignaturePNG, "PNG", margin, y - 10, 80, 20)
          y += 25
        } catch (e) {
          console.error("Error adding user signature to PDF:", e)
          doc.text("(Signature could not be embedded)", margin, y)
          y += 8
        }
      }
      addField("Signed By", formData.signatureFullName)
      addField("Date", formData.signatureDate)

      doc.addPage()
      y = margin

      const agreementSections = getAgreementText(formData, customScheduleA)

      // Ensure agreementSections is an array before calling forEach
      if (!Array.isArray(agreementSections)) {
        console.error("Agreement sections is not an array:", agreementSections)
        throw new Error("Failed to generate agreement text")
      }

      agreementSections.forEach((section, sectionIndex) => {
        addSectionTitle(section.title)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")

        const textLines = doc.splitTextToSize(section.content, pageWidth - margin * 2)

        textLines.forEach((line: string) => {
          checkNewPage(4)

          if (sectionIndex === agreementSections.length - 1 && line.startsWith("Name/Title: Zachry Godfrey")) {
            checkNewPage(25)
            try {
              doc.addImage(signatureImgData, "PNG", margin, y, 50, 15)
              y += 18
            } catch (e) {
              console.error("Error adding CEO signature:", e)
            }
          }

          doc.text(line, margin, y)
          y += 4

          if (
            userSignaturePNG &&
            sectionIndex === agreementSections.length - 1 &&
            line.includes(formData.signatureFullName || "[Partner Name]")
          ) {
            checkNewPage(25)
            try {
              doc.addImage(userSignaturePNG, "PNG", margin, y, 60, 15)
              y += 18
            } catch (e) {
              console.error("Error adding user signature to agreement:", e)
            }
          }
        })
        y += 6
      })

      return doc
    } catch (error) {
      console.error("Error creating PDF:", error)
      throw error
    }
  }

  const handleDownloadPdf = async () => {
    if (isDownloadingPdf) return

    setIsDownloadingPdf(true)
    try {
      const doc = await createPdfDocument()
      const filename = `Lumino-Partner-Application-${formData.partnerFullName.replace(/[^a-zA-Z0-9]/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(filename)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
      setSubmitError("Failed to generate PDF. Please try again or contact support.")
      setShowErrorDialog(true)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(6)) {
      updateStepStatus(6, "error")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const agreementText = getAgreementTextForDisplay()

      const fileUrls = {
        driversLicenseUrl: driversLicense.uploadedUrl,
        voidedCheckUrl: voidedCheck.uploadedUrl,
      }

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          fileUrls,
          agreementText,
          inviteId,
          customScheduleA,
        }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to submit application")
      }

      updateStepStatus(6, "completed")
      setCurrentStep(7)
      updateStepStatus(7, "visited")
      setIsSubmitted(true)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
      setShowErrorDialog(true)
      updateStepStatus(6, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAgreementScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 20
    if (isAtBottom && !hasScrolledAgreement) {
      setHasScrolledAgreement(true)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => {
        if (step.id === "confirmation") return null
        const isActive = index === currentStep
        let statusClass = "bg-white border-gray-300 text-gray-500"
        let icon = <span>{index + 1}</span>

        if (step.status === "completed") {
          statusClass = "bg-green-500 border-green-500 text-white"
          icon = <Check className="w-5 h-5" />
        } else if (step.status === "error") {
          statusClass = "bg-red-500 border-red-500 text-white"
          icon = <AlertTriangle className="w-5 h-5" />
        } else if (isActive) {
          statusClass = "bg-blue-500 border-blue-500 text-white"
        }

        const canClick = isSkipMode || index <= currentStep
        const cursorClass = canClick ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-50"

        return (
          <div
            key={step.id}
            className="flex-1 flex flex-col items-center"
            onClick={() => canClick && handleStepClick(index)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-transform ${statusClass} ${cursorClass}`}
            >
              {icon}
            </div>
            <p className={`mt-2 text-center text-sm ${isActive ? "text-blue-600 font-semibold" : "text-gray-600"}`}>
              {step.label}
            </p>
          </div>
        )
      })}
    </div>
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const SignaturePreview = ({ signature }: { signature: string }) => {
    return (
      <fieldset
        style={{
          border: "3px solid #6b7280",
          borderRadius: "24px",
          padding: "32px 24px",
          minHeight: "120px",
          backgroundColor: "#ffffff",
          margin: "16px 0",
        }}
      >
        <legend
          style={{
            padding: "0 12px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
          }}
        >
          Signature Preview
        </legend>
        <div
          style={{
            fontFamily: signature ? "'Dancing Script', cursive" : "inherit",
            fontSize: signature ? "32px" : "16px",
            fontWeight: signature ? "600" : "normal",
            color: signature ? "#1f2937" : "#9ca3af",
            fontStyle: signature ? "normal" : "italic",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60px",
          }}
        >
          {signature || "Your signature will appear here"}
        </div>
      </fieldset>
    )
  }

  const renderCodeOfConductStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Partner's Code of Conduct</CardTitle>
        <CardDescription>Please read the following code of conduct carefully.</CardDescription>
      </CardHeader>
      <CardContent className="prose custom-prose dark:prose-invert max-w-none space-y-4">
        <div className="pb-4">
          <p>
            All advertisements and materials involved in or related to the sale of a product or service, or which
            contain or refer to a name, trade or service mark, products, services, etc., must be approved in writing by
            Lumino and in advance of their use. The use of the Internet for marketing products and services is subject
            to the same policies and procedures applicable to written or printed material. Please note that to help all
            of our partners maintain compliance with the Visa/MasterCard regulations regarding the advertisement of card
            processing services on the Internet, all of the Visa/MasterCard regulations must be met in addition to the
            following:
          </p>
          <p>
            The following endorsement statement must appear at the bottom of the website's homepage, "about us" page and
            any website pages displaying Visa/MasterCard logos and/or text or advertising for Merchant services. *All
            Merchant Accounts are referred to and processing services are provided by Lumino. Credit card logos cannot
            appear on your website unless you accept those credit cards as a form of payment, and may not appear on any
            page advertising for Merchant processing services unless the above requirement is met.
          </p>
          <p>
            If you choose to use an "apply now" feature for online Merchant applications, you must have a link on your
            site to your company-branded web page.
          </p>
          <p>
            In addition to the above Visa/MasterCard marketing regulations, there exist legal restrictions or
            Prohibitions on some forms of advertising, notably, but not limited to, fax advertising (entirely prohibited
            in the US), email solicitation, and automated dialers/announcing devices ("ADAD'). While the above-mentioned
            Visa/MasterCard regulations still apply, Lumino has an obligation to notify our partners of the importance
            of familiarizing themselves with the various laws surrounding the use of automated dialers/announcing
            devices. These laws vary in scope and severity based on jurisdictional differences.
          </p>
        </div>
        <p>
          We have summarized the laws and regulations of each of the states about the making of business-to-business
          sales calls utilizing ADAD. You must have the ability to segment your files to ensure compliance. Remember,
          your organization or you personally will be held liable for non-compliance. This list is for information
          purposes only and Lumino does not represent it as complete.
        </p>
        <p>
          ADADs are regulated federally for calls to consumers. However, there are no federal restrictions on their use
          for commercial calls. Furthermore, many states have enacted regulatory frameworks that seek both to protect
          residents (often businesses and consumers) from the annoyance of ADAD calls and to prevent ADAD-generated
          calls from impeding telephone service.
        </p>
        <br />
        <div className="pt-8">
          <h3 className="font-bold">EXPERIENCED PARTNERS</h3>
          <p>
            Lumino recommends that you seek legal advice pertaining to the operation of any ADAD equipment. This
            document is not intended as a replacement for sound legal advice, and the use of ADAD equipment is entirely
            your decision and responsibility.
          </p>
          <br />
          <h4 className="font-bold">AUTOMATED DIALER AND ANNOUNCING DEVICE (ADAD) COMPLIANCE</h4>
          <p>
            In the following states, ADAD delivered business-to-business sales calls are extremely forbidden (whether
            according to criminal statutes or civil regulations): Arkansas (criminal), Maryland (criminal), Mississippi
            (civil), North Carolina (civil), Washington (civil), and Wyoming (criminal).
          </p>
          <p>
            The following states allow business-to-business ADAD calls without restrictions: Alabama, Alaska, Arizona,
            Connecticut, Delaware, Florida, Georgia, Hawaii, Kansas, Louisiana, Missouri, Ohio, Oregon, South Carolina,
            South Dakota, Texas, Vermont, Virginia, and West Virginia.
          </p>
          <p>
            Several states impose various time, place, and manner restrictions. These types of restrictions tend to
            limit the hours during which ADAD calls can be made (typically between 9 a.m. and 9 p.m.), require a short
            period after hang-up for the call to be disconnected (the range tends to be between five and thirty seconds)
            and mandate that the name and contact information of the business for whom the call is being made be
            provided at the start of the call. The states with some combination of these fairly manageable ADAD
            regulations are the following: Idaho, Maine, Massachusetts, Nebraska, Nevada, New York, and Rhode Island.
          </p>
          <p>
            Two states require that the operator of ADAD equipment register with, or obtain a permit from, the state.
            These states are: New Hampshire and Tennessee.
          </p>
          <p>
            Several states have imposed fairly onerous restrictions upon those businesses that attempt to solicit sales
            through the use of business-to-business ADAD calls. Some of these states require that live operators
            introduce the recorded call, that ADAD calls can only be made to businesses with whom the caller has a prior
            relationship or has otherwise consented to receive ADAD calls, and that the ADAD equipment only operates
            while it is attended.
          </p>
          <p>
            The following states require that a live operator introduce an ADAD call, or otherwise be available during
            the call: California, Indiana, and Iowa.
          </p>
          <p>
            Three states require that ADAD calls must be introduced by a live operator unless the recipient has
            previously consented to receiving such calls: New Jersey, North Dakota and Oklahoma.
            <br />
            <br />
            Several states only allow ADAD calls to be made if there is a prior business relationship between the
            recipient and the caller: Colorado, District of Columbia, Illinois, New Mexico, and Utah.
            <br />
            <br />
            Express consent is required to be given by the recipient before ADAD calls can be made to businesses in the
            following states: Michigan, Minnesota, Montana, and Wisconsin.
            <br />
            <br />
            One state requires that ADAD equipment be attended to: Kentucky.
          </p>
          <p>
            Comparative or competitive information must be approved in advance by Lumino, like any other form of sales
            material. Comparisons must be true, current, dated, and factual.
            <br />
            <br />
            Any materials identified as "For Internal Use Only" shall not be used by the public.
          </p>
          <p>
            Accurate and reliable records are necessary to meet both your professional responsibilities and Lumino's
            legal and financial obligations. Because of this, you are required to keep up-to-date records and files of
            any transactions, correspondence, documentation, etc. involving your clients.
            <br />
            <br />
            You must make your records involving products and services available to Lumino for general auditing purposes
            or to enable Lumino to respond to any regulatory or administrative action against Lumino or yourself.
            <br />
            <br />
            NOTE: Any cost associated with any legal actions involving Lumino as a part of the defendant will be
            deducted from the residual income of the Partner and may result in a material breach of the Partner
            agreement.
          </p>
          <br />
          <h3 className="font-bold">CONFIDENTIALITY</h3>
          <p>
            In your role as a Lumino Partner, you will possess confidential information about your Merchant and Lumino.
            A breach of confidentiality can have serious consequences. Therefore, you must safeguard all confidential
            Merchant and Lumino information and only provide access to individuals who have a legitimate right to it.
            You are responsible for maintaining the security of all confidential information in your possession, which
            shall be held at all times in strict confidence, and you hereby agree to indemnify, defend, and hold
            harmless Lumino from any financial, reputational, or other damage that results from your breach of this
            paragraph. The confidentiality obligations contained herein are in addition to, and not in lieu of, similar
            or greater obligations contained in the Partner Agreement or elsewhere agreed between you and Lumino.
          </p>
          <h3 className="font-bold">VIOLATION OF LUMINO POLICY</h3>
          <p>
            The purpose of policies and procedures is to ensure Lumino's ability to provide the highest quality products
            and services to its Merchants and Partners. In order to protect the solid reputation of Lumino and its
            Partners, appropriate action (verbal or written, contract termination or prosecution) will be taken by
            Lumino on all known violations of its policies and procedures. Lumino requires all Partners to abide by its
            policies and procedures. Due to frequent law changes, these compliances are subject to change. Partners will
            be responsible for being up-to-date with current regulations.
          </p>
        </div>
        <div className="space-y-4 py-4">
          <h3 className="font-bold">Maintaining Records</h3>
          <p className="text-sm">
            Please acknowledge receipt and understanding of the above-stated compliance and code of ethics agreement,
            and return with the Lumino Partner Agreement:
          </p>
          <div className="space-y-2">
            <Label htmlFor="codeOfConductSignature">Typed Signature (Full Name)</Label>
            <Input
              id="codeOfConductSignature"
              value={formData.codeOfConductSignature}
              onChange={(e) => updateFormData("codeOfConductSignature", e.target.value)}
              className={errors.codeOfConductSignature ? "border-red-500" : ""}
            />
            {errors.codeOfConductSignature && <p className="text-red-500 text-sm">{errors.codeOfConductSignature}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeOfConductDate">Date</Label>
            <Input
              id="codeOfConductDate"
              type="date"
              value={formData.codeOfConductDate}
              onChange={(e) => updateFormData("codeOfConductDate", e.target.value)}
              className={errors.codeOfConductDate ? "border-red-500" : ""}
            />
            {errors.codeOfConductDate && <p className="text-red-500 text-sm">{errors.codeOfConductDate}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderPartnerInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Partner & Business Information</CardTitle>
        <CardDescription>Tell us about you and your business.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Partner Information</h3>
          <div className="space-y-2">
            <Label htmlFor="partnerFullName">Your Full Name</Label>
            <Input
              id="partnerFullName"
              value={formData.partnerFullName}
              onChange={(e) => updateFormData("partnerFullName", e.target.value)}
              className={errors.partnerFullName ? "border-red-500" : ""}
            />
            {errors.partnerFullName && <p className="text-red-500 text-sm">{errors.partnerFullName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="partnerEmail">Email Address</Label>
              <Input
                id="partnerEmail"
                type="email"
                value={formData.partnerEmail}
                onChange={(e) => updateFormData("partnerEmail", e.target.value)}
                className={errors.partnerEmail ? "border-red-500" : ""}
              />
              {errors.partnerEmail && <p className="text-red-500 text-sm">{errors.partnerEmail}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerPhone">Phone Number</Label>
              <Input
                id="partnerPhone"
                type="tel"
                value={formData.partnerPhone}
                onChange={(e) => updateFormData("partnerPhone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Home Address</Label>
            <Input
              placeholder="Street Address"
              value={formData.partnerAddress}
              onChange={(e) => updateFormData("partnerAddress", e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="City"
                value={formData.partnerCity}
                onChange={(e) => updateFormData("partnerCity", e.target.value)}
              />
              <Input
                placeholder="State"
                value={formData.partnerState}
                onChange={(e) => updateFormData("partnerState", e.target.value)}
              />
              <Input
                placeholder="Zip Code"
                value={formData.partnerZip}
                onChange={(e) => updateFormData("partnerZip", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Information</h3>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => updateFormData("businessName", e.target.value)}
              className={errors.businessName ? "border-red-500" : ""}
            />
            {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="principalName">Name of Principal(s)</Label>
            <Input
              id="principalName"
              value={formData.principalName}
              onChange={(e) => updateFormData("principalName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Business Address</Label>
            <Input
              placeholder="Street Address"
              value={formData.businessAddress}
              onChange={(e) => updateFormData("businessAddress", e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="City"
                value={formData.businessCity}
                onChange={(e) => updateFormData("businessCity", e.target.value)}
              />
              <Input
                placeholder="State"
                value={formData.businessState}
                onChange={(e) => updateFormData("businessState", e.target.value)}
              />
              <Input
                placeholder="Zip Code"
                value={formData.businessZip}
                onChange={(e) => updateFormData("businessZip", e.target.value)}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input
                id="businessPhone"
                type="tel"
                value={formData.businessPhone}
                onChange={(e) => updateFormData("businessPhone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => updateFormData("websiteUrl", e.target.value)}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="federalTaxId">Federal Tax ID</Label>
              <Input
                id="federalTaxId"
                value={formData.federalTaxId}
                onChange={(e) => updateFormData("federalTaxId", e.target.value)}
                className={errors.federalTaxId ? "border-red-500" : ""}
              />
              {errors.federalTaxId && <p className="text-red-500 text-sm">{errors.federalTaxId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Business Type</Label>
              <Select
                onValueChange={(v: "Sole" | "LLC" | "Partnership" | "Corp") => updateFormData("businessType", v)}
                value={formData.businessType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sole">Sole Proprietorship</SelectItem>
                  <SelectItem value="LLC">LLC</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Corp">Corporation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Input
                id="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={(e) => updateFormData("bankAccountNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankRoutingNumber">Bank Routing Number</Label>
              <Input
                id="bankRoutingNumber"
                value={formData.bankRoutingNumber}
                onChange={(e) => updateFormData("bankRoutingNumber", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderW9Step = () => (
    <Card>
      <CardHeader>
        <CardTitle>W-9 Information</CardTitle>
        <CardDescription>Request for Taxpayer Identification Number and Certification.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="w9Name">1. Name (as shown on your income tax return)</Label>
          <Input
            id="w9Name"
            value={formData.w9Name}
            onChange={(e) => updateFormData("w9Name", e.target.value)}
            className={errors.w9Name ? "border-red-500" : ""}
          />
          {errors.w9Name && <p className="text-red-500 text-sm">{errors.w9Name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="w9BusinessName">2. Business name/disregarded entity name, if different from above</Label>
          <Input
            id="w9BusinessName"
            value={formData.w9BusinessName}
            onChange={(e) => updateFormData("w9BusinessName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>3. Federal tax classification</Label>
          <RadioGroup
            onValueChange={(v) => updateFormData("w9TaxClassification", v)}
            value={formData.w9TaxClassification}
            className={errors.w9TaxClassification ? "border-red-500 rounded-md p-2" : ""}
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">Individual/sole proprietor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="c-corp" id="c-corp" />
                <Label htmlFor="c-corp">C Corporation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="s-corp" id="s-corp" />
                <Label htmlFor="s-corp">S Corporation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partnership" id="partnership" />
                <Label htmlFor="partnership">Partnership</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trust" id="trust" />
                <Label htmlFor="trust">Trust/estate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
              <div className="flex items-center space-x-2 col-span-3">
                <RadioGroupItem value="llc" id="llc" />
                <Label htmlFor="llc">Limited liability company. Enter the tax classification (C, S, or P)</Label>
              </div>
            </div>
          </RadioGroup>
          {errors.w9TaxClassification && <p className="text-red-500 text-sm">{errors.w9TaxClassification}</p>}
          {formData.w9TaxClassification === "llc" && (
            <div className="pl-6 mt-2">
              <Select
                onValueChange={(v: "C" | "S" | "P") => updateFormData("w9LlcClassification", v)}
                value={formData.w9LlcClassification}
              >
                <SelectTrigger className={errors.w9LlcClassification ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select LLC classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">C = C corporation</SelectItem>
                  <SelectItem value="S">S = S corporation</SelectItem>
                  <SelectItem value="P">P = Partnership</SelectItem>
                </SelectContent>
              </Select>
              {errors.w9LlcClassification && <p className="text-red-500 text-sm">{errors.w9LlcClassification}</p>}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="w9Address">5. Address (number, street, and apt. or suite no.)</Label>
          <Input
            id="w9Address"
            value={formData.w9Address}
            onChange={(e) => updateFormData("w9Address", e.target.value)}
            className={errors.w9Address ? "border-red-500" : ""}
          />
          {errors.w9Address && <p className="text-red-500 text-sm">{errors.w9Address}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="w9CityStateZip">6. City, state, and ZIP code</Label>
          <Input
            id="w9CityStateZip"
            value={formData.w9CityStateZip}
            onChange={(e) => updateFormData("w9CityStateZip", e.target.value)}
            className={errors.w9CityStateZip ? "border-red-500" : ""}
          />
          {errors.w9CityStateZip && <p className="text-red-500 text-sm">{errors.w9CityStateZip}</p>}
        </div>
        <div className="space-y-2">
          <Label>Part I: Taxpayer Identification Number (TIN)</Label>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Social Security Number or Employer ID Number"
              value={formData.w9TIN}
              onChange={(e) => updateFormData("w9TIN", e.target.value)}
              className={errors.w9TIN ? "border-red-500" : ""}
            />
            <Select onValueChange={(v: "ssn" | "ein") => updateFormData("w9TINType", v)} value={formData.w9TINType}>
              <SelectTrigger>
                <SelectValue placeholder="Select TIN Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ssn">Social Security Number (SSN)</SelectItem>
                <SelectItem value="ein">Employer Identification Number (EIN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.w9TIN && <p className="text-red-500 text-sm">{errors.w9TIN}</p>}
        </div>
      </CardContent>
    </Card>
  )

  const FileUploadInput = ({
    label,
    fileState,
    setFileState,
    error,
  }: {
    label: string
    fileState: FileUploadState
    setFileState: React.Dispatch<React.SetStateAction<FileUploadState>>
    error?: string
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {fileState.preview ? (
        <div className="relative w-full border rounded-lg p-4">
          <img
            src={fileState.preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-contain mb-2"
          />

          <div className="flex items-center justify-between mb-2">
            {fileState.uploadStatus === "uploading" && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            )}
            {fileState.uploadStatus === "success" && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Upload successful</span>
              </div>
            )}
            {fileState.uploadStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{fileState.error || "Upload failed"}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {fileState.uploadStatus === "error" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileState.file && uploadFileToSupabase(fileState.file, setFileState)}
                disabled={fileState.uploadStatus === "uploading"}
              >
                Retry Upload
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFile(setFileState)}
              disabled={fileState.uploadStatus === "uploading"}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${error ? "border-red-500" : "border-gray-300"}`}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag & drop or click to upload</p>
          <p className="text-xs text-gray-500">Max size {MAX_FILE_SIZE_MB}MB</p>
          <p className="text-xs text-gray-500">PNG / JPG / PDF / HEIC / WEBP</p>
          <Input
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => handleFileChange(e, setFileState)}
            accept="image/png, image/jpeg, image/webp, image/heic, application/pdf"
          />
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )

  const renderUploadsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Document Uploads</CardTitle>
        <CardDescription>
          Please upload a clear copy of your Driver's License and a voided check. Files will be uploaded immediately.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <FileUploadInput
          label="Driver's License"
          fileState={driversLicense}
          setFileState={setDriversLicense}
          error={errors.driversLicense}
        />
        <FileUploadInput
          label="Voided Check"
          fileState={voidedCheck}
          setFileState={setVoidedCheck}
          error={errors.voidedCheck}
        />
      </CardContent>
    </Card>
  )

  const renderReviewStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Review Agreement & Sign</CardTitle>
        <CardDescription>
          Please review the partner agreement below. You must scroll to the bottom to enable the signature field.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea
          className="h-[600px] w-full border rounded-md p-6 bg-white"
          onScrollCapture={handleAgreementScroll}
          ref={agreementScrollRef}
        >
          <AgreementReview formData={formData} scheduleA={customScheduleA || defaultScheduleA} />
        </ScrollArea>
        {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}

        <div className={cn("space-y-4 transition-opacity", !hasScrolledAgreement && "opacity-50 pointer-events-none")}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="signatureFullName">Typed Signature (Full Legal Name)</Label>
              <Input
                id="signatureFullName"
                value={formData.signatureFullName}
                onChange={(e) => updateFormData("signatureFullName", e.target.value)}
                className={errors.signature ? "border-red-500" : ""}
              />
              {errors.signature && <p className="text-red-500 text-sm">{errors.signature}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signatureDate">Date</Label>
              <Input
                id="signatureDate"
                type="date"
                value={formData.signatureDate}
                onChange={(e) => updateFormData("signatureDate", e.target.value)}
                className={errors.signatureDate ? "border-red-500" : ""}
              />
              {errors.signatureDate && <p className="text-red-500 text-sm">{errors.signatureDate}</p>}
            </div>
          </div>
          <SignaturePreview signature={formData.signatureFullName} />
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="certification"
              checked={isCertified}
              onCheckedChange={(checked) => setIsCertified(checked as boolean)}
              disabled={!hasScrolledAgreement}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="certification"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Part II. Certification
              </label>
              <p className="text-sm text-muted-foreground">
                Under penalties of perjury, by signing above I certify that: 1. The number shown on this form is my
                correct taxpayer identification number. 2. I am not subject to backup withholding. 3. I am a U.S.
                citizen or other U.S. person. 4. The FATCA code(s) entered on this form (if any) indicating that I am
                exempt from FATCA reporting is correct.
              </p>
              {errors.certification && <p className="text-red-500 text-sm mt-1">{errors.certification}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  //  const renderReviewStep = () => (
  //    <Card>
  //      <CardHeader>
  //        <CardTitle>Review Agreement & Sign</CardTitle>
  //        <CardDescription>
  //          Please review the partner agreement below. You must scroll to the bottom to enable the signature field.
  //        </CardDescription>
  //      </CardHeader>
  //      <CardContent className="space-y-6">
  //        <ScrollArea
  //          className="h-96 w-full border rounded p-4"
  //          onScrollCapture={handleAgreementScroll}
  //          ref={agreementScrollRef}
  //        >
  //          <pre className="whitespace-pre-wrap font-sans text-sm">{getAgreementTextForDisplay()}</pre>
  //        </ScrollArea>
  //        {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}

  //        <div className={cn("space-y-4 transition-opacity", !hasScrolledAgreement && "opacity-50 pointer-events-none")}>
  //          <div className="grid md:grid-cols-2 gap-6">
  //            <div className="space-y-2">
  //              <Label htmlFor="signatureFullName">Typed Signature (Full Legal Name)</Label>
  //              <Input
  //                id="signatureFullName"
  //                value={formData.signatureFullName}
  //                onChange={(e) => updateFormData("signatureFullName", e.target.value)}
  //                className={errors.signature ? "border-red-500" : ""}
  //              />
  //              {errors.signature && <p className="text-red-500 text-sm">{errors.signature}</p>}
  //            </div>
  //            <div className="space-y-2">
  //              <Label htmlFor="signatureDate">Date</Label>
  //              <Input
  //                id="signatureDate"
  //                type="date"
  //                value={formData.signatureDate}
  //                onChange={(e) => updateFormData("signatureDate", e.target.value)}
  //                className={errors.signatureDate ? "border-red-500" : ""}
  //              />
  //              {errors.signatureDate && <p className="text-red-500 text-sm">{errors.signatureDate}</p>}
  //            </div>
  //          </div>
  //          <SignaturePreview signature={formData.signatureFullName} />
  //          <div className="flex items-start space-x-2 pt-2">
  //            <Checkbox
  //              id="certification"
  //              checked={isCertified}
  //              onCheckedChange={(checked) => setIsCertified(checked as boolean)}
  //              disabled={!hasScrolledAgreement}
  //            />
  //            <div className="grid gap-1.5 leading-none">
  //              <label
  //                htmlFor="certification"
  //                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  //              >
  //                Part II. Certification
  //              </label>
  //              <p className="text-sm text-muted-foreground">
  //                Under penalties of perjury, by signing above I certify that: 1. The number shown on this form is my
  //                correct taxpayer identification number. 2. I am not subject to backup withholding. 3. I am a U.S.
  //                citizen or other U.S. person. 4. The FATCA code(s) entered on this form (if any) indicating that I am
  //                exempt from FATCA reporting is correct.
  //              </p>
  //              {errors.certification && <p className="text-red-500 text-sm mt-1">{errors.certification}</p>}
  //            </div>
  //          </div>
  //        </div>
  //      </CardContent>
  //    </Card>
  //  )

  const renderConfirmationStep = () => (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        <CardTitle className="mt-4 text-2xl">Application Submitted!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Thank you for applying to the Lumino Partner Program. We have received your application and will be in touch
          shortly. You can download a copy of your submitted application for your records.
        </p>
        <Button onClick={handleDownloadPdf} className="mt-6" disabled={isDownloadingPdf}>
          {isDownloadingPdf ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Download Application PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderWelcomeStep(customMessage)
      case 1:
        return renderScheduleAStep(customScheduleA)
      case 2:
        return renderCodeOfConductStep()
      case 3:
        return renderPartnerInfoStep()
      case 4:
        return renderW9Step()
      case 5:
        return renderUploadsStep()
      case 6:
        return renderReviewStep()
      case 7:
        return renderConfirmationStep()
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!isSubmitted && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Lumino Partner Application</h1>
          <p className="text-lg text-gray-600 mt-2">Complete the following steps to join our partner program.</p>
        </div>
      )}

      {!isSubmitted && renderStepIndicator()}

      <div className="mt-8">{renderCurrentStep()}</div>

      {!isSubmitted && currentStep < 7 && (
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isSubmitting}>
            Back
          </Button>

          {currentStep < 6 ? (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!hasScrolledAgreement || !formData.signatureFullName || !isCertified || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          )}
        </div>
      )}

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center">Submission Failed</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {submitError ||
                "An unexpected error occurred while submitting your application. Please try again or contact support if the problem persists."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>Try Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">Application Submitted Successfully!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your partner application has been successfully submitted. We'll review your information and get back to
              you shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuickActions
        show={showQuickActions}
        applicationData={formData}
        scheduleAData={customScheduleA}
        fileUrls={{
          drivers_license_url: driversLicense.uploadedUrl,
          voided_check_url: voidedCheck.uploadedUrl,
        }}
      />
      <br />
      <br />
    </div>
  )
}
