import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { MovieObject } from "@/types/movie";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword")?.toLowerCase();

    if (!keyword) {
      return NextResponse.json({ moviesByRating: [], moviesByPopularity: [] });
    }

    const [moviesContent, keywordsContent] = await Promise.all([
      fs.readFile(
        path.join(process.cwd(), "src/data/raw_data/movies_metadata.csv"),
        { encoding: "utf-8" }
      ),
      fs.readFile(path.join(process.cwd(), "src/data/raw_data/keywords.csv"), {
        encoding: "utf-8",
      }),
    ]);

    // Parse keywords data first
    const keywordsRecords = parse(keywordsContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      skip_records_with_error: true,
    });

    // Create a set of movie IDs that have the matching keyword
    const movieIdsWithKeyword = new Set();
    keywordsRecords.forEach((record: any) => {
      try {
        const keywords = JSON.parse(record.keywords.replace(/'/g, '"'));
        if (
          keywords.some(
            (k: { name: string }) => k.name.toLowerCase() === keyword
          )
        ) {
          movieIdsWithKeyword.add(parseInt(record.id));
          console.log(`Found movie ID ${record.id} with keyword "${keyword}"`);
        }
      } catch (e) {
        // Skip malformed records
      }
    });
    console.log(
      `Found ${movieIdsWithKeyword.size} movies with keyword: ${keyword}`
    );

    // Parse movies data
    const moviesRecords = parse(moviesContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      skip_records_with_error: true,
    });

    // Transform and filter movies
    const allMovies: MovieObject[] = moviesRecords
      .map((record: any) => {
        try {
          const genres = JSON.parse(
            record.genres.replace(/'/g, '"') || "[]"
          ).map((g: { id: number; name: string }) => ({
            id: g.id,
            name: g.name,
          }));

          return {
            id: parseInt(record.id),
            title: record.title,
            tagline: record.tagline || null,
            overview: record.overview,
            poster_path: record.poster_path || null,
            release_date: record.release_date,
            vote_average: parseFloat(record.vote_average),
            genres,
            adult: record.adult === "True",
            original_language: record.original_language,
            popularity: parseFloat(record.popularity),
            vote_count: parseInt(record.vote_count),
            video: record.video === "True",
            original_title: record.original_title,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(
        (movie): movie is MovieObject =>
          movie !== null &&
          movieIdsWithKeyword.has(movie.id) &&
          movie.vote_count > 100
      );

    console.log(
      `Matched movies with keyword "${keyword}":`,
      allMovies.map((m) => m.title)
    );

    const moviesByRating = allMovies
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10);

    const moviesByPopularity = allMovies
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    return NextResponse.json({
      moviesByRating,
      moviesByPopularity,
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process movies data" },
      { status: 500 }
    );
  }
}
