import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "scrapeLinkedIn",
      "Scrapes LinkedIn for jobs based on the input that was given.",
      {
        location: z.string().describe("A message with lorem ipsum."),
        jobTitle: z.string().describe("The title of the job, like \"Restuarant Cleaner.\" The more specific this is the better"),
      },
      async ({ location, jobTitle }) => {
        return {
          content: [{ type: "text", text: `Linkedin data here` }],
        }
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