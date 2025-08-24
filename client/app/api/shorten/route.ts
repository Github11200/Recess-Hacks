import { ChatOllama } from "@langchain/ollama";
import { NextRequest, NextResponse } from "next/server";

const llm = new ChatOllama({
  model: "llama3.1",
  temperature: 0,
  maxRetries: 2,
});

export async function POST(request: NextRequest) {
  const text = await request.text()

  let response = (await llm.invoke([
    [
      "system",
      "You are a helpful assistant that shortens incredibly long job descriptions down to exactly ONE SENTENCE. You will output nothing but the condensed sentence.",
    ],
    ["human", text],
  ]))

  return new NextResponse(JSON.stringify(response.content))
}