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
}

export type { Message, Params, Job }