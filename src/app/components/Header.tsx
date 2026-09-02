// components/Header.tsx
'use client';

import React from 'react';
import { Menu, Upload, Trash2 } from 'lucide-react';
import { Playlist } from '../type';

interface HeaderProps {
  selectedPlaylistId: string;
  playlists: Playlist[];
  isCustomPlaylist: boolean;
  isUploading: boolean;
  uploadProgress: number;
  onMobileMenuOpen: () => void;
  onUploadClick: () => void;
  onDeletePlaylist: (id: string) => void;
}

export default function Header({
  selectedPlaylistId,
  playlists,
  isCustomPlaylist,
  isUploading,
  uploadProgress,
  onMobileMenuOpen,
  onUploadClick,
  onDeletePlaylist,
}: HeaderProps) {
  const getHeaderTitle = () => {
    if (selectedPlaylistId === "all") return "Welcome back";
    if (selectedPlaylistId === "favorites") return "Liked Songs";
    return playlists.find((p) => p.id === selectedPlaylistId)?.name || "Playlist";
  };

  return (
    <header className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden text-white hover:scale-105 transition"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {getHeaderTitle()}
        </div>
        {isCustomPlaylist && (
          <button
            onClick={() => {
              const playlistName = playlists.find((p) => p.id === selectedPlaylistId)?.name;
              if (window.confirm(`Delete playlist "${playlistName}"?`)) {
                onDeletePlaylist(selectedPlaylistId);
              }
            }}
            className="text-neutral-400 hover:text-red-500 transition p-1.5 rounded-full hover:bg-neutral-800"
            title="Delete this playlist"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onUploadClick}
          disabled={isUploading}
          className="hidden sm:flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full px-4 py-1.5 text-xs font-medium transition disabled:opacity-50"
        >
          {isUploading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {isUploading ? `${uploadProgress}%` : 'Upload'}
        </button>
        <div className="bg-black/40 rounded-full px-4 py-1.5 text-xs font-bold text-white tracking-wide border border-neutral-700 hidden sm:block">
          Premium User
        </div>
      </div>
    </header>
  );
}