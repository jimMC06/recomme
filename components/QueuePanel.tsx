"use client";

import { useState } from "react";

import { SongActions } from "@/components/SongActions";
import { songs } from "@/data/songs";

// The queue uses the same temporary sample data as the player until real playback state exists.
const queueSongs = songs.slice(1, 5);

export function QueuePanel() {
  // This controls whether the queue shows one upcoming song or the full preview list.
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const visibleQueue = isQueueOpen ? queueSongs.slice(0, 3) : queueSongs.slice(0, 1);

  return (
    <aside className="pointer-events-auto fixed bottom-4 right-4 z-50 hidden w-72 rounded-[20px] border border-gray-800 bg-gray-950/95 px-4 py-2 shadow-2xl shadow-black/40 backdrop-blur md:block">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
          Queue
        </p>
        <button
          type="button"
          onClick={() => setIsQueueOpen((currentValue) => !currentValue)}
          aria-expanded={isQueueOpen}
          className="text-[10px] uppercase tracking-[0.18em] text-gray-500 transition hover:text-gray-300"
        >
          {isQueueOpen ? "Hide" : "Show"}
        </button>
      </div>
      <ul className="mt-2 space-y-2">
        {visibleQueue.map((song) => (
          <li
            key={song.id}
            className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-white">{song.title}</p>
                <p className="truncate text-xs text-gray-400">{song.artist}</p>
              </div>
              <span className="text-xs text-gray-500">{song.match}%</span>
            </div>

            <div className="mt-2">
              {/* Queue items reuse the same actions so users can react before a song starts playing. */}
              <SongActions song={song} compact noWrap />
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
