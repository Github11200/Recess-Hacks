import Messages from "./messages";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Message } from "@/lib/interfaces";
import { BaseMessage } from "@langchain/core/messages";

export default async function Chat() {
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

  // const prompt = ChatPromptTemplate.fromMessages([
  //   ["system", "You are a helpful assistant"],
  //   ["placeholder", "{chat_history}"],
  //   ["human", "{input}"],
  //   ["placeholder", "{agent_scratchpad}"],
  // ]);

  // Bind tools to your LangChain agent
  const agent = createReactAgent({
    llm,
    tools,
  });

  let messageHistory: null | BaseMessage[] = null;

  const sendMessageCallback = async (messages: Message[]): Promise<Message> => {
    "use server";

    const userMessage: Message = messages[messages.length - 1];
    let newMessages = [];
    if (messageHistory !== null) newMessages = [...messageHistory];
    newMessages.push({ role: "user", content: userMessage.message });

    const agentOutput = agent.invoke({
      messages: newMessages,
    });

    return {
      sentBy: "llm",
      message: "woah",
    };
  };

  let agentOutput1 = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Hi, my name is bob!",
      },
    ],
  });

  let messageHistory = agentOutput1.messages;

  // let agentOutput2 = await agent.invoke({
  //   messages: [
  //     ...messageHistory,
  //     { role: "user", content: "What was my name?" },
  //   ],
  // });

  // messageHistory = agentOutput2.messages;

  // let agentOutput3 = await agent.invoke({
  //   messages: [
  //     ...messageHistory,
  //     { role: "user", content: "My friend's name is Cod" },
  //   ],
  // });

  // messageHistory = agentOutput3.messages;

  // let agentOutput4 = await agent.invoke({
  //   messages: [
  //     ...messageHistory,
  //     { role: "user", content: "What is my friend's name?" },
  //   ],
  // });

  // console.log(agentOutput1);
  // console.log(agentOutput2);
  // console.log(agentOutput3);
  // console.log(agentOutput4);

  // const agentExecutor = new AgentExecutor({
  //   agent,
  //   tools,
  // });

  // const response = await agentExecutor.invoke({
  //   input: "Hi, what model are you?",
  // });
  // console.log(response);

  // const memory = new ChatMessageHistory();
  // const agentExecutorWithMemory = new RunnableWithMessageHistory({
  //   runnable: agentExecutor,
  //   getMessageHistory: () => memory,
  //   inputMessagesKey: "input",
  //   historyMessagesKey: "chat_history",
  // });

  // You can inspect the tool schemas if needed
  // await callModel();

  // await fetch("http://localhost:3000/api/getLinkedInData", {
  //   body: JSON.stringify({
  //     location: "Delta, British Columbia, Canada",
  //     jobTitle: "Software Engineer",
  //   }),
  //   method: "POST",
  // })
  //   .then((data) => data.json())
  //   .then((res) => {
  //     console.log(res);
  //   });

  return (
    <div>
      <Messages sendMessageCallback={sendMessageCallback} />
    </div>
  );
}
