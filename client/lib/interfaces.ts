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
  jsxElement?: React.JSX.Element;
  isJsxElement?: boolean;
}

interface Resume {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
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

interface Email {
  recepient: string;
  subject: string;
  body: string;
};

interface Listing {
  id?: string;
  title: string;
  description: string;
  company: string;
  link: string;
  status: "Applied" | "Pending" | "Interview" | "Completed";
};

export type { Message, Params, Job, Resume, Email, Listing }