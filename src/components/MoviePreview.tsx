import { MovieObject } from "@/types/movie";

interface MoviePreviewProps {
  movie: MovieObject;
}

export default function MoviePreview({ movie }: MoviePreviewProps) {
  return (
    <div className="group relative w-full max-w-sm rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/15 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl shadow-lg" />

      <div className="relative p-6 flex flex-col gap-4">
        {/* Rating badge */}
        <div className="inline-flex self-end bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-white/10">
          <span className="text-yellow-400 font-semibold">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        </div>

        {/* Movie info */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold line-clamp-1">{movie.title}</h2>

          {movie.tagline && (
            <p className="text-sm italic text-foreground/80 line-clamp-1">
              {movie.tagline}
            </p>
          )}

          {/* <p className="text-sm text-foreground/90 line-clamp-3">
            {movie.overview}
          </p> */}

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-2.5 py-1 text-xs rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/10 shadow-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Release date and other details */}
          <div className="flex items-center gap-4 text-sm text-foreground/80">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>•</span>
            <span>{movie.original_language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
