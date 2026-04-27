"use client";

import { useSongLists } from "@/components/AppStateProvider";

type DebugListProps = {
  title: string;
  songs: { id: string; title: string }[];
};

function DebugList({ title, songs }: DebugListProps) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
      {/* Each debug list shows the current contents of one temporary state array. */}
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-gray-300">
        {songs.length > 0 ? (
          songs.map((song) => <li key={song.id}>{song.title}</li>)
        ) : (
          <li className="text-gray-500">No songs yet</li>
        )}
      </ul>
    </div>
  );
}

export function DebugSongLists() {
  // This section is intentionally simple so state changes are easy to verify while building features.
  const { likedSongs, dislikedSongs, playlistSongs } = useSongLists();

  return (
    <section className="mt-8 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Debug Lists</h2>
        <p className="mt-1 text-sm text-gray-400">
          Temporary state output for likes, dislikes, and playlists.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DebugList title="Liked Songs" songs={likedSongs} />
        <DebugList title="Disliked Songs" songs={dislikedSongs} />
        <DebugList title="Playlist Songs" songs={playlistSongs} />
      </div>
    </section>
  );
}
