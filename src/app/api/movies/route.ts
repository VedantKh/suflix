import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { MovieObject } from "@/types/movie";

export async function GET() {
  try {
    // Read the CSV file
    const filePath = path.join(
      process.cwd(),
      "src/data/raw_data/movies_metadata.csv"
    );

    // Read only first 1000 lines to limit memory usage
    const fileContent = await fs.readFile(filePath, {
      encoding: "utf-8",
      flag: "r",
    });
    const lines = fileContent.split("\n").slice(0, 1001).join("\n"); // Include header + 1000 records

    // Parse CSV content
    const records = parse(lines, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true, // Add this to handle inconsistent column counts
      relax_quotes: true, // Add this to be more forgiving with quotes
      skip_records_with_error: true, // Add this to skip problematic records
    });

    console.log(records.length);

    // Transform and take records 35-40 instead (since we see good data there)
    const movies: MovieObject[] = records.slice(70, 80).map((record: any) => {
      const genres = (() => {
        try {
          // Clean up the string before parsing
          const cleanedGenres = record.genres
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/\s+/g, " ") // Normalize whitespace
            .trim(); // Remove any leading/trailing whitespace

          const genresData = JSON.parse(cleanedGenres || "[]");

          if (!Array.isArray(genresData)) return [];
          return genresData.map((g: { id: number; name: string }) => ({
            id: g.id,
            name: g.name,
          }));
        } catch (e) {
          console.warn(
            `Skipping genres for movie ${record.id} due to invalid data:`,
            record.genres,
            e
          );
          return []; // Return empty array instead of throwing error
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

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process movies data" },
      { status: 500 }
    );
  }
}
