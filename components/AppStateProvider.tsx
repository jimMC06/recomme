"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Song } from "@/types/song";

type SongListsContextValue = {
  likedSongs: Song[];
  dislikedSongs: Song[];
  playlistSongs: Song[];
  likeSong: (song: Song) => void;
  dislikeSong: (song: Song) => void;
  addToPlaylist: (song: Song) => void;
  removeFromPlaylist: (songId: string) => void;
  isSongLiked: (songId: string) => boolean;
  isSongDisliked: (songId: string) => boolean;
  isSongInPlaylist: (songId: string) => boolean;
};

const SongListsContext = createContext<SongListsContextValue | undefined>(
  undefined
);

function addUniqueSong(currentSongs: Song[], nextSong: Song) {
  // This helper prevents duplicate entries when the same action is clicked more than once.
  if (currentSongs.some((song) => song.id === nextSong.id)) {
    return currentSongs;
  }

  return [...currentSongs, nextSong];
}

type AppStateProviderProps = {
  children: ReactNode;
};

export function AppStateProvider({ children }: AppStateProviderProps) {
  // These lists are intentionally simple local arrays until a backend or persistence layer exists.
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [dislikedSongs, setDislikedSongs] = useState<Song[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

  const likeSong = (song: Song) => {
    // Clicking like again toggles it off, while still clearing the disliked list when turning it on.
    setLikedSongs((currentSongs) =>
      currentSongs.some((currentSong) => currentSong.id === song.id)
        ? currentSongs.filter((currentSong) => currentSong.id !== song.id)
        : addUniqueSong(currentSongs, song)
    );
    setDislikedSongs((currentSongs) =>
      currentSongs.filter((currentSong) => currentSong.id !== song.id)
    );
  };

  const dislikeSong = (song: Song) => {
    // Clicking dislike again toggles it off, while still clearing the liked list when turning it on.
    setDislikedSongs((currentSongs) =>
      currentSongs.some((currentSong) => currentSong.id === song.id)
        ? currentSongs.filter((currentSong) => currentSong.id !== song.id)
        : addUniqueSong(currentSongs, song)
    );
    setLikedSongs((currentSongs) =>
      currentSongs.filter((currentSong) => currentSong.id !== song.id)
    );
  };

  const addToPlaylist = (song: Song) => {
    // Playlist additions stay append-only for now and ignore duplicate clicks.
    setPlaylistSongs((currentSongs) => addUniqueSong(currentSongs, song));
  };

  const removeFromPlaylist = (songId: string) => {
    // Removing a song updates the visible playlist immediately by filtering it out of the shared list.
    setPlaylistSongs((currentSongs) =>
      currentSongs.filter((song) => song.id !== songId)
    );
  };

  const value = useMemo(
    () => ({
      likedSongs,
      dislikedSongs,
      playlistSongs,
      likeSong,
      dislikeSong,
      addToPlaylist,
      removeFromPlaylist,
      isSongLiked: (songId: string) =>
        likedSongs.some((song) => song.id === songId),
      isSongDisliked: (songId: string) =>
        dislikedSongs.some((song) => song.id === songId),
      isSongInPlaylist: (songId: string) =>
        playlistSongs.some((song) => song.id === songId),
    }),
    [likedSongs, dislikedSongs, playlistSongs]
  );

  return (
    <SongListsContext.Provider value={value}>
      {children}
    </SongListsContext.Provider>
  );
}

export function useSongLists() {
  const context = useContext(SongListsContext);

  if (!context) {
    throw new Error("useSongLists must be used within AppStateProvider");
  }

  return context;
}
