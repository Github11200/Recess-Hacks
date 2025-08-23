import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/lib/interfaces";
import { OpenAI } from "@langchain/openai";
import Messages from "./messages";

export default async function Chat() {
  const llm = new OpenAI({
    model: "gpt-3.5-turbo-instruct",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const inputText = "OpenAI is an AI company that ";

  const completion = await llm.invoke(inputText);
  console.log(completion);

  return (
    <div className="w-[50%] mx-auto flex flex-col items-center h-[100vh] py-4 gap-2"></div>
  );
}
