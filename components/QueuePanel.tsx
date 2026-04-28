"use client";

import { Minus } from "lucide-react";
import { useState } from "react";

import { useSongLists } from "@/components/AppStateProvider";
import { SongActions } from "@/components/SongActions";

export function QueuePanel() {
  // This controls whether the queue shows one upcoming song or the full preview list.
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const { queueSongs, removeFromQueue } = useSongLists();

  const visibleQueue = isQueueOpen ? queueSongs : queueSongs.slice(0, 1);

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
      <ul className="mt-2 max-h-80 space-y-2 overflow-y-auto pr-1">
        {visibleQueue.length > 0 ? (
          visibleQueue.map((song) => (
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

              <div className="mt-2 flex items-center justify-between gap-2">
                {/* Queue items reuse the same actions so users can react before a song starts playing. */}
                <SongActions song={song} compact noWrap />
                <button
                  type="button"
                  onClick={() => removeFromQueue(song.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition hover:border-red-700 hover:text-red-300"
                  aria-label={`Remove ${song.title} from queue`}
                  title="Remove from queue"
                >
                  <Minus size={14} />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li
            className="rounded-xl border border-dashed border-gray-800 bg-black/20 px-3 py-4 text-sm text-gray-500"
          >
            Queue is empty
          </li>
        )}
      </ul>
    </aside>
  );
}
