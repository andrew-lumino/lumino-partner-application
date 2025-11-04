"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"

interface ScheduleAData {
  [key: string]: {
    category: string
    option1: string
    option2: string
    option3: string
    option4?: string
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

interface ScheduleAEditorProps {
  scheduleType: "default" | "custom"
  customData: ScheduleAData | null
  onScheduleTypeChange: (type: "default" | "custom") => void
  onCustomDataChange: (data: ScheduleAData | null) => void
}

export default function ScheduleAEditor({
  scheduleType,
  customData,
  onScheduleTypeChange,
  onCustomDataChange,
}: ScheduleAEditorProps) {
  const [localData, setLocalData] = useState<ScheduleAData>(customData || defaultScheduleA)

  const handleTypeChange = (value: "default" | "custom") => {
    onScheduleTypeChange(value)
    if (value === "custom") {
      onCustomDataChange(localData)
    } else {
      onCustomDataChange(null)
    }
  }

  const handleCellChange = (rowKey: string, column: string, value: string) => {
    const newData = {
      ...localData,
      [rowKey]: {
        ...localData[rowKey],
        [column]: value,
      },
    }
    setLocalData(newData)
    
    // Only update parent if we're in custom mode
    if (scheduleType === "custom") {
      onCustomDataChange(newData)
    }
  }

  const resetToDefault = () => {
    setLocalData(defaultScheduleA)
    if (scheduleType === "custom") {
      onCustomDataChange(defaultScheduleA)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule A Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Schedule A Type</Label>
          <Select value={scheduleType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {scheduleType === "custom" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Custom Schedule A Terms</h4>
              <Button variant="outline" size="sm" onClick={resetToDefault}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Fee Category</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 1 (Integrated)</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">
                      Option 2 (Low-Mid Risk)
                    </th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 3 (High Risk)</th>
                    <th className="border border-gray-300 p-2 text-left text-xs font-medium">
                      Option 4 (Financial Services)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(localData).map(([key, row]) => (
                    <tr key={key}>
                      <td className="border border-gray-300 p-2 text-xs font-medium bg-gray-50">{row.category}</td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          value={row.option1}
                          onChange={(e) => handleCellChange(key, "option1", e.target.value)}
                          className="text-xs h-8"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          value={row.option2}
                          onChange={(e) => handleCellChange(key, "option2", e.target.value)}
                          className="text-xs h-8"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          value={row.option3}
                          onChange={(e) => handleCellChange(key, "option3", e.target.value)}
                          className="text-xs h-8"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          value={row.option4 || ""}
                          onChange={(e) => handleCellChange(key, "option4", e.target.value)}
                          className="text-xs h-8"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
