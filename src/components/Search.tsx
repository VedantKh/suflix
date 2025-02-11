"use client";
import { useState, useEffect } from "react";
import { MovieObject } from "@/types/movie";

interface SearchProps {
  onSearchResults: (
    moviesByRating: MovieObject[],
    moviesByPopularity: MovieObject[]
  ) => void;
}

interface Genre {
  id: number;
  name: string;
}

export default function Search({ onSearchResults }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      console.log('Sending search request with term:', searchTerm);
      console.log('Available genres:', genres);
      
      // First, convert natural language to genre using Claude
      const genreResponse = await fetch("/api/convert-to-genre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchTerm,
          availableGenres: genres,
        }),
      });

      console.log('Genre response status:', genreResponse.status);
      console.log('Genre response headers:', genreResponse.headers);
      const responseText = await genreResponse.text();
      console.log('Raw response text:', responseText);
      
      const { matchedGenre } = JSON.parse(responseText);
      console.log('Matched genre:', matchedGenre);

      // Then use the matched genre to search for movies
      const response = await fetch(
        `/api/movies?genre=${encodeURIComponent(matchedGenre)}`
      );
      const data = await response.json();

      if (onSearchResults) {
        onSearchResults(data.moviesByRating, data.moviesByPopularity);
      }
    } catch (error) {
      console.error("Failed to search movies:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        const data = await response.json();
        setGenres(data.genres);
        console.log(data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  //   if (isLoading) {
  //     return <div>Loading genres...</div>;
  //   }

  return (
    <div className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Search by genre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="flex-1 px-4 py-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Search"
      >
        {isSearching ? (
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
