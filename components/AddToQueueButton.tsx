"use client";

import { useSongLists } from "@/components/AppStateProvider";
import type { Song } from "@/types/song";

type AddToQueueButtonProps = {
  song: Song;
  className: string;
};

export function AddToQueueButton({ song, className }: AddToQueueButtonProps) {
  const { addToQueue, isSongInQueue } = useSongLists();
  const alreadyInQueue = isSongInQueue(song.id);

  return (
    <button
      type="button"
      onClick={() => addToQueue(song)}
      disabled={alreadyInQueue}
      className={`${className} min-w-[6.75rem] disabled:cursor-not-allowed`}
    >
      {alreadyInQueue ? "In Queue" : "Add to Queue"}
    </button>
  );
}
