import { Job, Params, Resume } from "@/lib/interfaces";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  async (server) => {
    // @ts-ignore
    server.tool(
      "scrapeLinkedIn",
      "Scrapes LinkedIn for jobs based on the input that was given.",
      {
        location: z.string().describe("A message with the user's location. Ask the user if you don't have their location."),
        jobTitle: z.string().describe("The title of the job, like \"Restuarant Cleaner.\" The more specific this is the better"),
      },
      async ({ location, jobTitle }) => {
        let params: Params = {
          location: location,
          jobTitle: jobTitle
        }
        const data = await fetch("http://localhost:3000/api/getLinkedInData", {
          body: JSON.stringify(params),
          method: "POST"
        }).then((data) => data.json()).then((jobs: Job[]) => {
          let jobsString = "The following are all the jobs that were scrapped from LinkedIn. Filter out the ones that may not be applicable for the current user and make use of all the information presented when talking:\n\n\n"
          for (let job of jobs) {
            jobsString += `Job title: ${job.title}\n`
            jobsString += `Job company: ${job.company}\n`
            jobsString += `Link to job's LinkedIn page: ${job.link}\n\n`
            jobsString += `The following is the description of the job directly from the LinkedIn page:\n${job.description}\n\n\n`
          }
          return {
            content: [{ type: "text", text: jobsString }],
          }
        })
        return data;
      }
    );
    // @ts-ignore
    server.tool(
      "generateResume",
      "Generates a resume from an interface and returns JSON data which is then converted to a downloadable PDF for the user",
      {
        personalInfo: z.object({
          fullName: z.string().describe("The candidate’s full legal name as it should appear on the resume."),
          email: z.string().describe("The primary email address for the candidate to be contacted."),
          phoneNumber: z.string().optional().describe("Optional contact phone number for the candidate."),
          LinkedIn: z.string().optional().describe("Optional LinkedIn profile URL for the candidate."),
          GitHub: z.string().optional().describe("Optional GitHub profile URL for the candidate."),
          website: z.string().optional().describe("Optional personal or professional website of the candidate."),
        }).describe("Top-level personal identification and key contact information."),
        skills: z.array(z.string()).describe("A list of key skills and technologies the candidate wants to highlight."),
        education: z.array(z.object({
          institution: z.string().describe("The name of the institution where the candidate studied."),
          location: z.string().optional().describe("Location of the educational institution."),
          degree: z.string().describe("The degree earned or pursued, e.g., 'Bachelor of Science'."),
          major: z.string().optional().describe("Optional field for major or field of study, if applicable."),
          startDate: z.string().optional().describe("The starting date of the educational program."),
          endDate: z.union([z.string(), z.literal("Present")]).optional().describe("The completion date or 'Present' if currently enrolled."),
          additionalDetails: z.string().optional().describe("Any extra information regarding education, such as honors, thesis, etc."),
        })).describe("Education history with details about schools and qualifications."),
        projects: z.array(z.object({
          title: z.string().describe("The name or title of the project."),
          description: z.string().optional().describe("A summary of the project, including its scope and key achievements."),
          githubUrl: z.string().optional().describe("Optional link to the project's source code repository."),
          demoUrl: z.string().optional().describe("Optional link to a live demo or deployed project."),
          additionalDetails: z.string().optional().describe("Any extra details, such as team size, tools used, or awards."),
        })).optional().describe("List of notable projects the candidate wishes to showcase."),
        experience: z.array(z.object({
          jobTitle: z.string().describe("Candidate’s official job title for this position."),
          companyName: z.string().describe("Name of the employer or organization."),
          location: z.string().optional().describe("Geographical location of the workplace."),
          startDate: z.string().optional().describe("Employment start date."),
          endDate: z.union([z.string(), z.literal("Present")]).optional().describe("Employment end date or 'Present' if still employed."),
          responsibilities: z.array(z.string()).describe("List of main tasks, achievements, or responsibilities for the job."),
        })).describe("Professional experience, including previous job roles and responsibilities."),
        certifications: z.array(z.string()).optional().describe("Any additional certifications, courses, or credentials."),
      },
      async (resume: Resume) => {
        console.log(resume);

        return {
          content: [{ type: "text", text: "/resume" + JSON.stringify(resume) }]
        }
      }
    )
  },
  {
    capabilities: {
      tools: {
        scrapeLinkedIn: {
          description: "Scrapes LinkedIn for jobs based on the input that was given.",
        },
        generateResume: {
          description: "Provide an object of the resume following the interface given and a JSON object will be returned which you can directly return to the user."
        }
      },
    },
  },
  {
    basePath: "/api",
    verboseLogs: true,
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };