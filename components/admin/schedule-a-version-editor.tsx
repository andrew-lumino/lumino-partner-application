"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Edit, RotateCcw, Save } from "lucide-react"
import { useUser } from "@clerk/nextjs"

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

interface ScheduleAVersionEditorProps {
  applicationId: string
  currentScheduleA: ScheduleAData | null
  onSave?: () => void
}

export default function ScheduleAVersionEditor({
  applicationId,
  currentScheduleA,
  onSave,
}: ScheduleAVersionEditorProps) {
  const [open, setOpen] = useState(false)
  const [localData, setLocalData] = useState<ScheduleAData>(currentScheduleA || defaultScheduleA)
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()

  const handleCellChange = (rowKey: string, column: string, value: string) => {
    setLocalData({
      ...localData,
      [rowKey]: {
        ...localData[rowKey],
        [column]: value,
      },
    })
  }

  const resetToDefault = () => {
    setLocalData(defaultScheduleA)
  }

  const handleSave = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast({
        title: "Error",
        description: "User email not found",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const res = await fetch("/api/admin/update-agent-schedule-a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          scheduleAData: localData,
          effectiveDate,
          notes,
          createdBy: user.primaryEmailAddress.emailAddress,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: "Schedule A updated successfully",
        })
        setOpen(false)
        if (onSave) onSave()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update Schedule A",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving Schedule A:", error)
      toast({
        title: "Error",
        description: "Failed to update Schedule A",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Schedule A
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Agent Schedule A Terms</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                id="effectiveDate"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="e.g., Updated commission rates per agreement"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Custom Schedule A Terms</CardTitle>
                <Button variant="outline" size="sm" onClick={resetToDefault}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left text-xs font-medium">Fee Category</th>
                      <th className="border border-gray-300 p-2 text-left text-xs font-medium">
                        Option 1 (Integrated)
                      </th>
                      <th className="border border-gray-300 p-2 text-left text-xs font-medium">
                        Option 2 (Low-Mid Risk)
                      </th>
                      <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 3 (High Risk)</th>
                      <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 4</th>
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
