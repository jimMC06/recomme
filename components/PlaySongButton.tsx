"use client";

import { Play } from "lucide-react";

import { useSongLists } from "@/components/AppStateProvider";
import type { Song } from "@/types/song";

type PlaySongButtonProps = {
  song: Song;
  className?: string;
};

export function PlaySongButton({ song, className = "" }: PlaySongButtonProps) {
  const { playSongNow } = useSongLists();

  return (
    <button
      type="button"
      onClick={() => playSongNow(song)}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-700 text-gray-200 transition hover:border-green-700 hover:text-green-300 ${className}`}
      aria-label={`Play ${song.title}`}
      title="Play"
    >
      <Play size={15} fill="currentColor" />
    </button>
  );
}
