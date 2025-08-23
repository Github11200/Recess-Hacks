export interface Params {
  location: string;
  jobTitle: string;
}

export interface Job {
  title: string | undefined;
  description: string | undefined;
  company: string | undefined;
  link: string | undefined;
  id: string | undefined;
}