import { columns, Listing } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Listing[]> {
  // Data from chat bot goes here
  return [
    {
        id: "123",
        company: "Posturai",
        salary: 10000,
        status: "Applied",
        website: "https://posturai.vercel.app/",
    },
    {
        id: "123",
        company: "Posturai",
        salary: 10000,
        status: "Applied",
        website: "https://posturai.vercel.app/",
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()
 
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}