"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ApplicationFilesProps {
  selectedApplication: Record<string, any>
}

export default function ApplicationFiles({ selectedApplication }: ApplicationFilesProps) {
  if (!selectedApplication) return null

  const getFileExtension = (url: string) => {
    const match = url.match(/\.\w+$/)
    return match ? match[0] : ""
  }

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = `/api/download?url=${encodeURIComponent(url)}&filename=${filename}`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const fileFields = [
    { key: "drivers_license_url", label: "Driver's License" },
    { key: "voided_check_url", label: "Voided Check" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fileFields.map(({ key, label }) => {
        const fileUrl = selectedApplication[key]
        if (!fileUrl) return null

        const ext = getFileExtension(fileUrl)
        const isImage = /\.(jpg|jpeg|png|webp|heic)$/i.test(fileUrl)

        return (
          <div
            key={key}
            className="border rounded-lg p-4 shadow-sm flex flex-col items-center text-center"
          >
            {/* Header */}
            <h3 className="font-semibold mb-3">{label}</h3>

            {/* File Preview */}
            <div className="flex-1 mb-4 w-full flex justify-center">
              {isImage ? (
                <img
                  src={fileUrl}
                  alt={label}
                  className="max-h-64 max-w-full object-contain rounded"
                />
              ) : (
                <div className="p-6 bg-gray-100 text-center rounded text-sm text-gray-500 w-full">
                  PDF Document
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-auto w-full justify-center">
              <Button asChild className="flex-1 sm:flex-none">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </Button>
              <Button
                className="flex-1 sm:flex-none"
                onClick={() => downloadFile(fileUrl, `${label}${ext}`)}
              >
                Download
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
