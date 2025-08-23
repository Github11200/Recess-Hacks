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
        status: "Pending",
        website: "https://posturai.vercel.app/",
    },
    {
      id: "123",
      company: "Posturai",
      salary: 10000,
      status: "Interview",
      website: "https://posturai.vercel.app/",
  },
  {
    id: "123",
    company: "Posturai",
    salary: 10000,
    status: "Completed",
    website: "https://posturai.vercel.app/",
},
  ]
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="min-h-[60vh] flex justify-center py-10">
      <div className="w-full max-w-4xl">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}