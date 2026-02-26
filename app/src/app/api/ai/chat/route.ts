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
      model: "claude-sonnet-4-6",
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
    console.error("AI API error:", error);
    let message = "AI service temporarily unavailable. Please try again.";
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        message = "API key is invalid. Please check your configuration.";
      } else if (error.status === 429) {
        message = "Rate limit reached. Please wait a moment and try again.";
      } else if (error.status === 404) {
        message = "AI model not available. Please contact the administrator.";
      }
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
