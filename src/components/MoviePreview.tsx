import { MovieObject } from "@/types/movie";

interface MoviePreviewProps {
  movie: MovieObject;
}

export default function MoviePreview({ movie }: MoviePreviewProps) {
  return (
    <div className="group relative w-full max-w-sm rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-lg" />

      {/* Hover overlay mask */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center gap-4">
        {/* Rating */}
        <div className="flex flex-col items-center">
          <span className="text-yellow-400 text-2xl">★</span>
          <span className="text-white font-bold text-lg">
            {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-white/70 text-xs">Rating</span>
        </div>

        {/* Vote Count */}
        <div className="flex flex-col items-center">
          <span className="text-blue-400 text-2xl">👥</span>
          <span className="text-white font-bold text-lg">
            {movie.vote_count.toLocaleString()}
          </span>
          <span className="text-white/70 text-xs">Votes</span>
        </div>

        {/* Popularity */}
        <div className="flex flex-col items-center">
          <span className="text-green-400 text-2xl">📈</span>
          <span className="text-white font-bold text-lg">
            {movie.popularity.toFixed(0)}
          </span>
          <span className="text-white/70 text-xs">Popularity</span>
        </div>
      </div>

      <div className="relative p-6 flex flex-col gap-4">
        {/* Movie info */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold line-clamp-1">{movie.title}</h2>

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
