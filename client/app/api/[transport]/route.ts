import { Email, Job, Listing, Params, Resume } from "@/lib/interfaces";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  async (server) => {
    // @ts-ignore
    server.tool(
      "scrapeLinkedIn",
      "Scrapes LinkedIn for jobs based on the input that was given.",
      {
        location: z.string().describe("A message with the user's location. DO NOT USE THE TOOL IF YOU DON'T HAVE THE USER'S LOCATION. You cannot just say \"User's location\", you need an actual city that the user lives in."),
        jobTitle: z.string().describe("The title of the job, like \"Restuarant Cleaner.\" DO NOT USE THE TOOL IF YOU DON'T HAVE THE TITLE OF THE JOB THE USER IS LOOKNG FOR. You cannot just say \"job title\", actually ask the user for the title."),
      },
      async ({ location, jobTitle }) => {
        let params: Params = {
          location: location,
          jobTitle: jobTitle
        }
        const data = await fetch("http://localhost:3000/api/getLinkedInData", {
          body: JSON.stringify(params),
          method: "POST"
        }).then((data) => data.json()).then(async (jobs: Job[]) => {
          let jobsString = "/table["
          let i = 0;
          for (let job of jobs) {
            const shortenedDescription = await fetch("http://localhost:3000/api/shorten", {
              body: JSON.stringify(job.description),
              method: "POST"
            }).then((data) => data.json()).then((res) => {
              return res
            })

            jobsString += `{
              "title": "${job.title}",
              "company": "${job.company}",
              "link": "${job.link}",
              "description": "${shortenedDescription}"
            }` + (i !== jobs.length - 1 ? "," : "")
            console.log("shortened: " + shortenedDescription);
            ++i
          }
          jobsString += "]"

          return {
            content: [{ type: "text", text: jobsString + " DO NOT MODIFY" }],
          }
        })
        return data;
      }
    );
    // @ts-ignore
    server.tool(
      "generateResume",
      "Generates a resume from the given properties and returns some JSON data which is then converted to a downloadable PDF for the user",
      {
        personalInfo: z.object({
          name: z.string().describe("The candidate’s full legal name as it should appear on the resume."),
          email: z.string().describe("The primary email address for the candidate to be contacted."),
          phone: z.string().optional().describe("Optional contact phone number for the candidate."),
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
        console.log("/resume" + JSON.stringify(resume));
        return {
          content: [{ type: "text", text: "/resume" + JSON.stringify(resume) + " DO NOT MODIFY THIS DATA AT ALL, RETURN IT AS IS TO THE USER." }]
        }
      }
    ),
      // @ts-ignore
      server.tool(
        "createEmailDraft",
        "This will create an email draft on the user's email so that they can send it to whatever company they are reaching out to.",
        {
          recepient: z.string().describe("This is the email address of who will recieve the email, e.g. hiringmanager@asana.com"),
          subject: z.string().describe("This is the subject of the email"),
          body: z.string().describe("This is the body of the email")
        },
        async ({ recepient, subject, body }) => {
          const responseText = await fetch("http://localhost:3000/api/createEmail", {
            body: JSON.stringify({ recepient: recepient, subject: subject, body: body }),
            method: "POST"
          }).then((res) => res.text())
          return {
            content: [{ type: "text", text: responseText }]
          }
        }
      ),
      // @ts-ignore
      server.tool(
        "interviewQuestions",
        "If the user ask for a list of resume questions then provide them with it so that they can practice before an interview. Make these questions relevant to the job descripion.",
        {
          description: z.string().describe("The description of the job that the user is applying to"),
          questions: z.array(z.string().describe("An individual interview quesion that may be asked")).describe("The list of all the interview questions to ask")
        },
        async ({ questions }) => {
          return {
            content: [{ type: "text", text: "/questions" + JSON.stringify(questions) + " DO NOT MODIFY" }]
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
          description: "Generates some JSON data of a resume based on the schema given. You can provide dummy data or real data depending on what the user wants."
        },
        createEmailDraft: {
          description: "This is create an email draft in the user's email."
        },
        interviewQuestions: {
          description: "This will allow you to generate a list of interview questions to ask the user so that they can practice before going into an actual job interview."
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