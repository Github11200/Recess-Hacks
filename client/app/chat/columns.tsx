"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Listing } from "@/lib/interfaces";

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ getValue }) => {
      const url = getValue() as string;
      return (
        <Link href={url} target="_blank">
          Link
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
