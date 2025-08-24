import React, { JSX } from "react";

interface Params {
  location: string;
  jobTitle: string;
}

interface Job {
  title: string | undefined;
  description: string | undefined;
  company: string | undefined;
  link: string | undefined;
  id: string | undefined;
}

interface Message {
  sentBy: "user" | "llm";
  message: string;
  tableElement?: React.JSX.Element;
  isTableData?: boolean;
}

interface Resume {
  personalInfo: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    LinkedIn?: string;
    GitHub?: string;
    website?: string;
  };
  skills: string[];
  education: {
    institution: string;
    location?: string;
    degree: string;
    major?: string;
    startDate?: string; // e.g., "September 2020"
    endDate?: string;   // e.g., "June 2024" or "Present"
    additionalDetails?: string;
  }[];
  projects?: {
    title: string;
    description?: string;
    githubUrl?: string;
    demoUrl?: string;
    additionalDetails?: string;
  }[];
  experience: {
    jobTitle: string;
    companyName: string;
    location?: string;
    startDate?: string; // e.g., "January 2022"
    endDate?: string;   // e.g., "March 2024" or "Present"
    responsibilities: string[];
  }[];
  certifications?: string[];
  languages?: {
    language: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Proficient' | 'Fluent' | 'Native';
  }[];
  interests?: string[];
}

export type { Message, Params, Job, Resume }