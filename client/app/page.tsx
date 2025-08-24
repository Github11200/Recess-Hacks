"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import LandingPage from "./landing/page";

export default function Page() {
  return <LandingPage />;
}

// export default function HomePage() {
//   const doc = new jsPDF();
//   doc.text("Hello world!", 10, 10);

//   const pdfBlob = doc.output("blob");
//   const url = URL.createObjectURL(pdfBlob);
//   console.log(url);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
//       <div className="w-full max-w-2xl text-center">
//       </div>
//     </main>
//   );
// }
