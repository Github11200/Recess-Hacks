import { Message } from "@/lib/interfaces";
import { NextRequest, NextResponse } from "next/server";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import { systemPromptString } from "@/lib/prompts";
import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
  maxRetries: 2,
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
  content: systemPromptString
}

export async function POST(request: NextRequest) {
  const messages: Message[] = await request.json();

  console.log(messages[messages.length - 1]);

  const agentOutput = await agent.invoke({
    messages: [systemPrompt, ...messages.map((msg) => ({
      role: msg.sentBy === "llm" ? "assistant" : "user",
      content: msg.message,
    }))],
  });

  return new NextResponse(JSON.stringify({ sentBy: "llm", message: agentOutput.messages[agentOutput.messages.length - 1].content.toString() }))
}