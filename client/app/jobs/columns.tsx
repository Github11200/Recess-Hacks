"use client"
 
import { ColumnDef } from "@tanstack/react-table"

export type Listing = {
  id: string
  company: string
  salary: number
  status: "Applied" | "Pending" | "Interview" | "Completed"
  website: string
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
  },
  {
    accessorKey: "website",
    header: "Website",
  },
]