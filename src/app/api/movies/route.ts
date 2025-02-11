import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { MovieObject } from "@/types/movie";

export async function GET(request: Request) {
  try {
    // Get genre from query params
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre")?.toLowerCase();

    // Read the CSV file
    const filePath = path.join(
      process.cwd(),
      "src/data/raw_data/movies_metadata.csv"
    );

    const fileContent = await fs.readFile(filePath, {
      encoding: "utf-8",
      flag: "r",
    });
    const lines = fileContent.split("\n").slice(0, 1001).join("\n");

    const records = parse(lines, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      skip_records_with_error: true,
    });

    // Transform all records first
    const allMovies: MovieObject[] = records.map((record: any) => {
      const genres = (() => {
        try {
          const cleanedGenres = record.genres
            .replace(/'/g, '"')
            .replace(/\s+/g, " ")
            .trim();

          const genresData = JSON.parse(cleanedGenres || "[]");

          if (!Array.isArray(genresData)) return [];
          return genresData.map((g: { id: number; name: string }) => ({
            id: g.id,
            name: g.name,
          }));
        } catch (e) {
          return [];
        }
      })();

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
    });

    // Filter by genre if specified and sort by rating
    const filteredMovies = genre
      ? allMovies.filter(
          (movie) =>
            movie.genres.some((g) => g.name.toLowerCase() === genre) &&
            movie.vote_count > 100 // Only include movies with significant votes
        )
      : allMovies.filter(
          (movie) =>
            movie.vote_count > 100 // Only include movies with significant votes
        );

    // Sort by rating and take top 10
    const topMoviesByRating = filteredMovies
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 10);

    // Sort by rating and take top 10
    const topMoviesByPopularity = filteredMovies
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    return NextResponse.json({ 
      moviesByRating: topMoviesByRating,
      moviesByPopularity: topMoviesByPopularity 
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process movies data" },
      { status: 500 }
    );
  }
}
