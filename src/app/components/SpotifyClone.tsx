// components/SpotifyClone.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { usePlaylists } from '../hooks/usePlaylists';
import { useFileUpload } from '../hooks/useFileUpload';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import MainContent from './MainContent';
import Player from './Player';
import AddToPlaylistModal from './AddToPlaylistModal';
import { Song, Playlist } from '../type';
import { DEFAULT_SONGS } from '../data/defaultSongs';

// ---------- IndexedDB Helper (inline to avoid import issues) ----------
const DB_NAME = 'SpotifyCloneDB';
const DB_VERSION = 1;
const SONGS_STORE = 'localSongs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(SONGS_STORE)) {
        db.createObjectStore(SONGS_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveSongToDB(song: Song): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(SONGS_STORE, 'readwrite');
    const store = transaction.objectStore(SONGS_STORE);
    return new Promise((resolve, reject) => {
      const request = store.put(song);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  } catch (err) {
    console.error('Failed to save song to IndexedDB:', err);
  }
}

async function getAllSongsFromDB(): Promise<Song[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction(SONGS_STORE, 'readonly');
    const store = transaction.objectStore(SONGS_STORE);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => { db.close(); resolve(request.result || []); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  } catch (err) {
    console.error('Failed to load songs from IndexedDB:', err);
    return [];
  }
}

async function deleteSongFromDB(songId: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(SONGS_STORE, 'readwrite');
    const store = transaction.objectStore(SONGS_STORE);
    return new Promise((resolve, reject) => {
      const request = store.delete(songId);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  } catch (err) {
    console.error('Failed to delete song from IndexedDB:', err);
  }
}

// ---------- Main Component ----------
export default function SpotifyClone() {
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("all");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [trackToAdd, setTrackToAdd] = useState<Song | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentTrack,
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffle,
    audioRef,
    togglePlay,
    handleNext,
    handlePrev,
    seekTo,
    changeVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    playSongAtIndex,
  } = useAudioPlayer(songs);

  const {
    playlists,
    favorites,
    toggleFavorite,
    createPlaylist: createPlaylistHook,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  } = usePlaylists();

  const { isUploading, uploadProgress, handleFileUpload } = useFileUpload(
    setSongs,
    playlists,
  );

  // Load local songs from IndexedDB on mount (NOT localStorage)
  useEffect(() => {
    const loadLocalSongs = async () => {
      try {
        const localSongs = await getAllSongsFromDB();
        if (localSongs.length > 0) {
          setSongs((prev) => {
            const merged = [...prev];
            localSongs.forEach((localSong: Song) => {
              if (!merged.find((s) => s.id === localSong.id)) {
                merged.push(localSong);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Failed to load local songs from IndexedDB:', err);
      }
    };
    loadLocalSongs();
  }, []);

  // Filter songs based on selected playlist
  const getFilteredSongs = useCallback((): Song[] => {
    if (selectedPlaylistId === "all") return songs;
    if (selectedPlaylistId === "favorites") {
      return songs.filter((song) => favorites.includes(song.id));
    }
    const activePlaylist = playlists.find((p) => p.id === selectedPlaylistId);
    if (activePlaylist) {
      return songs.filter((song) => activePlaylist.songIds.includes(song.id));
    }
    return songs;
  }, [selectedPlaylistId, songs, favorites, playlists]);

  const isCustomPlaylist = selectedPlaylistId !== "all" && selectedPlaylistId !== "favorites";
  const localSongsCount = songs.filter((s) => s.isLocal).length;

  // Handle create playlist form
  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylistHook(newPlaylistName.trim());
    setNewPlaylistName("");
  };

  // Handle play song
  const handlePlaySong = (song: Song) => {
    const index = songs.findIndex((s) => s.id === song.id);
    if (index !== -1) {
      playSongAtIndex(index);
    }
  };

  // Handle add to playlist
  const handleAddToPlaylistClick = (song: Song) => {
    setTrackToAdd(song);
    setShowAddModal(true);
  };

  // Handle create and add
  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !trackToAdd) return;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      songIds: [trackToAdd.id],
    };
    const updatedPlaylists = [...playlists, newPlaylist];
    localStorage.setItem('spotify_playlists', JSON.stringify(updatedPlaylists));
    setNewPlaylistName("");
    setShowAddModal(false);
    setTrackToAdd(null);
    window.location.reload();
  };

  // Handle delete local song (using IndexedDB)
  const handleDeleteLocal = async (songId: string) => {
    const song = songs.find((s) => s.id === songId);
    if (!song?.isLocal) return;

    if (window.confirm(`Delete "${song.title}" from your library?`)) {
      // Revoke blob URL if exists
      if (song.url && song.url.startsWith('blob:')) {
        URL.revokeObjectURL(song.url);
      }

      // Stop playback if this song is playing
      if (currentTrack?.id === songId) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
      }

      // Delete from IndexedDB
      await deleteSongFromDB(songId);

      // Remove from state
      const updatedSongs = songs.filter((s) => s.id !== songId);
      setSongs(updatedSongs);

      // Update current track index if needed
      if (currentTrackIndex >= updatedSongs.length) {
        setCurrentTrackIndex(0);
      }
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  };

  const filteredSongs = getFilteredSongs();

  return (
    <div className="flex flex-col h-screen bg-black text-neutral-300 font-sans overflow-hidden select-none">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          playlists={playlists}
          favorites={favorites}
          selectedPlaylistId={selectedPlaylistId}
          newPlaylistName={newPlaylistName}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          songsCount={songs.length}
          onSelectPlaylist={setSelectedPlaylistId}
          onCreatePlaylist={handleCreatePlaylist}
          onDeletePlaylist={deletePlaylist}
          onNewPlaylistNameChange={setNewPlaylistName}
          onUploadClick={() => fileInputRef.current?.click()}
        />

        <MobileMenu
          isOpen={isMobileMenuOpen}
          playlists={playlists}
          favorites={favorites}
          newPlaylistName={newPlaylistName}
          isUploading={isUploading}
          songsCount={songs.length}
          onClose={() => setIsMobileMenuOpen(false)}
          onSelectPlaylist={setSelectedPlaylistId}
          onCreatePlaylist={handleCreatePlaylist}
          onDeletePlaylist={deletePlaylist}
          onNewPlaylistNameChange={setNewPlaylistName}
          onUploadClick={() => fileInputRef.current?.click()}
        />

        <MainContent
          selectedPlaylistId={selectedPlaylistId}
          playlists={playlists}
          songs={songs}
          filteredSongs={filteredSongs}
          currentTrackId={currentTrack?.id}
          isPlaying={isPlaying}
          favorites={favorites}
          isCustomPlaylist={isCustomPlaylist}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          localSongsCount={localSongsCount}
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          onUploadClick={() => fileInputRef.current?.click()}
          onDeletePlaylist={deletePlaylist}
          onPlaySong={handlePlaySong}
          onToggleFavorite={toggleFavorite}
          onAddToPlaylist={handleAddToPlaylistClick}
          onDeleteLocal={handleDeleteLocal}
          onRemoveFromPlaylist={(songId) => removeSongFromPlaylist(selectedPlaylistId, songId)}
        />
      </div>

      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isLooping={isLooping}
        isShuffle={isShuffle}
        favorites={favorites}
        onTogglePlay={togglePlay}
        onPrev={handlePrev}
        onNext={handleNext}
        onSeek={(e) => seekTo(parseFloat(e.target.value))}
        onVolumeChange={(e) => changeVolume(parseFloat(e.target.value))}
        onToggleMute={toggleMute}
        onToggleLoop={toggleLoop}
        onToggleShuffle={toggleShuffle}
        onToggleFavorite={toggleFavorite}
        onToggleFullscreen={toggleFullscreen}
      />

      {showAddModal && trackToAdd && (
        <AddToPlaylistModal
          track={trackToAdd}
          playlists={playlists}
          newPlaylistName={newPlaylistName}
          onClose={() => {
            setShowAddModal(false);
            setTrackToAdd(null);
          }}
          onAddToPlaylist={addSongToPlaylist}
          onCreateAndAdd={handleCreateAndAdd}
          onNewPlaylistNameChange={setNewPlaylistName}
        />
      )}

      {/* Custom styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #525252;
          border-radius: 3px;
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: #525252;
          height: 4px;
          border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          margin-top: -4px;
          background-color: white;
          height: 12px;
          width: 12px;
          border-radius: 50%;
        }
        input[type="range"]:hover::-webkit-slider-thumb {
          background-color: #22c55e;
        }
      `}</style>
    </div>
  );
}