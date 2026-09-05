// components/MainContent.tsx
'use client';

import React from 'react';
import Header from './Header';
import QuickAccessGrid from './QuickAccessGrid';
import UploadPrompt from './UploadPrompt';
import TrackList from './TrackList';
import { Song, Playlist } from '../type';

interface MainContentProps {
  selectedPlaylistId: string;
  playlists: Playlist[];
  songs: Song[];
  filteredSongs: Song[];
  currentTrackId: string | undefined;
  isPlaying: boolean;
  favorites: string[];
  isCustomPlaylist: boolean;
  isUploading: boolean;
  uploadProgress: number;
  localSongsCount: number;
  onMobileMenuOpen: () => void;
  onUploadClick: () => void;
  onDeletePlaylist: (id: string) => void;
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToPlaylist: (song: Song) => void;
  onDeleteLocal: (id: string) => void;
  onRemoveFromPlaylist: (id: string) => void;
}

export default function MainContent({
  selectedPlaylistId,
  playlists,
  songs,
  filteredSongs,
  currentTrackId,
  isPlaying,
  favorites,
  isCustomPlaylist,
  isUploading,
  uploadProgress,
  localSongsCount,
  onMobileMenuOpen,
  onUploadClick,
  onDeletePlaylist,
  onPlaySong,
  onToggleFavorite,
  onAddToPlaylist,
  onDeleteLocal,
  onRemoveFromPlaylist,
}: MainContentProps) {
  return (
    <main className="flex-1 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-none md:rounded-lg m-0 md:m-2 md:ml-0 overflow-y-auto p-4 md:p-6 pb-32">
      <Header
        selectedPlaylistId={selectedPlaylistId}
        playlists={playlists}
        isCustomPlaylist={isCustomPlaylist}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onMobileMenuOpen={onMobileMenuOpen}
        onUploadClick={onUploadClick}
        onDeletePlaylist={onDeletePlaylist}
      />

      {/* Quick Access Grid - Only on "all" view */}
      {selectedPlaylistId === "all" && songs.length > 0 && (
        <QuickAccessGrid songs={songs} onPlaySong={onPlaySong} />
      )}

      {/* Upload Prompt */}
      {selectedPlaylistId === "all" && localSongsCount === 0 && (
        <UploadPrompt onUploadClick={onUploadClick} />
      )}

      {/* Track List */}
      <section className="bg-black/20 rounded-xl p-2 md:p-4">
        <TrackList
          songs={filteredSongs}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          favorites={favorites}
          isCustomPlaylist={isCustomPlaylist}
          onPlaySong={onPlaySong}
          onToggleFavorite={onToggleFavorite}
          onAddToPlaylist={onAddToPlaylist}
          onDeleteLocal={onDeleteLocal}
          onRemoveFromPlaylist={onRemoveFromPlaylist}
        />
      </section>
    </main>
  );
}
