"use client";
import Image from "next/image";
import Search from "@/components/Search";
import MovieStack from "@/components/MovieStack";
import { useState } from "react";
import { MovieObject } from "@/types/movie";

export default function Home() {
  const [moviesList, setMoviesList] = useState<MovieObject[]>([
    {
      id: 1,
      title: "Sample Movie 1",
      tagline: "An exciting adventure",
      overview: "This is a sample movie description",
      poster_path: "",
      release_date: "2024-03-20",
      vote_average: 8.5,
      genres: [{ id: 1, name: "Action" }],
      adult: false,
      original_language: "en",
      popularity: 1234.5,
      vote_count: 1000,
      video: false,
      original_title: "Sample Movie 1",
    },
    {
      id: 2,
      title: "Sample Movie 2",
      tagline: "A thrilling story",
      overview: "Another sample movie description",
      poster_path: "/7G9915LfUQ2lVfwMEEhDsn3kT4B.jpg",
      release_date: "2024-03-21",
      vote_average: 7.9,
      genres: [{ id: 2, name: "Drama" }, { id: 1, name: "Action" }],
      adult: false,
      original_language: "en",
      popularity: 987.6,
      vote_count: 800,
      video: false,
      original_title: "Sample Movie 2",
    },
  ]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center w-full"> Suflix </h1>
        <Search />
        <MovieStack movies={moviesList} />
      </main>
    </div>
  );
}
