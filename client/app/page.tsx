"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import LandingPage from "./landing/page";

export default function Page() {
  return (
    <>
      <LandingPage />
    </>
  );
}