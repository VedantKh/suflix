import { MovieObject } from "@/types/movie";
import MoviePreview from "./MoviePreview";
import MoviePreviewSkeleton from "./MoviePreviewSkeleton";

interface MovieStackProps {
  movies: MovieObject[];
  isLoading?: boolean;
  title?: string;
}

export default function MovieStack({
  movies,
  isLoading = false,
  title,
}: MovieStackProps) {
  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>}

      <div className="relative">
        {/* Gradient masks for scroll indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Scrollable container */}
        <div className="overflow-x-auto flex gap-4 px-4 pb-4 snap-x snap-mandatory">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="snap-start shrink-0">
                <MoviePreviewSkeleton />
              </div>
            ))
          ) : movies.length > 0 ? (
            // Show movies
            movies.map((movie) => (
              <div key={movie.id} className="snap-start shrink-0">
                <MoviePreview movie={movie} />
              </div>
            ))
          ) : (
            // Show message if no movies
            <div className="flex items-center justify-center w-full min-h-[400px] text-foreground/70">
              No movies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
