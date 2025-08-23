import { columns, Listing } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Listing[]> {
  // Data from chat bot goes here
  return [
    {
        id: "123",
        company: "posturai",
        salary: 10000,
        status: "applied",
        website: "https://posturai.vercel.app/",
    },
    {
        id: "123",
        company: "posturai",
        salary: 10000,
        status: "applied",
        website: "https://posturai.vercel.app/",
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()
 
  return (
    <div className="container mx-auto py-10">
      <h2 id="only-once" className="mb-4 font-medium">ONE table should appear below</h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
}