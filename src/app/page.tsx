"use client";
import Image from "next/image";
import Search from "@/components/Search";
import MovieStack from "@/components/MovieStack";
import { useState } from "react";
import { mockMovies } from "@/data/json_db/mockMovies";

export default function Home() {
  const [moviesList, setMoviesList] = useState(mockMovies);

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
