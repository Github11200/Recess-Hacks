/*

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// Initialize the client with your details
const client = new Client(
  {
    name: "mcp-typescript-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

// Create a transport with your MCP server URL
const serverUrl =
  "https://mcp.zapier.com/api/mcp/s/ZjE4OGE1YjMtMzgzMi00MmJlLThjZTktZjI4NGIxMzBjZTI3OjRmZjFmM2U4LTgzOWItNGE1My1hY2Y0LTVhY2VjNmU4NjhkMg==/mcp";
const transport = new StreamableHTTPClientTransport(new URL(serverUrl));

async function main() {
  // Connect to the server
  console.log("Connecting to MCP server...");
  await client.connect(transport);
  console.log("Connected to MCP server");

  // List available tools
  console.log("Fetching available tools...");
  const tools = await client.listTools();

  console.log("Available tools:", tools);
  // Tools returned would look like:
  //   - name: "gmail_create_draft"
  //     description: "Create a draft email message."
  //     params: ["cc","to","bcc", ...]

  // Example: Call a specific tool with parameters
  console.log("Calling gmail_create_draft...");
  const result = await client.callTool({
    name: "gmail_create_draft",
    arguments: {
      instructions:
        "Execute the Gmail: Create Draft tool with the following parameters",
      body: "example-string",
      subject: "example-string",
    },
  });
  console.log("gmail_create_draft result:\n", result);

  // Close the connection
  await client.transport?.close();
  await client.close();
}

main();

 */