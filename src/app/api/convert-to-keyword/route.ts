import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const { query, availableKeywords } = await request.json();

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Given this list of movie keywords: ${JSON.stringify(
            availableKeywords.map((k: { name: string }) => k.name)
          )},
          what would be the most appropriate keyword for this query: "${query}"?
          Respond with ONLY the exact keyword name from the list, nothing else.`,
        },
      ],
    });

    const matchedKeyword: string = (message.content[0] as { text: string })
      .text;

    return NextResponse.json({ matchedKeyword });
  } catch (error) {
    console.error("Error in convert-to-keyword:", error);
    return NextResponse.json(
      { error: "Failed to convert query to keyword" },
      { status: 500 }
    );
  }
}
