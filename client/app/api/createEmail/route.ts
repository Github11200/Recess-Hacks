import { Email } from "@/lib/interfaces";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";


export async function POST(request: NextRequest) {
  const email: Email = await request.json()

  const client = new Client(
    {
      name: "mcp-typescript-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  const serverUrl =
    "https://mcp.zapier.com/api/mcp/s/ZjE4OGE1YjMtMzgzMi00MmJlLThjZTktZjI4NGIxMzBjZTI3OjRmZjFmM2U4LTgzOWItNGE1My1hY2Y0LTVhY2VjNmU4NjhkMg==/mcp";
  const transport = new StreamableHTTPClientTransport(new URL(serverUrl));

  await client.connect(transport);
  const tools = await client.listTools();

  const result = await client.callTool({
    name: "gmail_create_draft",
    arguments: {
      instructions:
        "Execute the Gmail: Create Draft tool with the following parameters",
      body: email.body,
      subject: email.subject,
      recepient: email.recepient
    },
  });

  await client.transport?.close();
  await client.close();

  return new NextResponse("The email draft was successfully created on the user's email!")
}