import { MovieObject } from "@/types/movie";
import Image from "next/image";

interface MoviePreviewProps {
  movie: MovieObject;
}

export default function MoviePreview({ movie }: MoviePreviewProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "/placeholder-image.png"; // You'll need to add a placeholder image

  return (
    <div className="group relative w-full max-w-sm rounded-xl overflow-hidden">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl" />

      <div className="relative p-4 flex flex-col gap-4">
        {/* Image and rating */}
        <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-yellow-400 font-semibold">
              ★ {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Movie info */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold line-clamp-1">{movie.title}</h2>

          {movie.tagline && (
            <p className="text-sm italic text-foreground/70 line-clamp-1">
              {movie.tagline}
            </p>
          )}

          <p className="text-sm line-clamp-3">{movie.overview}</p>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-1 text-xs rounded-full bg-foreground/10 backdrop-blur-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Release date and other details */}
          <div className="flex items-center gap-4 text-sm text-foreground/70">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>•</span>
            <span>{movie.original_language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
