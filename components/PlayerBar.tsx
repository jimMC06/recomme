"use client";

import { useState } from "react";

import { SongActions } from "@/components/SongActions";
import { songs } from "@/data/songs";

// These placeholder songs let the player UI feel alive before real audio playback exists.
const playlist = songs.slice(0, 5);
// Each song gets a fake progress amount so the bar changes as the current track changes.
const progressSteps = [28, 46, 61, 34, 52];
// These times are also mock data for now and match the placeholder progress states above.
const timeSteps = [
  { current: "0:42", total: "2:31" },
  { current: "1:18", total: "2:49" },
  { current: "2:04", total: "3:22" },
  { current: "0:57", total: "2:45" },
  { current: "1:31", total: "3:05" },
];

export function PlayerBar() {
  // The current track index drives the displayed song, time, and queue state.
  const [currentIndex, setCurrentIndex] = useState(0);
  // This toggles the play button label until real playback logic is added.
  const [isPlaying, setIsPlaying] = useState(false);
  // This controls whether the queue shows one upcoming song or the full preview list.
  const [isQueueOpen, setIsQueueOpen] = useState(true);

  // These derived values keep the JSX below focused on display instead of data lookups.
  const currentSong = playlist[currentIndex];
  const progress = progressSteps[currentIndex];
  const time = timeSteps[currentIndex];
  const queue = playlist.filter((_, index) => index !== currentIndex);
  const visibleQueue = isQueueOpen ? queue.slice(0, 3) : queue.slice(0, 1);

  // The previous button wraps around to the end of the placeholder playlist.
  const goToPreviousSong = () => {
    setCurrentIndex((current) =>
      current === 0 ? playlist.length - 1 : current - 1
    );
  };

  // The next button wraps back to the first song after the last song.
  const goToNextSong = () => {
    setCurrentIndex((current) =>
      current === playlist.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-3 sm:px-4">
      {/* This row creates the long player strip on the left and the attached queue panel on the right. */}
      <div className="mx-auto flex w-full max-w-[92rem] items-end gap-2">
        <section className="flex-1 rounded-[28px] border border-gray-800 bg-gray-950/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
            {/* Song metadata stays on the left so the player reads like a real music app. */}
            <div className="min-w-0 lg:w-60">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
                Now playing
              </p>
              <h2 className="mt-1 truncate text-sm font-semibold text-white">
                {currentSong.title}
              </h2>
              <p className="truncate text-xs text-gray-400">{currentSong.artist}</p>
              <div className="mt-3">
                {/* The current song exposes the same preference actions as recommendation cards. */}
                <SongActions song={currentSong} compact />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              {/* These controls are intentionally simple placeholders for playback actions. */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousSong}
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
                  onClick={goToNextSong}
                  className="rounded-full border border-gray-700 px-3 py-1.5 text-xs font-medium text-white transition hover:border-gray-500"
                >
                  Next
                </button>
              </div>

              {/* The progress row stretches through the center section to keep the bar low and wide. */}
              <div className="mt-3 flex items-center gap-3">
                <span className="w-10 text-[11px] text-gray-400">{time.current}</span>
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

        {/* The queue panel is a separate box so it is visually attached but still distinct from the main strip. */}
        <aside className="w-72 rounded-[24px] border border-gray-800 bg-gray-950/95 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur">
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
      </div>
    </div>
  );
}
