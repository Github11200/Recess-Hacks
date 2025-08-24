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
      "You are a helpful assistant that provides feedback to a user based on the interview questions provided. Don't give feedback to every individual question, rather provide a short, concise and well-formatted paragraph as the final response. You also don't have to say things like \"Your answer\" or \"Feedback\", just give the text directly.",
    ],
    ["human", text],
  ]))

  return new NextResponse(JSON.stringify(response.content))
}