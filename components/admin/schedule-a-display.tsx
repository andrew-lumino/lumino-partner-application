"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface ScheduleADisplayProps {
  application: {
    partner_full_name?: string
    business_name?: string
    created_at?: string
    custom_schedule_a?: ScheduleAData | string | null
  }
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

const downloadCSV = (scheduleData: ScheduleAData, application: any) => {
  const headers = ["Fee Category", "Option 1", "Option 2", "Option 3", "Option 4"]
  const csvRows = [headers.join(",")]

  Object.entries(scheduleData).forEach(([key, row]) => {
    const csvRow = [
      `"${row.category}"`,
      `"${row.option1 || "-"}"`,
      `"${row.option2 || "-"}"`,
      `"${row.option3 || "-"}"`,
      `"${row.option4 || "-"}"`,
    ]
    csvRows.push(csvRow.join(","))
  })

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)

  const timestamp = new Date().toISOString().slice(0, 10)
  const partnerName = application?.partner_full_name
    ? application.partner_full_name.replace(/[^a-zA-Z0-9]/g, "-")
    : "Partner"

  link.setAttribute("download", `Schedule-A-${partnerName}-${timestamp}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function ScheduleADisplay({ application }: ScheduleADisplayProps) {
  // Parse custom schedule A safely
  let scheduleData = application?.custom_schedule_a

  // Handle JSON parsing for stringified data
  if (scheduleData && typeof scheduleData === "string") {
    try {
      scheduleData = JSON.parse(scheduleData)
      // Check if it's still a string (double-encoded)
      if (typeof scheduleData === "string") {
        scheduleData = JSON.parse(scheduleData)
      }
    } catch (e) {
      console.error("Error parsing custom_schedule_a:", e)
      scheduleData = null
    }
  }

  const isCustom = !!scheduleData
  const displayData = (scheduleData as ScheduleAData) || defaultScheduleA

  const isValueCustom = (key: string, field: keyof ScheduleARow): boolean => {
    if (!isCustom || !scheduleData) return false
    const customRow = (scheduleData as ScheduleAData)[key]
    const defaultRow = defaultScheduleA[key]
    if (!customRow || !defaultRow) return false
    return customRow[field] !== defaultRow[field]
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Schedule A - Fee Schedule</CardTitle>
            {isCustom && <Badge variant="secondary">Custom Schedule</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold bg-gray-50 min-w-[200px] whitespace-normal break-words">
                    Fee Category
                  </th>
                  <th className="text-left p-3 font-semibold bg-gray-50 min-w-[140px] whitespace-normal">
                    Option 1<br />
                    <span className="text-xs font-normal text-gray-600">(Integrated)</span>
                  </th>
                  <th className="text-left p-3 font-semibold bg-gray-50 min-w-[140px] whitespace-normal">
                    Option 2<br />
                    <span className="text-xs font-normal text-gray-600">(Low-Mid Risk)</span>
                  </th>
                  <th className="text-left p-3 font-semibold bg-gray-50 min-w-[140px] whitespace-normal">
                    Option 3<br />
                    <span className="text-xs font-normal text-gray-600">(High Risk)</span>
                  </th>
                  <th className="text-left p-3 font-semibold bg-gray-50 min-w-[140px] whitespace-normal">Option 4</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(displayData).map(([key, row], index) => (
                  <tr
                    key={key}
                    className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="p-3 font-medium min-w-[200px] whitespace-normal break-words text-sm">
                      {row.category}
                    </td>
                    <td
                      className={`p-3 min-w-[140px] whitespace-normal break-words text-sm ${isValueCustom(key, "option1") ? "font-bold text-blue-600 bg-blue-50" : ""}`}
                    >
                      {row.option1}
                    </td>
                    <td
                      className={`p-3 min-w-[140px] whitespace-normal break-words text-sm ${isValueCustom(key, "option2") ? "font-bold text-blue-600 bg-blue-50" : ""}`}
                    >
                      {row.option2}
                    </td>
                    <td
                      className={`p-3 min-w-[140px] whitespace-normal break-words text-sm ${isValueCustom(key, "option3") ? "font-bold text-blue-600 bg-blue-50" : ""}`}
                    >
                      {row.option3}
                    </td>
                    <td
                      className={`p-3 min-w-[140px] whitespace-normal break-words text-sm ${isValueCustom(key, "option4") ? "font-bold text-blue-600 bg-blue-50" : ""}`}
                    >
                      {row.option4 || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => downloadCSV(displayData, application)}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
