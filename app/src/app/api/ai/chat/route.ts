import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt, maxTokens = 1024 } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages,
    });

    const textContent = response.content.find((block) => block.type === "text");

    return Response.json({
      content: textContent ? textContent.text : "",
      usage: response.usage,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("AI API error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
