"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, RotateCcw } from "lucide-react"

interface MessageSection {
  id: string
  type: "header" | "paragraph"
  content: string
}

interface CustomMessageData {
  sections: MessageSection[]
}

interface CustomMessageEditorProps {
  value: CustomMessageData | null
  onChange: (data: CustomMessageData) => void
  disabled?: boolean
}

const defaultMessage: CustomMessageData = {
  sections: [
    {
      id: "1",
      type: "header",
      content: "Welcome to Lumino - Payments with Purpose",
    },
    {
      id: "2",
      type: "paragraph",
      content:
        "Dear Partners,\n\nThank you for choosing to partner with Lumino. Our founding team was forged in the Gamified Fullstack Fintech community, and we built every feature around a simple conviction: where Consumers Win, Businesses Win, Partners Win. Creating a backbone of what we call true Conscious commerce.",
    },
  ],
}

export default function CustomMessageEditor({ value, onChange, disabled }: CustomMessageEditorProps) {
  const [localData, setLocalData] = useState<CustomMessageData>(value || defaultMessage)

  const handleDataChange = useCallback(
    (newData: CustomMessageData) => {
      setLocalData(newData)
      onChange(newData)
    },
    [onChange],
  )

  const addSection = (type: "header" | "paragraph") => {
    const newSection: MessageSection = {
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

  const updateSection = (id: string, field: keyof MessageSection, value: string) => {
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
    handleDataChange(defaultMessage)
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Custom Welcome Message</h4>
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
                <h3 className="text-xl font-bold text-gray-800">{section.content}</h3>
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
