"use client";

import Link from "next/link";

import { AddToQueueButton } from "@/components/AddToQueueButton";
import { PlaySongButton } from "@/components/PlaySongButton";
import { SongActions } from "@/components/SongActions";
import type { Song } from "@/types/song";

type SongCardProps = {
  song: Song;
};

export function SongCard({ song }: SongCardProps) {
  return (
    // Each song card surfaces the most important metadata and a few placeholder actions.
    <article className="rounded-lg border border-gray-800 bg-gray-900 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <PlaySongButton song={song} />
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">
                {song.title}
              </h3>
              <p className="truncate text-sm text-gray-400">{song.artist}</p>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
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

        <div className="flex flex-wrap items-start gap-2 lg:max-w-md lg:justify-end">
          <p className="rounded-lg bg-green-500 px-3 py-1 text-sm font-semibold text-black">
            {song.match}% Match
          </p>
          <SongActions song={song} compact />
          <button className="rounded-lg border border-gray-700 px-3 py-2 text-sm">
            Preview
          </button>
          <AddToQueueButton
            song={song}
            className="rounded-lg border border-gray-700 px-3 py-2 text-sm"
          />
          <Link
            href={`/stats/${song.id}`}
            className="rounded-lg border border-gray-700 px-3 py-2 text-sm"
          >
            Stats
          </Link>
        </div>
      </div>
    </article>
  );
}
