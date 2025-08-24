import { columns } from "./columns";
import { Listing } from "@/lib/interfaces";
import { DataTable } from "./data-table";

async function getData(): Promise<Listing[]> {
  // Data from chat bot goes here
  return [
    {
      title: "SWE",
      company: "Posturai",
      status: "Applied",
      link: "https://posturai.vercel.app/",
      description: "Company description",
    },
    {
      title: "SWE",
      id: "123",
      company: "Posturai",
      description: "Company description",
      status: "Pending",
      link: "https://posturai.vercel.app/",
    },
    {
      title: "SWE",
      id: "123",
      company: "Posturai",
      description: "Company description",
      status: "Interview",
      link: "https://posturai.vercel.app/",
    },
    {
      title: "SWE",
      id: "123",
      company: "Posturai",
      description: "Company description",
      status: "Completed",
      link: "https://posturai.vercel.app/",
    },
  ];
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
