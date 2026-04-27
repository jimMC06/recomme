"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";

import { useSongLists } from "@/components/AppStateProvider";
import type { Song } from "@/types/song";

type SongActionsProps = {
  song: Song;
  compact?: boolean;
  noWrap?: boolean;
};

export function SongActions({
  song,
  compact = false,
  noWrap = false,
}: SongActionsProps) {
  // These shared handlers keep the action buttons consistent across cards, player UI, and queue items.
  const {
    likeSong,
    dislikeSong,
    addToPlaylist,
    isSongLiked,
    isSongDisliked,
    isSongInPlaylist,
  } = useSongLists();

  const buttonClassName = compact
    ? "rounded-lg border px-2 py-1 text-xs transition"
    : "rounded-lg border px-3 py-2 text-sm transition";
  const iconButtonClassName = compact
    ? "flex h-7 w-7 items-center justify-center rounded-lg border transition"
    : "flex h-10 w-10 items-center justify-center rounded-lg border transition";

  return (
    <div className={`flex gap-2 ${noWrap ? "flex-nowrap" : "flex-wrap"}`}>
      <button
        type="button"
        onClick={() => likeSong(song)}
        className={`${iconButtonClassName} ${
          isSongLiked(song.id)
            ? "border-green-500 bg-green-500/15 text-green-300"
            : "border-gray-700 text-gray-200 hover:border-gray-500"
        }`}
        aria-label="Like song"
        title="Like song"
      >
        {/* Lucide icons keep the reactions visually consistent with the rest of the interface. */}
        <ThumbsUp size={compact ? 14 : 16} />
      </button>

      <button
        type="button"
        onClick={() => dislikeSong(song)}
        className={`${iconButtonClassName} ${
          isSongDisliked(song.id)
            ? "border-red-500 bg-red-500/15 text-red-300"
            : "border-gray-700 text-gray-200 hover:border-gray-500"
        }`}
        aria-label="Dislike song"
        title="Dislike song"
      >
        <ThumbsDown size={compact ? 14 : 16} />
      </button>

      <button
        type="button"
        onClick={() => addToPlaylist(song)}
        className={`${buttonClassName} ${
          isSongInPlaylist(song.id)
            ? "border-blue-500 bg-blue-500/15 text-blue-300"
            : "border-gray-700 text-gray-200 hover:border-gray-500"
        }`}
      >
        Add to playlist
      </button>
    </div>
  );
}
