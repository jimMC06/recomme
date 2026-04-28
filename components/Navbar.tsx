"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import { songs } from "@/data/songs";

export function Navbar() {
  // The App Router hook gives this shared layout component access to browser navigation.
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [hasSearchError, setHasSearchError] = useState(false);
  const [showNotFoundToast, setShowNotFoundToast] = useState(false);

  const normalizedSearchValue = searchValue.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!normalizedSearchValue) {
      return [];
    }

    return songs
      .filter((song) => {
        const normalizedTitle = song.title.trim().toLowerCase();
        const normalizedArtist = song.artist.trim().toLowerCase();

        return (
          normalizedTitle.includes(normalizedSearchValue) ||
          normalizedArtist.includes(normalizedSearchValue)
        );
      })
      .slice(0, 5);
  }, [normalizedSearchValue]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const clearSearch = () => {
    setSearchValue("");
    setHasSearchError(false);
  };

  const navigateToSong = (songId: string) => {
    router.push(`/stats/${songId}`);
    clearSearch();
  };

  const showSearchError = () => {
    setHasSearchError(true);
    setShowNotFoundToast(true);

    window.setTimeout(() => {
      setHasSearchError(false);
    }, 700);

    window.setTimeout(() => {
      setShowNotFoundToast(false);
    }, 1000);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const exactTitleMatch = songs.find(
      (song) => song.title.trim().toLowerCase() === normalizedSearchValue
    );

    if (exactTitleMatch) {
      navigateToSong(exactTitleMatch.id);
      return;
    }

    const exactArtistMatch = songs.find(
      (song) => song.artist.trim().toLowerCase() === normalizedSearchValue
    );

    if (exactArtistMatch) {
      navigateToSong(exactArtistMatch.id);
      return;
    }

    showSearchError();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-black/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[92rem] items-center gap-3 px-4 py-3 sm:px-5">
        {/* The app name anchors the left side of the navigation bar. */}
        <div className="w-32 shrink-0">
          <p className="text-lg font-semibold tracking-tight text-white">
            RecomMe
          </p>
        </div>

        {/* The center search input searches the local prototype song data. */}
        <div className="relative min-w-0 flex-1">
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search songs, artists..."
            className={`w-full rounded-full border bg-gray-900 px-4 py-2 text-sm text-white outline-none transition placeholder:text-gray-500 ${
              hasSearchError
                ? "animate-recomme-shake border-red-500 focus:border-red-500"
                : "border-gray-700 focus:border-gray-500"
            }`}
          />

          {suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl shadow-black/40">
              {suggestions.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    navigateToSong(song.id);
                  }}
                  className="block w-full px-4 py-3 text-left transition hover:bg-gray-900"
                >
                  <span className="block truncate text-sm font-medium text-white">
                    {song.title}
                  </span>
                  <span className="block truncate text-xs text-gray-400">
                    {song.artist}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* The right-side actions handle back navigation, home navigation, and a placeholder profile control. */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
          >
            Back
          </button>
          <Link
            href="/"
            className="rounded-full border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
          >
            Home
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm text-white transition hover:border-gray-500"
            aria-label="Profile and settings"
          >
            P
          </button>
        </div>
      </div>

      {showNotFoundToast ? (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-gray-800 bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-2xl shadow-black/40">
          Song Not Found
        </div>
      ) : null}
    </header>
  );
}
