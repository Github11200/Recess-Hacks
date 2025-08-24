"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Listing = {
  id?: string;
  title: string;
  description: string;
  company: string;
  link: string;
};

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
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
