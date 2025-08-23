import { Message } from "@/lib/interfaces";
import { NextRequest, NextResponse } from "next/server";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";

const llm = new ChatMistralAI({
  model: "magistral-medium-latest",
  temperature: 0,
  maxRetries: 2,
  apiKey: process.env.MISTRAL_API_KEY,
});

// Point to your MCP server route (from route.ts)
const client = new MultiServerMCPClient({
  throwOnLoadError: true,
  prefixToolNameWithServerName: false,
  additionalToolNamePrefix: "",
  useStandardContentBlocks: true,
  mcpServers: {
    vercelServer: {
      transport: "http", // or "sse" if your server uses Server-Sent Events
      url: "http://localhost:3000/api/mcp", // Make sure this matches your route.ts endpoint
      // headers: { ... } // Add if needed
    },
  },
});

// Fetch tools from your MCP server
const tools = await client.getTools();

// Bind tools to your LangChain agent
const agent = createReactAgent({
  llm,
  tools,
});

const systemPrompt = {
  role: "system",
  content: `You are an incredibly helpful and smart AI assistant for teens looking to gain independence. You do not necessarily have to state this but it's good to keep in mind.
  
            You will be helping teens gain independence by aiding them in their job search. Essentially they will ask you for listing some jobs and you will use tools given to you to complete the request.
            
            Tool use is formatted using XML-style tags. The tool name is enclosed in opening and closing tags, and each parameter is similarly enclosed within its own set of tags. Here's the structure::
            <tool_name>
              <parameter1_name> value1 </parameter1_name>
              <parameter2_name> value2 </parameter2_name>...
            </tool_name>
            
            Here are the tools currently at your disposal. If you are missing parameters then do not hesitate to ask the user for them otherwise the tool will not work:
            
            Tool 1. scrape_linkedin:
            Description: This is used to scrape jobs from LinkedIn given the place the user wants the job to be and the type of job they're looking for. It will return a list of jobs with various informaton about them.
            <scrape_linkedin>
              <location>This is the location of the job</location>
              <jobTitle>This is the title of the job (e.g. Restaurant Manager)</jobTitle>
            </scrape_linkedin>
            
            Make sure you are polite and patient with the user and keep things very concise. If you're given a large description of a job then boil it down to a sentence, nothing should be verbose.`
}

export async function POST(request: NextRequest) {
  const messages: Message[] = await request.json();

  const agentOutput = await agent.invoke({
    messages: [systemPrompt, ...messages.map((msg) => ({
      role: msg.sentBy === "llm" ? "assistant" : "user",
      content: msg.message,
    }))],
  });

  return new NextResponse(JSON.stringify({ sentBy: "llm", message: agentOutput.messages[agentOutput.messages.length - 1].content.toString() }))
}