interface ScheduleARow {
  category: string
  option1: string
  option2: string
  option3: string
  option4: string
}

interface ScheduleAData {
  equipment?: ScheduleARow
  associationFees?: ScheduleARow
  visaMcFee?: ScheduleARow
  otherTransactionFee?: ScheduleARow
  binSponsorship?: ScheduleARow
  amexOptBlue?: ScheduleARow
  monthlySupportFee?: ScheduleARow
  monthlyMinimum?: ScheduleARow
  chargebackFee?: ScheduleARow
  retrievalRequest?: ScheduleARow
  bonusProgram?: ScheduleARow
  saasFees?: ScheduleARow
  equipmentCost?: ScheduleARow
  sbaLoans?: ScheduleARow
  creditCards?: ScheduleARow
  bridgeLoans?: ScheduleARow
  equipmentFinancing?: ScheduleARow
  creditOptimization?: ScheduleARow
}

export const defaultScheduleA: ScheduleAData = {
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

function validateScheduleAData(data: any): ScheduleAData {
  if (!data || typeof data !== "object") {
    return defaultScheduleA
  }

  if (typeof data === "string") {
    try {
      data = JSON.parse(data)
    } catch {
      return defaultScheduleA
    }
  }

  if (typeof data !== "object" || Array.isArray(data)) {
    return defaultScheduleA
  }

  const validated: ScheduleAData = {}

  for (const key in defaultScheduleA) {
    const typedKey = key as keyof ScheduleAData
    if (data[typedKey] && typeof data[typedKey] === "object") {
      validated[typedKey] = {
        ...defaultScheduleA[typedKey]!,
        ...data[typedKey],
      }
    } else {
      validated[typedKey] = defaultScheduleA[typedKey]
    }
  }

  return validated
}

export function getAgreementText(
  formData: any,
  customScheduleA?: any,
  customCodeOfConduct?: any,
  customTerms?: any,
  customMessage?: any, // Added customMessage parameter
): Array<{ title: string; content: string }> {
  const scheduleA = validateScheduleAData(customScheduleA)

  const sections = [
    {
      title: "LUMINO PARTNER AGREEMENT",
      content: `${formData.partnerFullName || ""}\n${formData.businessName || ""}\nDate: ${formData.signatureDate || new Date().toLocaleDateString()}`,
    },
  ]

  if (customMessage?.sections && Array.isArray(customMessage.sections)) {
    sections.push({
      title: "WELCOME MESSAGE",
      content: formatCustomSections(customMessage.sections),
    })
  }

  sections.push(
    {
      title: "PARTNER INFORMATION",
      content: `Full Name: ${formData.partnerFullName || ""}
Email: ${formData.partnerEmail || ""}
Phone: ${formData.partnerPhone || ""}
Address: ${formData.partnerAddress || ""}
City: ${formData.partnerCity || ""}
State: ${formData.partnerState || ""}
ZIP Code: ${formData.partnerZip || ""}`,
    },
    {
      title: "BUSINESS INFORMATION",
      content: `Business Name: ${formData.businessName || ""}
Principal Name: ${formData.principalName || ""}
Federal Tax ID: ${formData.federalTaxId || ""}
Business Type: ${formData.businessType || ""}
Website URL: ${formData.websiteUrl || ""}
Address: ${formData.businessAddress || ""}
City: ${formData.businessCity || ""}
State: ${formData.businessState || ""}
ZIP Code: ${formData.businessZip || ""}`,
    },
    {
      title: "W-9 INFORMATION",
      content: `Name: ${formData.w9Name || ""}
Business Name: ${formData.w9BusinessName || ""}
Tax Classification: ${formData.w9TaxClassification || ""}
Address: ${formData.w9Address || ""}
City, State, ZIP: ${formData.w9CityStateZip || ""}`,
    },
    {
      title: "SCHEDULE A - FEE SCHEDULE",
      content: generateScheduleATable(scheduleA),
    },
    {
      title: "PARTNER'S CODE OF CONDUCT",
      content: customCodeOfConduct?.sections
        ? formatCustomSections(customCodeOfConduct.sections)
        : getCodeOfConductText(),
    },
    {
      title: "TERMS AND CONDITIONS",
      content: customTerms?.sections ? formatCustomSections(customTerms.sections) : getTermsAndConditions(),
    },
    {
      title: "SIGNATURES",
      content: `By signing below, both parties agree to be bound by the terms of this Agreement.

LUMINO TECHNOLOGIES, LLC

Signature: _________________________________

Name/Title: Zachry Godfrey, CEO

Date: ${new Date().toLocaleDateString()}


PARTNER

Signature: ${formData.signatureFullName || "_________________________________"}

Name: ${formData.partnerFullName || ""}

Date: ${formData.signatureDate || ""}`,
    },
  )

  return sections
}

function formatCustomSections(sections: any[]): string {
  if (!Array.isArray(sections)) return ""

  return sections
    .map((section) => {
      if (section.type === "header") {
        return `\n${section.content}\n`
      } else if (section.type === "paragraph") {
        return `${section.content}\n`
      }
      return ""
    })
    .join("\n")
}

function generateScheduleATable(scheduleA: ScheduleAData): string {
  const rows = [
    "Fee Category                                    Option 1              Option 2              Option 3              Option 4",
    "-".repeat(120),
  ]

  const orderOfRows: (keyof ScheduleAData)[] = [
    "equipment",
    "associationFees",
    "visaMcFee",
    "otherTransactionFee",
    "binSponsorship",
    "amexOptBlue",
    "monthlySupportFee",
    "monthlyMinimum",
    "chargebackFee",
    "retrievalRequest",
    "bonusProgram",
    "saasFees",
    "equipmentCost",
    "sbaLoans",
    "creditCards",
    "bridgeLoans",
    "equipmentFinancing",
    "creditOptimization",
  ]

  for (const key of orderOfRows) {
    const row = scheduleA[key]
    if (row) {
      rows.push(
        `${row.category.padEnd(48)} ${row.option1.padEnd(22)} ${row.option2.padEnd(22)} ${row.option3.padEnd(22)} ${row.option4}`,
      )
    }
  }

  return rows.join("\n")
}

function getCodeOfConductText(): string {
  return `All advertisements and materials involved in or related to the sale of a product or service, or which contain or refer to a name, trade or service mark, products, services, etc., must be approved in writing by Lumino and in advance of their use.

The use of the Internet for marketing products and services is subject to the same policies and procedures applicable to written or printed material.

EXPERIENCED PARTNERS

Lumino recommends that you seek legal advice pertaining to the operation of any ADAD equipment. This document is not intended as a replacement for sound legal advice, and the use of ADAD equipment is entirely your decision and responsibility.

AUTOMATED DIALER AND ANNOUNCING DEVICE (ADAD) COMPLIANCE

In the following states, ADAD delivered business-to-business sales calls are extremely forbidden: Arkansas (criminal), Maryland (criminal), Mississippi (civil), North Carolina (civil), Washington (civil), and Wyoming (criminal).

CONFIDENTIALITY

In your role as a Lumino Partner, you will possess confidential information about your Merchant and Lumino. A breach of confidentiality can have serious consequences.

VIOLATION OF LUMINO POLICY

The purpose of policies and procedures is to ensure Lumino's ability to provide the highest quality products and services to its Merchants and Partners.`
}

function getTermsAndConditions(): string {
  return `PARTNER AGREEMENT

This Partner Agreement ("Agreement") is entered into as of the date of execution between Lumino Technologies, LLC ("Company") and the Partner identified in the application ("Partner").

1. APPOINTMENT AND SCOPE
Company appoints Partner as a non-exclusive independent contractor to promote and refer potential clients for Company's payment processing and financial services as detailed in Schedule A.

2. COMPENSATION
Partner shall receive compensation according to the fee schedule outlined in Schedule A.

3. TERM AND TERMINATION
This Agreement shall commence on the date of execution and continue until terminated by either party with thirty (30) days written notice.

4. INDEPENDENT CONTRACTOR STATUS
Partner is an independent contractor and not an employee, agent, or legal representative of Company.

5. CONFIDENTIALITY
Partner agrees to maintain the confidentiality of all proprietary information.

6. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware.`
}
