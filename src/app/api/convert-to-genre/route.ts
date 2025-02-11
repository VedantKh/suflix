import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import GenreObject from "@/types/genre";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { query, availableGenres } = await request.json();

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Given this list of movie genres: ${JSON.stringify(
            availableGenres.map((g: GenreObject) => g.name)
          )},
          what would be the most appropriate genre for this query: "${query}"?
          Respond with ONLY the exact genre name from the list, nothing else.`,
        },
      ],
    });

    console.log('Full message response:', message);
    console.log('Content:', message.content);
    const matchedGenre = message.content[0].text;
    console.log('Matched genre:', matchedGenre);

    return NextResponse.json({ matchedGenre });
  } catch (error) {
    console.error("Error converting query to genre:", error);
    return NextResponse.json(
      { error: "Failed to convert query to genre" },
      { status: 500 }
    );
  }
}
