import jsPDF from "jspdf"

interface ScheduleARow {
  category: string
  option1: string
  option2: string
  option3: string
  option4?: string
}

interface ScheduleAData {
  [key: string]: ScheduleARow
}

const defaultScheduleA: ScheduleAData = {
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

const defaultTermsText = `PARTNER AGREEMENT

This Partner Agreement ("Agreement") is entered into as of the date of execution between Lumino Technologies, LLC ("Company") and the Partner identified in the application ("Partner").

1. APPOINTMENT AND SCOPE

Company appoints Partner as a non-exclusive independent contractor to promote and refer potential clients for Company's payment processing and financial services as detailed in Schedule A.

2. COMPENSATION

Partner shall receive compensation according to the fee schedule outlined in Schedule A, which is attached hereto and incorporated by reference. All fees are subject to successful onboarding and activation of referred clients.

3. TERM AND TERMINATION

This Agreement shall commence on the date of execution and continue until terminated by either party with thirty (30) days written notice. Upon termination, Partner shall be entitled to compensation for all approved referrals made prior to the termination date.

4. INDEPENDENT CONTRACTOR STATUS

Partner is an independent contractor and not an employee, agent, or legal representative of Company. Partner shall not have the authority to bind Company to any obligation.

5. CONFIDENTIALITY

Partner agrees to maintain the confidentiality of all proprietary information, trade secrets, and client data received from Company during the term of this Agreement and for a period of two (2) years following termination.

6. COMPLIANCE

Partner agrees to comply with all applicable federal, state, and local laws and regulations in the performance of services under this Agreement, including but not limited to payment card industry data security standards (PCI DSS).

7. REPRESENTATIONS AND WARRANTIES

Partner represents and warrants that:
a) Partner has the full right, power, and authority to enter into this Agreement
b) Partner will perform services in a professional and workmanlike manner
c) Partner will not make any false, misleading, or deceptive statements regarding Company's services
d) All information provided in the application is true, accurate, and complete

8. INDEMNIFICATION

Partner agrees to indemnify, defend, and hold harmless Company from any claims, damages, losses, or expenses arising from Partner's breach of this Agreement or negligent acts or omissions.

9. LIMITATION OF LIABILITY

Company's total liability under this Agreement shall not exceed the total compensation paid to Partner in the twelve (12) months preceding any claim.

10. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflicts of law principles.

11. ENTIRE AGREEMENT

This Agreement, including Schedule A, constitutes the entire agreement between the parties and supersedes all prior agreements, understandings, and communications, whether written or oral, relating to the subject matter hereof.

12. AMENDMENTS

This Agreement may only be amended by a written instrument signed by both parties.

13. ASSIGNMENT

Partner may not assign this Agreement without the prior written consent of Company.

14. SEVERABILITY

If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

15. NOTICES

All notices under this Agreement shall be in writing and sent to the email addresses provided in the application or such other addresses as may be designated by either party in writing.`

const defaultCodeOfConduct = `All advertisements and materials involved in or related to the sale of a product or service, or which contain or refer to a name, trade or service mark, products, services, etc., must be approved in writing by Lumino and in advance of their use. The use of the Internet for marketing products and services is subject to the same policies and procedures applicable to written or printed material.

Please note that to help all of our partners maintain compliance with the Visa/MasterCard regulations regarding the advertisement of card processing services on the Internet, all of the Visa/MasterCard regulations must be met in addition to the following:

The following endorsement statement must appear at the bottom of the website's homepage, "about us" page and any website pages displaying Visa/MasterCard logos and/or text or advertising for Merchant services: "All Merchant Accounts are referred to and processing services are provided by Lumino."

Credit card logos cannot appear on your website unless you accept those credit cards as a form of payment, and may not appear on any page advertising for Merchant processing services unless the above requirement is met.

If you choose to use an "apply now" feature for online Merchant applications, you must have a link on your site to your company-branded web page.

In addition to the above Visa/MasterCard marketing regulations, there exist legal restrictions or prohibitions on some forms of advertising, notably, but not limited to, fax advertising (entirely prohibited in the US), email solicitation, and automated dialers/announcing devices ("ADAD").

While the above-mentioned Visa/MasterCard regulations still apply, Lumino has an obligation to notify our partners of the importance of familiarizing themselves with the various laws surrounding the use of automated dialers/announcing devices. These laws vary in scope and severity based on jurisdictional differences.

Lumino recommends that you seek legal advice pertaining to the operation of any ADAD equipment. This document is not intended as a replacement for sound legal advice, and the use of ADAD equipment is entirely your decision and responsibility.

AUTOMATED DIALER AND ANNOUNCING DEVICE (ADAD) COMPLIANCE

In the following states, ADAD delivered business-to-business sales calls are extremely forbidden (whether according to criminal statutes or civil regulations): Arkansas (criminal), Maryland (criminal), Mississippi (civil), North Carolina (civil), Washington (civil), and Wyoming (criminal).

The following states allow business-to-business ADAD calls without restrictions: Alabama, Alaska, Arizona, Connecticut, Delaware, Florida, Georgia, Hawaii, Kansas, Louisiana, Missouri, Ohio, Oregon, South Carolina, South Dakota, Texas, Vermont, Virginia, and West Virginia.

Several states impose various time, place, and manner restrictions. These types of restrictions tend to limit the hours during which ADAD calls can be made (typically between 9 a.m. and 9 p.m.), require a short period after hang-up for the call to be disconnected (the range tends to be between five and thirty seconds) and mandate that the name and contact information of the business for whom the call is being made be provided at the start of the call.

The states with some combination of these fairly manageable ADAD regulations are the following: Idaho, Maine, Massachusetts, Nebraska, Nevada, New York, and Rhode Island.

Two states require that the operator of ADAD equipment register with, or obtain a permit from, the state. These states are: New Hampshire and Tennessee.

Several states have imposed fairly onerous restrictions upon those businesses that attempt to solicit sales through the use of business-to-business ADAD calls. Some of these states require that live operators introduce the recorded call, that ADAD calls can only be made to businesses with whom the caller has a prior relationship or has otherwise consented to receive ADAD calls, and that the ADAD equipment only operates while it is attended.

The following states require that a live operator introduce an ADAD call, or otherwise be available during the call: California, Indiana, and Iowa.

Three states require that ADAD calls must be introduced by a live operator unless the recipient has previously consented to receiving such calls: New Jersey, North Dakota and Oklahoma.

Several states only allow ADAD calls to be made if there is a prior business relationship between the recipient and the caller: Colorado, District of Columbia, Illinois, New Mexico, and Utah.

Express consent is required to be given by the recipient before ADAD calls can be made to businesses in the following states: Michigan, Minnesota, Montana, and Wisconsin.

One state requires that ADAD equipment be attended to: Kentucky.

Comparative or competitive information must be approved in advance by Lumino, like any other form of sales material. Comparisons must be true, current, dated, and factual.

Any materials identified as "For Internal Use Only" shall not be used by the public.

RECORD KEEPING AND AUDITS

Accurate and reliable records are necessary to meet both your professional responsibilities and Lumino's legal and financial obligations. Because of this, you are required to keep up-to-date records and files of any transactions, correspondence, documentation, etc. involving your clients.

You must make your records involving products and services available to Lumino for general auditing purposes or to enable Lumino to respond to any regulatory or administrative action against Lumino or yourself.

NOTE: Any cost associated with any legal actions involving Lumino as a part of the defendant will be deducted from the residual income of the Partner and may result in a material breach of the Partner agreement.

CONFIDENTIALITY

In your role as a Lumino Partner, you will possess confidential information about your Merchant and Lumino. A breach of confidentiality can have serious consequences. Therefore, you must safeguard all confidential Merchant and Lumino information and only provide access to individuals who have a legitimate right to it.

You are responsible for maintaining the security of all confidential information in your possession, which shall be held at all times in strict confidence, and you hereby agree to indemnify, defend, and hold harmless Lumino from any financial, reputational, or other damage that results from your breach of this paragraph.

The confidentiality obligations contained herein are in addition to, and not in lieu of, similar or greater obligations contained in the Partner Agreement or elsewhere agreed between you and Lumino.

VIOLATION OF LUMINO POLICY

The purpose of policies and procedures is to ensure Lumino's ability to provide the highest quality products and services to its Merchants and Partners. In order to protect the solid reputation of Lumino and its Partners, appropriate action (verbal or written, contract termination or prosecution) will be taken by Lumino on all known violations of its policies and procedures.

Lumino requires all Partners to abide by its policies and procedures. Due to frequent law changes, these compliances are subject to change. Partners will be responsible for being up-to-date with current regulations.`

// Helper function to safely extract text from JSONB or text field
function extractText(field: any, defaultText: string): string {
  if (!field) return defaultText
  
  // If it's already a string, return it
  if (typeof field === 'string') {
    // Try to parse if it looks like JSON
    if (field.trim().startsWith('{') || field.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(field)
        if (typeof parsed === 'string') return parsed
        if (parsed.text) return parsed.text
        if (parsed.content) return parsed.content
      } catch (e) {
        // If parse fails, return as-is
        return field
      }
    }
    return field
  }
  
  // If it's an object, look for common text fields
  if (typeof field === 'object') {
    if (field.text) return field.text
    if (field.content) return field.content
    if (field.value) return field.value
  }
  
  return defaultText
}

// Helper to add text with proper wrapping and pagination
function addWrappedText(
  doc: jsPDF,
  text: string,
  xPos: number,
  yPos: number,
  maxWidth: number,
  lineHeight: number,
  pageHeight: number,
  margin: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  
  lines.forEach((line: string) => {
    if (yPos > pageHeight - margin - 10) {
      doc.addPage()
      yPos = margin
    }
    doc.text(line, xPos, yPos)
    yPos += lineHeight
  })
  
  return yPos
}

export async function generateCompleteAgreementPDF(application: any) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = 20

  // Extract custom fields with fallbacks
  const customMessage = extractText(application.custom_message, '')
  const termsText = extractText(application.custom_terms, application.agreement_text || defaultTermsText)
  const codeOfConduct = extractText(application.custom_code_of_conduct, defaultCodeOfConduct)

  // Cover Page
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("LUMINO PARTNER AGREEMENT", pageWidth / 2, yPos + 40, { align: "center" })

  yPos += 60
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  if (application.partner_full_name) {
    doc.text(application.partner_full_name, pageWidth / 2, yPos, { align: "center" })
    yPos += 10
  }
  if (application.business_name) {
    doc.text(application.business_name, pageWidth / 2, yPos, { align: "center" })
    yPos += 10
  }
  if (application.created_at) {
    doc.text(`Date: ${new Date(application.created_at).toLocaleDateString()}`, pageWidth / 2, yPos, { align: "center" })
  }

  // Custom Message (if exists)
  if (customMessage) {
    yPos += 30
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    yPos = addWrappedText(doc, customMessage, margin, yPos, pageWidth - 2 * margin, 7, pageHeight, margin)
  }

  // Partner Information Page
  doc.addPage()
  yPos = margin

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("PARTNER INFORMATION", margin, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const partnerInfo = [
    { label: "Full Name", value: application.partner_full_name },
    { label: "Email", value: application.partner_email },
    { label: "Phone", value: application.partner_phone },
    { label: "Address", value: application.partner_address },
    { label: "City", value: application.partner_city },
    { label: "State", value: application.partner_state },
    { label: "ZIP Code", value: application.partner_zip },
  ]

  partnerInfo.forEach((item) => {
    if (item.value) {
      doc.setFont("helvetica", "bold")
      doc.text(`${item.label}:`, margin, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(String(item.value), margin + 50, yPos)
      yPos += 7
    }
  })

  yPos += 10
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("BUSINESS INFORMATION", margin, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const businessInfo = [
    { label: "Business Name", value: application.business_name },
    { label: "Principal Name", value: application.principal_name },
    { label: "Federal Tax ID", value: application.federal_tax_id },
    { label: "Business Type", value: application.business_type },
    { label: "Website URL", value: application.website_url },
    { label: "Address", value: application.business_address },
    { label: "City", value: application.business_city },
    { label: "State", value: application.business_state },
    { label: "ZIP Code", value: application.business_zip },
  ]

  businessInfo.forEach((item) => {
    if (item.value) {
      if (yPos > pageHeight - 30) {
        doc.addPage()
        yPos = margin
      }
      doc.setFont("helvetica", "bold")
      doc.text(`${item.label}:`, margin, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(String(item.value), margin + 50, yPos)
      yPos += 7
    }
  })

  // W-9 Information
  if (yPos > pageHeight - 80) {
    doc.addPage()
    yPos = margin
  } else {
    yPos += 10
  }

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("W-9 INFORMATION", margin, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const w9Info = [
    { label: "Name", value: application.w9_name },
    { label: "Business Name", value: application.w9_business_name },
    { label: "Tax Classification", value: application.w9_tax_classification },
    { label: "Address", value: application.w9_address },
    { label: "City, State, ZIP", value: application.w9_city_state_zip },
    { label: "TIN Type", value: application.w9_tin_type?.toUpperCase() || application.w9_t_i_n_type?.toUpperCase() },
    { label: "TIN", value: (application.w9_tin || application.w9_t_i_n) ? "***-**-" + (application.w9_tin || application.w9_t_i_n).slice(-4) : undefined },
  ]

  w9Info.forEach((item) => {
    if (item.value) {
      doc.setFont("helvetica", "bold")
      doc.text(`${item.label}:`, margin, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(String(item.value), margin + 50, yPos)
      yPos += 7
    }
  })

  // Schedule A - WITH PROPER TABLE BORDERS
  doc.addPage()
  yPos = margin

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("SCHEDULE A - FEE SCHEDULE", margin, yPos)
  yPos += 15

  let scheduleData = application.custom_schedule_a

  if (scheduleData && typeof scheduleData === "string") {
    try {
      scheduleData = JSON.parse(scheduleData)
      if (typeof scheduleData === "string") {
        scheduleData = JSON.parse(scheduleData)
      }
    } catch (e) {
      console.error("Error parsing schedule A:", e)
      scheduleData = null
    }
  }

  const displaySchedule = scheduleData || defaultScheduleA

  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")

  // Table setup with borders
  const tableStartY = yPos
  const colWidths = [70, 25, 25, 25, 25]
  const rowHeight = 8
  const headers = ["Fee Category", "Option 1", "Option 2", "Option 3", "Option 4"]

  // Draw header row with background
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, yPos - 5, colWidths.reduce((a, b) => a + b, 0), rowHeight, "F")
  
  let xPos = margin
  headers.forEach((header, i) => {
    doc.setDrawColor(0, 0, 0)
    doc.rect(xPos, yPos - 5, colWidths[i], rowHeight, "S")
    doc.text(header, xPos + 2, yPos)
    xPos += colWidths[i]
  })
  yPos += rowHeight

  doc.setFont("helvetica", "normal")

  // Draw data rows
  Object.entries(displaySchedule).forEach(([key, row]: [string, any]) => {
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = margin

      // Reprint headers on new page
      doc.setFont("helvetica", "bold")
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, yPos - 5, colWidths.reduce((a, b) => a + b, 0), rowHeight, "F")
      
      xPos = margin
      headers.forEach((header, i) => {
        doc.rect(xPos, yPos - 5, colWidths[i], rowHeight, "S")
        doc.text(header, xPos + 2, yPos)
        xPos += colWidths[i]
      })
      yPos += rowHeight
      doc.setFont("helvetica", "normal")
    }

    const rowStartY = yPos - 5
    xPos = margin

    // Draw each cell with border
    const cellData = [
      row.category || "-",
      row.option1 || "-",
      row.option2 || "-",
      row.option3 || "-",
      row.option4 || "-"
    ]

    let maxCellHeight = rowHeight
    cellData.forEach((data, i) => {
      const lines = doc.splitTextToSize(data, colWidths[i] - 4)
      const cellHeight = Math.max(lines.length * 4, rowHeight)
      if (cellHeight > maxCellHeight) maxCellHeight = cellHeight
    })

    // Draw cells
    cellData.forEach((data, i) => {
      doc.rect(xPos, rowStartY, colWidths[i], maxCellHeight, "S")
      const lines = doc.splitTextToSize(data, colWidths[i] - 4)
      lines.forEach((line: string, lineIdx: number) => {
        doc.text(line, xPos + 2, yPos + (lineIdx * 4))
      })
      xPos += colWidths[i]
    })

    yPos += maxCellHeight
  })

  // Terms and Conditions
  doc.addPage()
  yPos = margin

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("TERMS AND CONDITIONS", margin, yPos)
  yPos += 15

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")

  const termsLines = termsText.split("\n")
  termsLines.forEach((line) => {
    if (yPos > pageHeight - 25) {
      doc.addPage()
      yPos = margin
    }

    if (line.trim() === "") {
      yPos += 4
    } else {
      yPos = addWrappedText(doc, line, margin, yPos, pageWidth - 2 * margin, 4.5, pageHeight, margin)
    }
  })

  // Partner's Code of Conduct
  doc.addPage()
  yPos = margin

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("PARTNER'S CODE OF CONDUCT", margin, yPos)
  yPos += 15

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")

  const conductLines = codeOfConduct.split("\n")
  conductLines.forEach((line) => {
    if (yPos > pageHeight - 25) {
      doc.addPage()
      yPos = margin
    }

    if (line.trim() === "") {
      yPos += 4
    } else {
      yPos = addWrappedText(doc, line, margin, yPos, pageWidth - 2 * margin, 4.5, pageHeight, margin)
    }
  })

  // Signature Section
  doc.addPage()
  yPos = margin

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("SIGNATURES", margin, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("By signing below, both parties agree to be bound by the terms of this Agreement.", margin, yPos)
  yPos += 20

  // Lumino Signature
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("LUMINO TECHNOLOGIES, LLC", margin, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  
  // Draw signature line
  doc.setDrawColor(0, 0, 0)
  doc.line(margin + 20, yPos + 5, margin + 100, yPos + 5)
  
  // Add CEO signature image ABOVE the line
  try {
    const signatureImg = new Image()
    signatureImg.crossOrigin = "anonymous"
    signatureImg.src = "/images/ceo-signature.png"

    await new Promise((resolve, reject) => {
      signatureImg.onload = () => {
        // Position signature to sit ON the line
        doc.addImage(signatureImg, "PNG", margin + 25, yPos - 10, 50, 15)
        resolve(true)
      }
      signatureImg.onerror = reject
      setTimeout(reject, 5000)
    })
  } catch (error) {
    console.error("Could not load CEO signature image:", error)
  }

  yPos += 10
  doc.text("Name/Title: Zachry Godfrey, CEO", margin, yPos)
  yPos += 7
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos)

  // Partner Signature Section
  yPos += 25

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("PARTNER", margin, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  
  // Draw signature line
  doc.line(margin + 20, yPos + 5, margin + 100, yPos + 5)

  // Add partner signature if available - USING CORRECT FIELD NAME
  if (application.code_of_conduct_signature) {
    try {
      const partnerSigImg = new Image()
      partnerSigImg.crossOrigin = "anonymous"
      partnerSigImg.src = application.code_of_conduct_signature

      await new Promise((resolve, reject) => {
        partnerSigImg.onload = () => {
          // Position signature to sit ON the line
          doc.addImage(partnerSigImg, "PNG", margin + 25, yPos - 10, 50, 15)
          resolve(true)
        }
        partnerSigImg.onerror = reject
        setTimeout(reject, 5000)
      })
    } catch (error) {
      console.error("Could not load partner signature image:", error)
    }
  } else if (application.partner_full_name) {
    // If no signature image, display typed name
    doc.setFont("helvetica", "italic")
    doc.text(`/s/ ${application.partner_full_name}`, margin + 25, yPos)
    doc.setFont("helvetica", "normal")
  }

  yPos += 10
  const signerName = application.signature_full_name || application.partner_full_name || "[Partner Name]"
  doc.text(`Name: ${signerName}`, margin, yPos)

  yPos += 7
  const sigDate = application.code_of_conduct_date || application.signature_date
  doc.text(
    `Date: ${sigDate ? new Date(sigDate).toLocaleDateString() : "[Date]"}`,
    margin,
    yPos,
  )

  // Electronic Execution Acknowledgment
  yPos += 20

  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  
  // Checkbox
  doc.setDrawColor(0, 0, 0)
  doc.rect(margin, yPos - 2.5, 3.5, 3.5, "S")
  doc.text("✓", margin + 0.5, yPos + 1.5)

  doc.text("Electronic Execution Acknowledgment", margin + 6, yPos + 1)
  yPos += 7

  doc.setFont("helvetica", "normal")
  const executionDate = (application.code_of_conduct_date || application.signature_date)
    ? new Date(application.code_of_conduct_date || application.signature_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "[Date]"

  const acknowledgmentText = `This Agreement was accepted and executed electronically as of ${executionDate} by ${signerName}. The parties acknowledge that electronic signatures have the same legal effect as handwritten signatures.`

  yPos = addWrappedText(doc, acknowledgmentText, margin + 6, yPos, pageWidth - 2 * margin - 6, 4.5, pageHeight, margin)

  // Save PDF
  const timestamp = new Date().toISOString().slice(0, 10)
  const partnerName = application.partner_full_name
    ? application.partner_full_name.replace(/[^a-zA-Z0-9]/g, "-")
    : "Partner"
  doc.save(`Lumino-Partner-Agreement-${partnerName}-${timestamp}.pdf`)
}
