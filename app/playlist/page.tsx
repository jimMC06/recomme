"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useSongLists } from "@/components/AppStateProvider";
import { songs } from "@/data/songs";

export default function PlaylistPage() {
  // The playlist name is local to this page for now until save/export is backed by real storage.
  const [playlistName, setPlaylistName] = useState("My RecomMe Playlist");
  const [recommendationOffset, setRecommendationOffset] = useState(0);
  // The shared playlist state keeps this page in sync with songs added from elsewhere in the app.
  const { playlistSongs, addToPlaylist, removeFromPlaylist, isSongInPlaylist } =
    useSongLists();

  const recommendedSongs = useMemo(() => {
    const rotatedSongs = songs.map(
      (_, index) => songs[(index + recommendationOffset) % songs.length]
    );

    return rotatedSongs
      .slice(0, 5)
      .sort((firstSong, secondSong) => secondSong.match - firstSong.match);
  }, [recommendationOffset]);

  return (
    <main className="min-h-screen bg-black px-4 py-4 text-white sm:px-5 sm:py-5">
      <div className="mx-auto max-w-5xl space-y-6 pb-32">
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
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500"
            />
          </div>

          <button
            type="button"
            className="rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-white transition hover:border-gray-500"
          >
            Export Playlist
          </button>
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
                        <h3 className="truncate text-lg font-semibold text-white">
                          {song.title}
                        </h3>
                        <p className="truncate text-sm text-gray-400">
                          {song.artist}
                        </p>
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
                          <h3 className="truncate text-lg font-semibold text-white">
                            {song.title}
                          </h3>
                          <p className="truncate text-sm text-gray-400">
                            {song.artist}
                          </p>
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
        </section>
      </div>
    </main>
  );
}
