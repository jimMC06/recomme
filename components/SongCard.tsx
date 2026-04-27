"use client";

import { SongActions } from "@/components/SongActions";
import type { Song } from "@/types/song";

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  return (
    // Each song card surfaces the most important metadata and a few placeholder actions.
    <article className="rounded-lg border border-gray-800 bg-gray-900 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{song.title}</h3>
          <p className="text-sm text-gray-400">{song.artist}</p>
        </div>

        <p className="rounded-lg bg-green-500 px-3 py-1 text-sm font-semibold text-black">
          {song.match}% Match
        </p>
      </div>

      {/* These quick facts mirror the filter fields so users can compare songs quickly. */}
      <div className="mt-3 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
        <p>Genre: {song.genre}</p>
        <p>Vibe: {song.vibe}</p>
        <p>Task: {song.task}</p>
        <p>Popularity: {song.popularity}</p>
      </div>

      {/* Tags give a denser summary view without taking up much space. */}
      <div className="mt-3 flex flex-wrap gap-2">
        {song.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-700 px-2 py-1 text-xs text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Shared preference buttons are grouped separately from playback-related actions. */}
      <div className="mt-4">
        <SongActions song={song} />
      </div>

      {/* These buttons are placeholders for future interactive features. */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-lg border border-gray-700 px-3 py-2 text-sm">
          Preview
        </button>
        <button className="rounded-lg border border-gray-700 px-3 py-2 text-sm">
          Add to Queue
        </button>
        <button className="rounded-lg border border-gray-700 px-3 py-2 text-sm">
          Stats
        </button>
      </div>
    </article>
  );
}
