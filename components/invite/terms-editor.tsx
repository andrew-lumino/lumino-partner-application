"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, RotateCcw } from "lucide-react"

interface TermsSection {
  id: string
  type: "header" | "paragraph"
  content: string
}

interface CustomTermsData {
  sections: TermsSection[]
}

interface TermsEditorProps {
  value: CustomTermsData | null
  onChange: (data: CustomTermsData) => void
  disabled?: boolean
}

const defaultTerms: CustomTermsData = {
  sections: [
    {
      id: "1",
      type: "header",
      content: "PASS-THROUGH FEES",
    },
    {
      id: "2",
      type: "paragraph",
      content:
        "fees are back-end charges, including but not limited to the cost of postage, paper statements, merchant records, terminal records, TMF look-ups, arbitration, and RMS fees. If any pass-through fees are applicable, they will be priced at cost and passed through to the Sales Partner.",
    },
    {
      id: "3",
      type: "header",
      content: "SPECIAL TERMS",
    },
    {
      id: "4",
      type: "paragraph",
      content:
        "This Revenue Sharing Program is part of the Lumino Partner Agreement (\"Partner Agreement\"). Additional terms and conditions may apply. All approved applications will be paid in accordance with the Option chosen at the time the application is submitted. If there is any change to the service offering that would cause a change to the Option originally chosen, Partner shall be paid at the appropriate Option from the date of the change in service (ex. Sales signed on Option 2 and later want a free POS Option 1). The Partner will be paid according to the new Option from the date the new Option is selected. This result may increase or decrease the residual split.\n\nOnly new merchants that are not already on Lumino's platform qualify for the pricing in this Schedule A. Lumino shall retract any commissions paid to Partner for equipment placed at a Merchant location if the Merchant for which commissions were earned cancels, materially reduces processing volume, or the Monthly Minimum is reduced or removed within twelve months from the date of Adjustment as explained above. Partner agrees to use reasonable efforts in assisting Lumino's retrieval of the POS Equipment and Add-Ons in the event of merchant cancellation or termination.",
    },
  ],
}

export default function TermsEditor({ value, onChange, disabled }: TermsEditorProps) {
  const [localData, setLocalData] = useState<CustomTermsData>(value || defaultTerms)

  const handleDataChange = useCallback(
    (newData: CustomTermsData) => {
      setLocalData(newData)
      onChange(newData)
    },
    [onChange],
  )

  const addSection = (type: "header" | "paragraph") => {
    const newSection: TermsSection = {
      id: Date.now().toString(),
      type,
      content: type === "header" ? "New Header" : "New paragraph content...",
    }
    const newData = {
      ...localData,
      sections: [...localData.sections, newSection],
    }
    handleDataChange(newData)
  }

  const updateSection = (id: string, field: keyof TermsSection, value: string) => {
    const newData = {
      ...localData,
      sections: localData.sections.map((section) => (section.id === id ? { ...section, [field]: value } : section)),
    }
    handleDataChange(newData)
  }

  const removeSection = (id: string) => {
    const newData = {
      ...localData,
      sections: localData.sections.filter((section) => section.id !== id),
    }
    handleDataChange(newData)
  }

  const resetToDefault = () => {
    handleDataChange(defaultTerms)
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Custom Terms</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefault} disabled={disabled}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSection("header")} disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add Header
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSection("paragraph")} disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            Add Paragraph
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {localData.sections.map((section, index) => (
          <div key={section.id} className="border rounded-lg p-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Section {index + 1}</span>
                <Select
                  value={section.type}
                  onValueChange={(value: "header" | "paragraph") => updateSection(section.id, "type", value)}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSection(section.id)}
                disabled={localData.sections.length === 1 || disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {section.type === "header" ? (
              <Input
                value={section.content}
                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                placeholder="Enter header text..."
                className="font-semibold"
                disabled={disabled}
              />
            ) : (
              <Textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, "content", e.target.value)}
                placeholder="Enter paragraph content..."
                rows={4}
                disabled={disabled}
              />
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div className="bg-white p-4 rounded-lg space-y-4 border">
          {localData.sections.map((section) => (
            <div key={section.id}>
              {section.type === "header" ? (
                <h3 className="text-lg font-bold text-gray-800">{section.content}</h3>
              ) : (
                <div className="text-gray-700 whitespace-pre-wrap">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
