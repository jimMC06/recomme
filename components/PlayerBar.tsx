"use client";

import Link from "next/link";
import { useState } from "react";

import { useSongLists } from "@/components/AppStateProvider";
import { SongActions } from "@/components/SongActions";

function getProgress(match: number) {
  return Math.max(24, Math.min(72, match - 24));
}

function getPlaybackTime(match: number) {
  const currentSeconds = 35 + (match % 80);
  const totalSeconds = 165 + (match % 75);

  return {
    current: `${Math.floor(currentSeconds / 60)}:${String(currentSeconds % 60).padStart(2, "0")}`,
    total: `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`,
  };
}

export function PlayerBar() {
  // This toggles the play button label until real playback logic is added.
  const [isPlaying, setIsPlaying] = useState(false);
  const { currentSong, playNextFromQueue, playPreviousFromHistory } =
    useSongLists();
  const progress = getProgress(currentSong.match);
  const time = getPlaybackTime(currentSong.match);

  return (
    <section className="pointer-events-auto fixed bottom-4 left-4 right-4 z-50 rounded-[24px] border border-gray-800 bg-gray-950/95 px-4 py-2 shadow-2xl shadow-black/40 backdrop-blur md:right-[22rem] md:px-5">
      <Link
        href={`/stats/${currentSong.id}`}
        className="absolute right-4 top-2 rounded-lg border border-gray-700 px-2 py-1 text-xs text-gray-200 transition hover:border-gray-500"
      >
        Stats
      </Link>
      <div className="flex flex-col gap-2 pr-16 lg:flex-row lg:items-center lg:gap-5">
        {/* Song metadata stays on the left so the player reads like a real music app. */}
        <div className="min-w-0 lg:w-60">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
            Now playing
          </p>
          <h2 className="mt-1 truncate text-sm font-semibold text-white">
            {currentSong.title}
          </h2>
          <p className="truncate text-xs text-gray-400">{currentSong.artist}</p>
          <div className="mt-2">
            {/* The current song exposes the same preference actions as recommendation cards. */}
            <SongActions song={currentSong} compact />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* These controls are intentionally simple placeholders for playback actions. */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={playPreviousFromHistory}
              className="rounded-full border border-gray-700 px-3 py-1.5 text-xs font-medium text-white transition hover:border-gray-500"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((current) => !current)}
              className="rounded-full border border-gray-700 bg-white px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-gray-200"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={playNextFromQueue}
              className="rounded-full border border-gray-700 px-3 py-1.5 text-xs font-medium text-white transition hover:border-gray-500"
            >
              Next
            </button>
          </div>

          {/* The progress row stretches through the center section to keep the bar low and wide. */}
          <div className="mt-2 flex items-center gap-3">
            <span className="w-10 text-[11px] text-gray-400">
              {time.current}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-10 text-right text-[11px] text-gray-400">
              {time.total}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
