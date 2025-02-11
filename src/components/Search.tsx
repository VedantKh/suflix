"use client";

export default function Search() {

  return (
    <div className="flex gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 px-4 py-2 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground/20"
      />
      <button
        className="p-2 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
        aria-label="Search"
      >
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
      </button>
    </div>
  );
}
