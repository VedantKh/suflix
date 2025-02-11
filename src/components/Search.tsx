"use client";
import { useState } from "react";
import { MovieObject } from "@/types/movie"; 

interface SearchProps {
  onSearchResults: (
    moviesByRating: MovieObject[],
    moviesByPopularity: MovieObject[]
  ) => void;
}

export default function Search({ onSearchResults }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/by_ratings?genre=${encodeURIComponent(searchTerm)}`
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
