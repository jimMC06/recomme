"use client";

import { useRouter } from "next/navigation";

export function Navbar() {
  // The App Router hook gives this shared layout component access to browser navigation.
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[92rem] items-center gap-3 px-4 py-3 sm:px-5">
        {/* The app name anchors the left side of the navigation bar. */}
        <div className="w-32 shrink-0">
          <p className="text-lg font-semibold tracking-tight text-white">
            RecomMe
          </p>
        </div>

        {/* The center search input is presentational for now and can be wired up later. */}
        <div className="min-w-0 flex-1">
          <input
            type="search"
            placeholder="Search songs, artists..."
            className="w-full rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-gray-500"
          />
        </div>

        {/* The right-side actions handle back navigation, home navigation, and a placeholder profile control. */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => router.push("/discover")}
            className="rounded-full border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
          >
            Home
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm text-white transition hover:border-gray-500"
            aria-label="Profile and settings"
          >
            P
          </button>
        </div>
      </div>
    </header>
  );
}
