"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/lib/interfaces";
import { OpenAI } from "@langchain/openai";
import { useState } from "react";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sentBy: "llm",
      message: "Hey there!",
    },
  ]);

  return (
    <div className="w-[50%] mx-auto flex flex-col items-center h-[100vh] py-4 gap-2">
      <Messages />
      <div className="w-full h-full bg-gray-500 rounded-[var(--radius)] overflow-y-scroll p-4">
        {messages.map((messageObject, index) => {
          return (
            <div
              key={index}
              className={`p-2 ${
                messageObject.sentBy === "llm" ? "bg-gray-300" : "bg-gray-50"
              } rounded-[var(--radius)]`}
            >
              {messageObject.sentBy === "llm" ? "Assistant" : "User"}:{" "}
              {messageObject.message}
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 w-full">
        <Input type="text" placeholder="Message..." />
        <Button>Send</Button>
      </div>
    </div>
  );
}
