"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";

import { AddToQueueButton } from "@/components/AddToQueueButton";
import { useSongLists } from "@/components/AppStateProvider";
import { PlaySongButton } from "@/components/PlaySongButton";
import { songs } from "@/data/songs";

type SongMixPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MatchFilter = "all" | "95+" | "90+" | "under-90";

type MixFilters = {
  vibe: string;
  task: string;
  popularity: string;
  match: MatchFilter;
};

const defaultMixFilters: MixFilters = {
  vibe: "All",
  task: "All",
  popularity: "All",
  match: "all",
};

const matchFilterOptions: { label: string; value: MatchFilter }[] = [
  { label: "All match scores", value: "all" },
  { label: "95%+", value: "95+" },
  { label: "90%+", value: "90+" },
  { label: "Under 90%", value: "under-90" },
];

export default function SongMixPage({ params }: SongMixPageProps) {
  const { id } = use(params);
  const startingSong = songs.find((song) => song.id === id);
  const [filters, setFilters] = useState<MixFilters>(defaultMixFilters);
  const { addToPlaylist, isSongInPlaylist } = useSongLists();

  const genreSongs = useMemo(() => {
    if (!startingSong) {
      return [];
    }

    return songs
      .filter(
        (song) => song.genre === startingSong.genre && song.id !== startingSong.id
      )
      .sort((firstSong, secondSong) => {
        const firstSubgenreMatch =
          firstSong.subgenre === startingSong.subgenre ? 1 : 0;
        const secondSubgenreMatch =
          secondSong.subgenre === startingSong.subgenre ? 1 : 0;

        if (firstSubgenreMatch !== secondSubgenreMatch) {
          return secondSubgenreMatch - firstSubgenreMatch;
        }

        return secondSong.match - firstSong.match;
      });
  }, [startingSong]);

  const vibeOptions = useMemo(
    () => ["All", ...new Set(genreSongs.map((song) => song.vibe))],
    [genreSongs]
  );
  const taskOptions = useMemo(
    () => ["All", ...new Set(genreSongs.map((song) => song.task))],
    [genreSongs]
  );
  const popularityOptions = useMemo(
    () => ["All", ...new Set(genreSongs.map((song) => song.popularity))],
    [genreSongs]
  );

  const mixSongs = useMemo(() => {
    return genreSongs
      .filter((song) => {
        const matchesVibe = filters.vibe === "All" || song.vibe === filters.vibe;
        const matchesTask = filters.task === "All" || song.task === filters.task;
        const matchesPopularity =
          filters.popularity === "All" || song.popularity === filters.popularity;
        const matchesScore =
          filters.match === "all" ||
          (filters.match === "95+" && song.match >= 95) ||
          (filters.match === "90+" && song.match >= 90) ||
          (filters.match === "under-90" && song.match < 90);

        return (
          matchesVibe && matchesTask && matchesPopularity && matchesScore
        );
      })
      .sort((firstSong, secondSong) => secondSong.match - firstSong.match);
  }, [filters, genreSongs]);

  if (!startingSong) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white sm:px-5">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-800 bg-gray-950 p-8">
          <h1 className="text-2xl font-bold">Song not found.</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-5">
      <div className="mx-auto grid max-w-7xl gap-6 pb-40 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-gray-800 bg-gray-950 p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-8rem)]">
          <h2 className="text-sm font-semibold text-white">Mix Filters</h2>
          <p className="mt-1 text-xs text-gray-500">
            Genre locked to {startingSong.genre}.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Genre
              </label>
              <div className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-gray-500">
                {startingSong.genre}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Vibe / Mood
              </label>
              <select
                value={filters.vibe}
                onChange={(event) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    vibe: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 outline-none transition focus:border-green-500"
              >
                {vibeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Task / Use case
              </label>
              <select
                value={filters.task}
                onChange={(event) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    task: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 outline-none transition focus:border-green-500"
              >
                {taskOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Popularity
              </label>
              <select
                value={filters.popularity}
                onChange={(event) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    popularity: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 outline-none transition focus:border-green-500"
              >
                {popularityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Match / Similarity
              </label>
              <select
                value={filters.match}
                onChange={(event) =>
                  setFilters((currentFilters) => ({
                    ...currentFilters,
                    match: event.target.value as MatchFilter,
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 outline-none transition focus:border-green-500"
              >
                {matchFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setFilters(defaultMixFilters)}
              className="w-full rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300 transition hover:border-gray-500"
            >
              Reset filters
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-green-400">
              Song Mix
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              {startingSong.title} Mix
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Based on {startingSong.title} by {startingSong.artist}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-green-900 bg-green-500/10 px-3 py-1 text-sm text-green-300">
                {startingSong.genre}
              </span>
              <span className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300">
                {startingSong.subgenre}
              </span>
              {startingSong.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {mixSongs.length > 0 ? (
            <div className="space-y-3">
              {mixSongs.map((song) => {
                const alreadyInPlaylist = isSongInPlaylist(song.id);

                return (
                  <article
                    key={song.id}
                    className="rounded-2xl border border-gray-800 bg-gray-950 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-start gap-3">
                              <PlaySongButton song={song} />
                              <div className="min-w-0">
                                <h2 className="truncate text-lg font-semibold text-white">
                                  {song.title}
                                </h2>
                                <p className="truncate text-sm text-gray-400">
                                  {song.artist}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="rounded-lg bg-green-500 px-3 py-1 text-sm font-semibold text-black">
                            {song.match}% Match
                          </p>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {song.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                        <button
                          type="button"
                          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
                        >
                          Preview
                        </button>
                        <AddToQueueButton
                          song={song}
                          className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => addToPlaylist(song)}
                            disabled={alreadyInPlaylist}
                            className="rounded-lg border border-green-900 px-3 py-2 text-sm text-green-300 transition hover:border-green-700 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-500"
                          >
                            {alreadyInPlaylist ? "Added" : "Add to Playlist"}
                          </button>
                          <Link
                            href={`/stats/${song.id}`}
                            className="flex items-center justify-center rounded-lg border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
                          >
                            Stats
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950 p-8 text-sm text-gray-400">
              No songs match these mix filters.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
