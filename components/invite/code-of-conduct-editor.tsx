"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, RotateCcw } from "lucide-react"

interface ConductSection {
  id: string
  type: "header" | "paragraph"
  content: string
}

interface CustomConductData {
  sections: ConductSection[]
}

interface CodeOfConductEditorProps {
  value: CustomConductData | null
  onChange: (data: CustomConductData) => void
  disabled?: boolean
}

const defaultConduct: CustomConductData = {
  sections: [
    {
      id: "1",
      type: "paragraph",
      content:
        "All advertisements and materials involved in or related to the sale of a product or service, or which contain or refer to a name, trade or service mark, products, services, etc., must be approved in writing by Lumino and in advance of their use.\n\nThe use of the Internet for marketing products and services is subject to the same policies and procedures applicable to written or printed material.",
    },
    {
      id: "2",
      type: "header",
      content: "EXPERIENCED PARTNERS",
    },
    {
      id: "3",
      type: "paragraph",
      content:
        "Lumino recommends that you seek legal advice pertaining to the operation of any ADAD equipment. This document is not intended as a replacement for sound legal advice, and the use of ADAD equipment is entirely your decision and responsibility.",
    },
    {
      id: "4",
      type: "header",
      content: "AUTOMATED DIALER AND ANNOUNCING DEVICE (ADAD) COMPLIANCE",
    },
    {
      id: "5",
      type: "paragraph",
      content:
        "In the following states, ADAD delivered business-to-business sales calls are extremely forbidden: Arkansas (criminal), Maryland (criminal), Mississippi (civil), North Carolina (civil), Washington (civil), and Wyoming (criminal).",
    },
    {
      id: "6",
      type: "header",
      content: "CONFIDENTIALITY",
    },
    {
      id: "7",
      type: "paragraph",
      content:
        "In your role as a Lumino Partner, you will possess confidential information about your Merchant and Lumino. A breach of confidentiality can have serious consequences.",
    },
    {
      id: "8",
      type: "header",
      content: "VIOLATION OF LUMINO POLICY",
    },
    {
      id: "9",
      type: "paragraph",
      content:
        "The purpose of policies and procedures is to ensure Lumino's ability to provide the highest quality products and services to its Merchants and Partners.",
    },
  ],
}

export default function CodeOfConductEditor({ value, onChange, disabled }: CodeOfConductEditorProps) {
  const [localData, setLocalData] = useState<CustomConductData>(value || defaultConduct)

  const handleDataChange = useCallback(
    (newData: CustomConductData) => {
      setLocalData(newData)
      onChange(newData)
    },
    [onChange],
  )

  const addSection = (type: "header" | "paragraph") => {
    const newSection: ConductSection = {
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

  const updateSection = (id: string, field: keyof ConductSection, value: string) => {
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
    handleDataChange(defaultConduct)
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Custom Code of Conduct</h4>
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

      {/* Preview */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div className="bg-white p-4 rounded-lg space-y-4 border">
          {localData.sections.map((section) => (
            <div key={section.id}>
              {section.type === "header" ? (
                <h3 className="text-lg font-bold text-gray-800 uppercase">{section.content}</h3>
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
