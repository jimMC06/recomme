"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PlaySongButton } from "@/components/PlaySongButton";
import { useSongLists } from "@/components/AppStateProvider";
import { songs } from "@/data/songs";

type MatchFilter = "all" | "95+" | "90+" | "under-90";

type RecommendationFilters = {
  genre: string;
  vibe: string;
  task: string;
  popularity: string;
  match: MatchFilter;
  count: number;
};

const defaultRecommendationFilters: RecommendationFilters = {
  genre: "All",
  vibe: "All",
  task: "All",
  popularity: "All",
  match: "all",
  count: 5,
};

const matchFilterOptions: { label: string; value: MatchFilter }[] = [
  { label: "All match scores", value: "all" },
  { label: "95%+", value: "95+" },
  { label: "90%+", value: "90+" },
  { label: "Under 90%", value: "under-90" },
];

const recommendationCountOptions = [3, 5, 8, 10];

export default function PlaylistPage() {
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  const [recommendationFilters, setRecommendationFilters] =
    useState<RecommendationFilters>(defaultRecommendationFilters);
  // The shared playlist state keeps this page in sync with songs added from elsewhere in the app.
  const {
    likedSongs,
    dislikedSongs,
    playlistSongs,
    savedPlaylists,
    activePlaylistName,
    setActivePlaylistName,
    addToPlaylist,
    removeFromPlaylist,
    savePlaylist,
    loadPlaylist,
    loadLikedSongs,
    loadDislikedSongs,
    deletePlaylist,
    createNewPlaylist,
    playPlaylistNow,
    isSongInPlaylist,
  } = useSongLists();

  const genreOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.genre))],
    []
  );
  const vibeOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.vibe))],
    []
  );
  const taskOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.task))],
    []
  );
  const popularityOptions = useMemo(
    () => ["All", ...new Set(songs.map((song) => song.popularity))],
    []
  );

  const filteredRecommendationSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesGenre =
        recommendationFilters.genre === "All" ||
        song.genre === recommendationFilters.genre;
      const matchesVibe =
        recommendationFilters.vibe === "All" ||
        song.vibe === recommendationFilters.vibe;
      const matchesTask =
        recommendationFilters.task === "All" ||
        song.task === recommendationFilters.task;
      const matchesPopularity =
        recommendationFilters.popularity === "All" ||
        song.popularity === recommendationFilters.popularity;
      const matchesScore =
        recommendationFilters.match === "all" ||
        (recommendationFilters.match === "95+" && song.match >= 95) ||
        (recommendationFilters.match === "90+" && song.match >= 90) ||
        (recommendationFilters.match === "under-90" && song.match < 90);

      return (
        matchesGenre &&
        matchesVibe &&
        matchesTask &&
        matchesPopularity &&
        matchesScore
      );
    });
  }, [recommendationFilters]);

  const recommendedSongs = useMemo(() => {
    if (filteredRecommendationSongs.length === 0) {
      return [];
    }

    const rotatedSongs = filteredRecommendationSongs.map(
      (_, index) =>
        filteredRecommendationSongs[
          (index + recommendationOffset) % filteredRecommendationSongs.length
        ]
    );

    return rotatedSongs
      .slice(0, recommendationFilters.count)
      .sort((firstSong, secondSong) => secondSong.match - firstSong.match);
  }, [
    filteredRecommendationSongs,
    recommendationFilters.count,
    recommendationOffset,
  ]);

  return (
    <main className="min-h-screen bg-black px-4 py-4 text-white sm:px-5 sm:py-5">
      <div className="mx-auto grid max-w-[100rem] gap-6 pb-40 lg:grid-cols-[18rem_minmax(0,1fr)_16rem]">
        <aside className="rounded-2xl border border-gray-800 bg-gray-950 p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-8rem)]">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Recommendation Filters
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Applies only to Recommended Songs.
            </p>
          </div>

          <div className="mt-4 max-h-[32rem] space-y-4 overflow-y-auto pr-1">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Genre
              </label>
              <select
                value={recommendationFilters.genre}
                onChange={(event) =>
                  setRecommendationFilters((currentFilters) => ({
                    ...currentFilters,
                    genre: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 outline-none transition focus:border-green-500"
              >
                {genreOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Vibe / Mood
              </label>
              <select
                value={recommendationFilters.vibe}
                onChange={(event) =>
                  setRecommendationFilters((currentFilters) => ({
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
                value={recommendationFilters.task}
                onChange={(event) =>
                  setRecommendationFilters((currentFilters) => ({
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
                value={recommendationFilters.popularity}
                onChange={(event) =>
                  setRecommendationFilters((currentFilters) => ({
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
                Match strictness
              </label>
              <select
                value={recommendationFilters.match}
                onChange={(event) =>
                  setRecommendationFilters((currentFilters) => ({
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

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Number of songs
              </label>
              <select
                value={recommendationFilters.count}
                onChange={(event) =>
                  setRecommendationFilters((currentFilters) => ({
                    ...currentFilters,
                    count: Number(event.target.value),
                  }))
                }
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 outline-none transition focus:border-green-500"
              >
                {recommendationCountOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() =>
                setRecommendationFilters(defaultRecommendationFilters)
              }
              className="w-full rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-300 transition hover:border-gray-500"
            >
              Reset filters
            </button>
          </div>
        </aside>

        <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold sm:text-3xl">Playlist Maker</h1>
            <p className="mt-2 text-sm text-gray-400">
              Build a playlist from the songs you have saved so far.
            </p>

            {/* This input gives the playlist a simple editable name before export is implemented. */}
            <label className="mt-4 block text-sm font-medium text-gray-300">
              Playlist name
            </label>
            <input
              type="text"
              value={activePlaylistName}
              onChange={(event) => setActivePlaylistName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => playPlaylistNow(playlistSongs)}
              className="rounded-xl border border-green-900 px-4 py-3 text-sm font-medium text-green-300 transition hover:border-green-700 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-500"
              disabled={playlistSongs.length === 0}
            >
              Play Playlist
            </button>
            <button
              type="button"
              onClick={() => savePlaylist(activePlaylistName, playlistSongs)}
              className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-white transition hover:border-gray-500"
            >
              Save Playlist
            </button>
            <button
              type="button"
              className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-white transition hover:border-gray-500"
            >
              Export Playlist
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Playlist Songs</h2>
          <p className="text-sm text-gray-400">
            {playlistSongs.length} song{playlistSongs.length === 1 ? "" : "s"}
          </p>
        </div>

        {playlistSongs.length > 0 ? (
          <div className="space-y-4">
            {playlistSongs.map((song) => (
              <article
                key={song.id}
                className="rounded-2xl border border-gray-800 bg-gray-950 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    {/* The main song details match the styling used across the rest of the app. */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-start gap-3">
                          <PlaySongButton song={song} />
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-semibold text-white">
                              {song.title}
                            </h3>
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

                    {song.tags.length > 0 ? (
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
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                    {/* These actions stay simple placeholders except for playlist removal. */}
                    <button
                      type="button"
                      className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromPlaylist(song.id)}
                      className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-300 transition hover:border-red-700"
                    >
                      Remove from Playlist
                    </button>
                    <Link
                      href={`/stats/${song.id}`}
                      className="flex items-center justify-center rounded-lg border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
                    >
                      Stats
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950 p-8 text-sm text-gray-400">
            No songs in your playlist yet. Add songs from Discover to start
            building one.
          </div>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Recommended Songs
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Suggestions based on the current sample song list.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setRecommendationOffset(
                  (currentOffset) => (currentOffset + 2) % songs.length
                )
              }
              className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-white transition hover:border-gray-500"
            >
              Refresh recommendations
            </button>
          </div>

          {recommendedSongs.length > 0 ? (
          <div className="space-y-3">
              {recommendedSongs.map((song) => {
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
                              <h3 className="truncate text-lg font-semibold text-white">
                                {song.title}
                              </h3>
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

                      {song.tags.length > 0 ? (
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
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-white transition hover:border-gray-500"
                      >
                        Preview
                      </button>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => addToPlaylist(song)}
                          disabled={alreadyInPlaylist}
                          className="rounded-lg border border-green-900 px-3 py-2 text-sm text-green-300 transition hover:border-green-700 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-500"
                        >
                          {alreadyInPlaylist ? "Added" : "Add to playlist"}
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
            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950 p-6 text-sm text-gray-400">
              No songs match these filters.
            </div>
          )}
        </section>
        </div>

        <aside className="rounded-2xl border border-gray-800 bg-gray-950 p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Your Playlists</h2>
            <span className="text-xs text-gray-500">
              {savedPlaylists.length}
            </span>
          </div>

          <div className="mt-4 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={createNewPlaylist}
              className="w-full rounded-xl border border-gray-700 px-3 py-2 text-left text-xs font-medium text-green-300 transition hover:border-green-700"
            >
              + New Playlist
            </button>

            <button
              type="button"
              onClick={loadLikedSongs}
              className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition ${
                activePlaylistName === "Liked Songs"
                  ? "border-green-700 bg-green-500/10 text-green-300"
                  : "border-gray-800 text-gray-300 hover:border-gray-700"
              }`}
            >
              <span className="block font-medium">Liked Songs</span>
              <span className="mt-1 block text-[11px] text-gray-500">
                {likedSongs.length} song{likedSongs.length === 1 ? "" : "s"}
              </span>
            </button>

            {savedPlaylists.map((playlist) => (
              <div
                key={playlist.name}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
                  activePlaylistName === playlist.name
                    ? "border-green-700 bg-green-500/10"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => loadPlaylist(playlist.name)}
                  className="min-w-0 flex-1 text-left text-xs"
                >
                  <span className="block truncate font-medium text-white">
                    {playlist.name}
                  </span>
                  <span className="mt-1 block text-[11px] text-gray-500">
                    {playlist.songs.length} song
                    {playlist.songs.length === 1 ? "" : "s"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deletePlaylist(playlist.name)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-800 text-gray-500 transition hover:border-red-800 hover:text-red-300"
                  aria-label={`Delete ${playlist.name}`}
                  title="Delete playlist"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={loadDislikedSongs}
              className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition ${
                activePlaylistName === "Disliked Songs"
                  ? "border-green-700 bg-green-500/10 text-green-300"
                  : "border-gray-800 text-gray-300 hover:border-gray-700"
              }`}
            >
              <span className="block font-medium">Disliked Songs</span>
              <span className="mt-1 block text-[11px] text-gray-500">
                {dislikedSongs.length} song
                {dislikedSongs.length === 1 ? "" : "s"}
              </span>
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
