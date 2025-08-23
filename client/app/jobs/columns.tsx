"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, Clock, Briefcase, Loader } from "lucide-react"

export type Listing = {
  id: string
  company: string
  salary: number
  status: "Applied" | "Pending" | "Interview" | "Completed"
  website: string
}

const statusIcons: Record<Listing["status"], { icon: React.ElementType; color: string }> = {
  Applied: { icon: Briefcase, color: "text-blue-500" },
  Pending: { icon: Clock, color: "text-yellow-500" },
  Interview: { icon: Loader, color: "text-purple-500" },
  Completed: { icon: CheckCircle, color: "text-green-600" },
}

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "salary",
    header: () => <div>Salary</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: Listing["status"] = row.getValue("status")
      const { icon: Icon, color } = statusIcons[status]

      return (
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span>{status}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "website",
    header: "Website",
  },
]