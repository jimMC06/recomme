"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { songs } from "@/data/songs";
import type { Song } from "@/types/song";

type SavedPlaylist = {
  name: string;
  songs: Song[];
};

type SongListsContextValue = {
  likedSongs: Song[];
  dislikedSongs: Song[];
  playlistSongs: Song[];
  savedPlaylists: SavedPlaylist[];
  activePlaylistName: string;
  queueSongs: Song[];
  songHistory: Song[];
  currentSong: Song;
  setActivePlaylistName: (name: string) => void;
  likeSong: (song: Song) => void;
  dislikeSong: (song: Song) => void;
  addToPlaylist: (song: Song) => void;
  removeFromPlaylist: (songId: string) => void;
  savePlaylist: (name: string, playlistSongsToSave: Song[]) => void;
  loadPlaylist: (name: string) => void;
  loadLikedSongs: () => void;
  loadDislikedSongs: () => void;
  deletePlaylist: (name: string) => void;
  createNewPlaylist: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  playSongNow: (song: Song) => void;
  playPlaylistNow: (songsToPlay: Song[]) => void;
  playNextFromQueue: () => void;
  playPreviousFromHistory: () => void;
  isSongLiked: (songId: string) => boolean;
  isSongDisliked: (songId: string) => boolean;
  isSongInPlaylist: (songId: string) => boolean;
  isSongInQueue: (songId: string) => boolean;
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
  const [savedPlaylists, setSavedPlaylists] = useState<SavedPlaylist[]>([]);
  const [activePlaylistName, setActivePlaylistName] = useState(
    "My RecomMe Playlist"
  );
  const [queueSongs, setQueueSongs] = useState<Song[]>([]);
  const [songHistory, setSongHistory] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);

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
    if (activePlaylistName === "Liked Songs") {
      setLikedSongs((currentSongs) =>
        currentSongs.filter((song) => song.id !== songId)
      );
      return;
    }

    if (activePlaylistName === "Disliked Songs") {
      setDislikedSongs((currentSongs) =>
        currentSongs.filter((song) => song.id !== songId)
      );
      return;
    }

    // Removing a song updates the visible playlist immediately by filtering it out of the shared list.
    setPlaylistSongs((currentSongs) =>
      currentSongs.filter((song) => song.id !== songId)
    );
  };

  const savePlaylist = (name: string, playlistSongsToSave: Song[]) => {
    const trimmedName = name.trim();
    const playlistNameToSave = trimmedName || "Untitled Playlist";

    setSavedPlaylists((currentPlaylists) => {
      const alreadyExists = currentPlaylists.some(
        (playlist) => playlist.name === playlistNameToSave
      );

      if (alreadyExists) {
        return currentPlaylists.map((playlist) =>
          playlist.name === playlistNameToSave
            ? { ...playlist, songs: playlistSongsToSave }
            : playlist
        );
      }

      return [
        ...currentPlaylists,
        { name: playlistNameToSave, songs: playlistSongsToSave },
      ];
    });
    setActivePlaylistName(playlistNameToSave);
    setPlaylistSongs(playlistSongsToSave);
  };

  const loadPlaylist = (name: string) => {
    const playlistToLoad = savedPlaylists.find(
      (playlist) => playlist.name === name
    );

    if (!playlistToLoad) {
      return;
    }

    setActivePlaylistName(playlistToLoad.name);
    setPlaylistSongs(playlistToLoad.songs);
  };

  const loadLikedSongs = () => {
    setActivePlaylistName("Liked Songs");
    setPlaylistSongs(likedSongs);
  };

  const loadDislikedSongs = () => {
    setActivePlaylistName("Disliked Songs");
    setPlaylistSongs(dislikedSongs);
  };

  const deletePlaylist = (name: string) => {
    setSavedPlaylists((currentPlaylists) =>
      currentPlaylists.filter((playlist) => playlist.name !== name)
    );

    if (activePlaylistName === name) {
      setActivePlaylistName("");
      setPlaylistSongs([]);
    }
  };

  const createNewPlaylist = () => {
    setActivePlaylistName("");
    setPlaylistSongs([]);
  };

  const addToQueue = (song: Song) => {
    // Queue additions are unique so repeated clicks do not stack the same song.
    setQueueSongs((currentSongs) => addUniqueSong(currentSongs, song));
  };

  const removeFromQueue = (songId: string) => {
    setQueueSongs((currentSongs) =>
      currentSongs.filter((song) => song.id !== songId)
    );
  };

  const playSongNow = (song: Song) => {
    setCurrentSong(song);
  };

  const playPlaylistNow = (songsToPlay: Song[]) => {
    const [firstSong, ...remainingSongs] = songsToPlay;

    if (!firstSong) {
      return;
    }

    setCurrentSong(firstSong);
    setQueueSongs(remainingSongs);
    setSongHistory([]);
  };

  const playNextFromQueue = () => {
    setQueueSongs((currentQueue) => {
      const [nextSong, ...remainingQueue] = currentQueue;

      if (!nextSong) {
        return currentQueue;
      }

      setSongHistory((currentHistory) => [...currentHistory, currentSong]);
      setCurrentSong(nextSong);
      return remainingQueue;
    });
  };

  const playPreviousFromHistory = () => {
    setSongHistory((currentHistory) => {
      const previousSong = currentHistory[currentHistory.length - 1];

      if (!previousSong) {
        return currentHistory;
      }

      setCurrentSong(previousSong);
      return currentHistory.slice(0, -1);
    });
  };

  const visiblePlaylistSongs =
    activePlaylistName === "Liked Songs"
      ? likedSongs
      : activePlaylistName === "Disliked Songs"
        ? dislikedSongs
        : playlistSongs;

  const value = {
    likedSongs,
    dislikedSongs,
    playlistSongs: visiblePlaylistSongs,
    savedPlaylists,
    activePlaylistName,
    queueSongs,
    songHistory,
    currentSong,
    setActivePlaylistName,
    likeSong,
    dislikeSong,
    addToPlaylist,
    removeFromPlaylist,
    savePlaylist,
    loadPlaylist,
    loadLikedSongs,
    loadDislikedSongs,
    deletePlaylist,
    createNewPlaylist,
    addToQueue,
    removeFromQueue,
    playSongNow,
    playPlaylistNow,
    playNextFromQueue,
    playPreviousFromHistory,
    isSongLiked: (songId: string) =>
      likedSongs.some((song) => song.id === songId),
    isSongDisliked: (songId: string) =>
      dislikedSongs.some((song) => song.id === songId),
    isSongInPlaylist: (songId: string) =>
      visiblePlaylistSongs.some((song) => song.id === songId),
    isSongInQueue: (songId: string) =>
      queueSongs.some((song) => song.id === songId),
  };

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
