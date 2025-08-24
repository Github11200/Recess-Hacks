"use client"
 
import { ColumnDef } from "@tanstack/react-table"

export type Listing = {
  id: string
  title: string
  description: string
  company: string
  link: string
}

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "title",
    header: () => <div>Title</div>,
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
    accessorKey: "link",
    header: "Link",
  },
    {
    accessorKey: "description",
    header: "Description",
  },
]