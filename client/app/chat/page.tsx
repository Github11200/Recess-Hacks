"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/lib/interfaces";
import { OpenAI } from "@langchain/openai";
import { useState } from "react";
import Markdown from "markdown-to-jsx";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sentBy: "llm",
      message: "Hey there!",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  return (
    <div className="w-[50%] mx-auto flex flex-col items-center h-[100vh] gap-2 py-4">
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
              <Markdown>{messageObject.message}</Markdown>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 w-full">
        <Input
          type="text"
          placeholder="Message..."
          value={currentMessage}
          onChange={(e) => {
            e.preventDefault();
            setCurrentMessage(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            setCurrentMessage("");
            let newArray: Message[] = [
              ...messages,
              {
                sentBy: "user",
                message: currentMessage,
              },
            ];
            setMessages(newArray);
            fetch("/api/sendMessage", {
              body: JSON.stringify(newArray),
              method: "POST",
            })
              .then((data) => data.json())
              .then((res: Message) => {
                setMessages([...newArray, res]);
              });
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
