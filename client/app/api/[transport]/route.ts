import { Job, Params } from "@/lib/interfaces";
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
  },
  {
    capabilities: {
      tools: {
        scrapeLinkedIn: {
          description: "Scrapes LinkedIn for jobs based on the input that was given.",
        },
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