import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface ScheduleAVersionBadgeProps {
  isCustom: boolean
  effectiveDate?: string
  className?: string
}

export default function ScheduleAVersionBadge({ isCustom, effectiveDate, className = "" }: ScheduleAVersionBadgeProps) {
  if (!isCustom) {
    return (
      <Badge variant="outline" className={className}>
        Default Terms
      </Badge>
    )
  }

  if (effectiveDate) {
    const formattedDate = new Date(effectiveDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    return (
      <Badge variant="secondary" className={`${className} flex items-center gap-1`}>
        <Calendar className="h-3 w-3" />
        Custom (Effective {formattedDate})
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className={className}>
      Custom Terms
    </Badge>
  )
}
