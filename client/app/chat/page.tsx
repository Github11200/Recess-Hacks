import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/lib/interfaces";
import { Cohere } from "@langchain/cohere";
import Messages from "./messages";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";

export default async function Chat() {
  const llm = new ChatMistralAI({
    model: "magistral-medium-latest",
    temperature: 0,
    maxRetries: 2,
    apiKey: process.env.MISTRAL_API_KEY,
  });

  const client = new MultiServerMCPClient({
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
    useStandardContentBlocks: true,
    mcpServers: {
      vercelServer: {
        transport: "http", // or "sse" if your server uses Server-Sent Events
        url: "http://localhost:3000/api/mcp",
        // headers if needed for auth, e.g.,
        // headers: {
        //   Authorization: "Bearer your-token",
        // },
        // Optional SSE config if needed
        // useNodeEventSource: true,
        // reconnect: { enabled: true, maxAttempts: 5, delayMs: 2000 }
      },
    },
  });

  const tools = await client.getTools();

  const agent = createReactAgent({
    llm: llm,
    tools,
  });

  // const llmWithTools = llm.bindTools(tools);

  const callModel = async () => {
    const response = await agent.invoke({
      messages: [
        {
          role: "user",
          content:
            "I live in Delta, British Columbia, Canada and I am looking for software engineering job.",
        },
      ],
    });
    console.log(response.messages);
  };

  console.log(tools[0].lc_kwargs.schema);
  // await callModel();

  return (
    <div className="w-[50%] mx-auto flex flex-col items-center h-[100vh] py-4 gap-2">
      <Button>Click me!</Button>
    </div>
  );
}
