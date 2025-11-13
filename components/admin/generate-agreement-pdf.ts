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

export async function generateCompleteAgreementPDF(application: any) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = 20

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

  if (application.custom_message) {
    doc.addPage()
    yPos = 20

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("WELCOME MESSAGE", margin, yPos)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    let customMessage = application.custom_message

    // Parse if it's a string
    if (typeof customMessage === "string") {
      try {
        customMessage = JSON.parse(customMessage)
        if (typeof customMessage === "string") {
          customMessage = JSON.parse(customMessage)
        }
      } catch (e) {
        console.error("Error parsing custom message:", e)
      }
    }

    // Render custom message sections
    if (customMessage?.sections && Array.isArray(customMessage.sections)) {
      customMessage.sections.forEach((section: any) => {
        if (yPos > pageHeight - 25) {
          doc.addPage()
          yPos = 20
        }

        if (section.type === "header") {
          doc.setFont("helvetica", "bold")
          doc.setFontSize(12)
          const headerLines = doc.splitTextToSize(section.content, pageWidth - 2 * margin)
          headerLines.forEach((line: string) => {
            if (yPos > pageHeight - 25) {
              doc.addPage()
              yPos = 20
            }
            doc.text(line, margin, yPos)
            yPos += 6
          })
          yPos += 3
        } else if (section.type === "paragraph") {
          doc.setFont("helvetica", "normal")
          doc.setFontSize(10)
          const paraLines = doc.splitTextToSize(section.content, pageWidth - 2 * margin)
          paraLines.forEach((line: string) => {
            if (yPos > pageHeight - 25) {
              doc.addPage()
              yPos = 20
            }
            doc.text(line, margin, yPos)
            yPos += 5
          })
          yPos += 5
        }
      })
    }
  }

  // Partner Information Page
  doc.addPage()
  yPos = 20

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
        yPos = 20
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
    yPos = 20
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
    { label: "TIN Type", value: application.w9_tin_type?.toUpperCase() },
    { label: "TIN", value: application.w9_tin ? "***-**-" + application.w9_tin.slice(-4) : undefined },
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

  // Schedule A
  doc.addPage()
  yPos = 20

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
  doc.setFont("helvetica", "normal")

  // Fixed column widths to prevent overlap
  const colWidths = [60, 27, 27, 27, 27]
  const headers = ["Fee Category", "Option 1", "Option 2", "Option 3", "Option 4"]

  doc.setFont("helvetica", "bold")
  let xPos = margin
  headers.forEach((header, i) => {
    doc.text(header, xPos, yPos)
    xPos += colWidths[i]
  })
  yPos += 6

  doc.setFont("helvetica", "normal")

  Object.entries(displaySchedule).forEach(([key, row]: [string, any]) => {
    if (yPos > pageHeight - 20) {
      doc.addPage()
      yPos = 20

      // Reprint headers on new page
      doc.setFont("helvetica", "bold")
      xPos = margin
      headers.forEach((header, i) => {
        doc.text(header, xPos, yPos)
        xPos += colWidths[i]
      })
      yPos += 6
      doc.setFont("helvetica", "normal")
    }

    xPos = margin

    // Category - wrap text to fit column width
    const categoryLines = doc.splitTextToSize(row.category, colWidths[0] - 2)
    doc.text(categoryLines, xPos, yPos)
    const categoryHeight = categoryLines.length * 3.5

    xPos += colWidths[0]
    // Option 1 - wrap text
    const opt1Lines = doc.splitTextToSize(row.option1 || "-", colWidths[1] - 2)
    doc.text(opt1Lines, xPos, yPos)
    const opt1Height = opt1Lines.length * 3.5

    xPos += colWidths[1]
    // Option 2 - wrap text
    const opt2Lines = doc.splitTextToSize(row.option2 || "-", colWidths[2] - 2)
    doc.text(opt2Lines, xPos, yPos)
    const opt2Height = opt2Lines.length * 3.5

    xPos += colWidths[2]
    // Option 3 - wrap text
    const opt3Lines = doc.splitTextToSize(row.option3 || "-", colWidths[3] - 2)
    doc.text(opt3Lines, xPos, yPos)
    const opt3Height = opt3Lines.length * 3.5

    xPos += colWidths[3]
    // Option 4 - wrap text
    const opt4Lines = doc.splitTextToSize(row.option4 || "-", colWidths[4] - 2)
    doc.text(opt4Lines, xPos, yPos)
    const opt4Height = opt4Lines.length * 3.5

    // Move to next row based on tallest column
    const maxHeight = Math.max(categoryHeight, opt1Height, opt2Height, opt3Height, opt4Height)
    yPos += maxHeight + 2.5
  })

  // Terms and Conditions
  doc.addPage()
  yPos = 20

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("TERMS AND CONDITIONS", margin, yPos)
  yPos += 15

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")

  const termsText = `PARTNER AGREEMENT

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

  const termsLines = termsText.split("\n")

  termsLines.forEach((line) => {
    if (yPos > pageHeight - 25) {
      doc.addPage()
      yPos = 20
    }

    if (line.trim() === "") {
      yPos += 3
    } else {
      const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin)
      wrappedLines.forEach((wrappedLine: string) => {
        if (yPos > pageHeight - 25) {
          doc.addPage()
          yPos = 20
        }
        doc.text(wrappedLine, margin, yPos)
        yPos += 4
      })
    }
  })

  // Partner Code of Conduct
  doc.addPage()
  yPos = 20

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("PARTNER'S CODE OF CONDUCT", margin, yPos)
  yPos += 15

  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")

  const codeOfConduct = `All advertisements and materials involved in or related to the sale of a product or service, or which contain or refer to a name, trade or service mark, products, services, etc., must be approved in writing by Lumino and in advance of their use. The use of the Internet for marketing products and services is subject to the same policies and procedures applicable to written or printed material.

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

  const conductLines = codeOfConduct.split("\n")

  conductLines.forEach((line) => {
    if (yPos > pageHeight - 25) {
      doc.addPage()
      yPos = 20
    }

    if (line.trim() === "") {
      yPos += 3
    } else {
      const wrappedLines = doc.splitTextToSize(line, pageWidth - 2 * margin)
      wrappedLines.forEach((wrappedLine: string) => {
        if (yPos > pageHeight - 25) {
          doc.addPage()
          yPos = 20
        }
        doc.text(wrappedLine, margin, yPos)
        yPos += 4
      })
    }
  })

  // Signature Section
  doc.addPage()
  yPos = 20

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("SIGNATURES", margin, yPos)
  yPos += 15

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("By signing below, both parties agree to be bound by the terms of this Agreement.", margin, yPos)
  yPos += 20

  // Lumino Signature
  doc.setFont("helvetica", "bold")
  doc.text("LUMINO TECHNOLOGIES, LLC", margin, yPos)
  yPos += 15 // Changed from 10 to 15 - more space before signature line

  doc.setFont("helvetica", "normal")
  doc.text("Signature: _________________________________", margin, yPos)
  yPos -= 10 // Move UP to place signature ABOVE the line

  // Add signature image
  try {
    const signatureImg = new Image()
    signatureImg.crossOrigin = "anonymous"
    signatureImg.src = "/images/ceo-signature.png"

    await new Promise((resolve, reject) => {
      signatureImg.onload = () => {
        doc.addImage(signatureImg, "PNG", margin + 20, yPos, 60, 18)
        resolve(true)
      }
      signatureImg.onerror = reject
      setTimeout(reject, 5000)
    })
  } catch (error) {
    console.error("Could not load signature image:", error)
  }

  yPos += 25 // Move past the signature line to the Name/Title
  doc.text("Name/Title: Zachry Godfrey, CEO", margin, yPos)
  yPos += 10
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos)

  // Partner Signature Section
  yPos += 30

  doc.setFont("helvetica", "bold")
  doc.text("PARTNER", margin, yPos)
  yPos += 15 // Increased spacing before signature line

  doc.setFont("helvetica", "normal")
  doc.text("Signature: _________________________________", margin, yPos)

  if (application.signature_data_url) {
    yPos -= 10 // Move up to place signature above the line
    try {
      const partnerSigImg = new Image()
      partnerSigImg.crossOrigin = "anonymous"
      partnerSigImg.src = application.signature_data_url

      await new Promise((resolve, reject) => {
        partnerSigImg.onload = () => {
          doc.addImage(partnerSigImg, "PNG", margin + 20, yPos, 60, 18)
          resolve(true)
        }
        partnerSigImg.onerror = reject
        setTimeout(reject, 5000)
      })
    } catch (error) {
      console.error("Could not load partner signature image:", error)
    }
    yPos += 10 // Move back down
  }

  yPos += 15
  // Use signature_full_name if available, otherwise fall back to partner_full_name
  const signerName = application.signature_full_name || application.partner_full_name || "[Partner Name]"
  doc.text(`Name: ${signerName}`, margin, yPos)

  yPos += 10
  doc.text(
    `Date: ${application.signature_date ? new Date(application.signature_date).toLocaleDateString() : "[Date]"}`,
    margin,
    yPos,
  )

  // Electronic Execution Acknowledgment
  yPos += 30

  // Add checkbox with checkmark
  doc.setFillColor(0, 0, 0) // Black fill for checkmark
  doc.setDrawColor(0, 0, 0) // Black border
  doc.rect(margin, yPos - 3, 4, 4, "S") // Draw checkbox outline

  // Draw checkmark inside the box
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("✓", margin + 0.3, yPos + 1.5) // Position checkmark inside box

  yPos += 2
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("Electronic Execution Acknowledgment", margin + 8, yPos)
  yPos += 8

  doc.setFont("helvetica", "normal")
  const executionDate = application.signature_date
    ? new Date(application.signature_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "[Date]"

  const acknowledgmentText = `This Agreement was accepted and executed electronically as of ${executionDate} by ${signerName}. The parties acknowledge that electronic signatures have the same legal effect as handwritten signatures.`

  const wrappedAcknowledgment = doc.splitTextToSize(acknowledgmentText, pageWidth - 2 * margin - 10)
  wrappedAcknowledgment.forEach((line: string) => {
    doc.text(line, margin + 8, yPos)
    yPos += 5
  })

  // Save PDF
  const timestamp = new Date().toISOString().slice(0, 10)
  const partnerName = application.partner_full_name
    ? application.partner_full_name.replace(/[^a-zA-Z0-9]/g, "-")
    : "Partner"
  doc.save(`Complete-Agreement-${partnerName}-${timestamp}.pdf`)
}
