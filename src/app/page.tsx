"use client";
import Image from "next/image";
import Search from "@/components/Search";
import MovieStack from "@/components/MovieStack";
import { useState, useEffect } from "react";
import { MovieObject } from "@/types/movie";

export default function Home() {
  const [moviesRatingsList, setMoviesRatingsList] = useState<MovieObject[]>([]);
  const [moviesPopularityList, setMoviesPopularityList] = useState<
    MovieObject[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load of movies (no genre filter)
    fetchMovies();
  }, []);

  const fetchMovies = async (genre?: string) => {
    setIsLoading(true);
    try {
      const url = genre
        ? `/api/by_ratings?genre=${encodeURIComponent(genre)}`
        : "/api/by_ratings";
      const response = await fetch(url);
      const data = await response.json();
      setMoviesRatingsList(data.moviesByRating);
      setMoviesPopularityList(data.moviesByPopularity);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResults = (
    moviesByRating: MovieObject[],
    moviesByPopularity: MovieObject[]
  ) => {
    setMoviesRatingsList(moviesByRating);
    setMoviesPopularityList(moviesByPopularity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-1000 via-blue-900 to-gray-1000">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-inter)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-7xl">
          <h1 className="text-4xl font-bold text-center w-full text-white/90">
            {" "}
            Suflix{" "}
          </h1>
          <div className="w-full flex justify-center">
            <Search onSearchResults={handleSearchResults} />
          </div>
          <h3>Top rated (quality)</h3>
          <MovieStack movies={moviesRatingsList} isLoading={isLoading} />
          <h3>Most popular (everyone's seen it)</h3>
          <MovieStack movies={moviesPopularityList} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
