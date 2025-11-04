"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ScheduleAVersion {
  id: string
  application_id: string
  schedule_a_data: any
  effective_date: string
  created_at: string
  created_by: string
  notes: string | null
  is_active: boolean
}

interface ScheduleAVersionHistoryProps {
  applicationId: string
  onRevert?: (versionId: string, scheduleData: any) => void
}

export default function ScheduleAVersionHistory({ applicationId, onRevert }: ScheduleAVersionHistoryProps) {
  const [versions, setVersions] = useState<ScheduleAVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<ScheduleAVersion | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [applicationId])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/get-schedule-a-history?applicationId=${applicationId}`)
      const data = await res.json()

      if (res.ok) {
        setVersions(data.versions || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load version history",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to load version history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadVersionCSV = (version: ScheduleAVersion) => {
    const scheduleData = version.schedule_a_data
    const headers = ["Fee Category", "Option 1", "Option 2", "Option 3", "Option 4"]
    const csvRows = [headers.join(",")]

    Object.entries(scheduleData).forEach(([key, row]: [string, any]) => {
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

    const timestamp = new Date(version.effective_date).toISOString().slice(0, 10)
    link.setAttribute("download", `Schedule-A-Version-${timestamp}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-500">Loading version history...</p>
        </CardContent>
      </Card>
    )
  }

  if (versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No version history available. This agent is using default terms.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Effective Date</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell>
                  {new Date(version.effective_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(version.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-sm">{version.created_by}</TableCell>
                <TableCell className="text-sm">{version.notes || "-"}</TableCell>
                <TableCell>
                  {version.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedVersion(version)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Schedule A Version - {new Date(version.effective_date).toLocaleDateString()}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 p-2 text-left text-xs font-medium">
                                  Fee Category
                                </th>
                                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 1</th>
                                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 2</th>
                                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 3</th>
                                <th className="border border-gray-300 p-2 text-left text-xs font-medium">Option 4</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(version.schedule_a_data).map(([key, row]: [string, any]) => (
                                <tr key={key}>
                                  <td className="border border-gray-300 p-2 text-xs font-medium">{row.category}</td>
                                  <td className="border border-gray-300 p-2 text-xs">{row.option1}</td>
                                  <td className="border border-gray-300 p-2 text-xs">{row.option2}</td>
                                  <td className="border border-gray-300 p-2 text-xs">{row.option3}</td>
                                  <td className="border border-gray-300 p-2 text-xs">{row.option4 || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" onClick={() => downloadVersionCSV(version)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {!version.is_active && onRevert && (
                      <Button variant="ghost" size="sm" onClick={() => onRevert(version.id, version.schedule_a_data)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
