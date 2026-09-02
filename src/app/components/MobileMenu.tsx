// components/MobileMenu.tsx
'use client';

import React from 'react';
import { Home, Heart, Plus, Upload, FolderOpen, Trash2, X } from 'lucide-react';
import { Playlist } from '../type';

interface MobileMenuProps {
  isOpen: boolean;
  playlists: Playlist[];
  favorites: string[];
  newPlaylistName: string;
  isUploading: boolean;
  songsCount: number;
  onClose: () => void;
  onSelectPlaylist: (id: string) => void;
  onCreatePlaylist: (e: React.FormEvent) => void;
  onDeletePlaylist: (id: string) => void;
  onNewPlaylistNameChange: (name: string) => void;
  onUploadClick: () => void;
}

export default function MobileMenu({
  isOpen,
  playlists,
  favorites,
  newPlaylistName,
  isUploading,
  songsCount,
  onClose,
  onSelectPlaylist,
  onCreatePlaylist,
  onDeletePlaylist,
  onNewPlaylistNameChange,
  onUploadClick,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const handleSelectAndClose = (id: string) => {
    onSelectPlaylist(id);
    onClose();
  };

  const handleCreateAndClose = (e: React.FormEvent) => {
    onCreatePlaylist(e);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col p-6 md:hidden animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="text-white font-bold text-xl tracking-tighter">Spotify Clone</div>
        <button onClick={onClose} className="text-white">
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => { onUploadClick(); onClose(); }}
        disabled={isUploading}
        className="mb-4 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded px-3 py-2.5 text-sm font-medium transition disabled:opacity-50"
      >
        <Upload className="w-5 h-5" />
        Upload Music Files
      </button>

      {/* Create Playlist */}
      <form onSubmit={handleCreateAndClose} className="mb-6 flex items-center bg-neutral-800 rounded px-3 py-2">
        <input
          type="text"
          placeholder="New Playlist..."
          value={newPlaylistName}
          onChange={(e) => onNewPlaylistNameChange(e.target.value)}
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder-neutral-500"
        />
        <button type="submit" className="text-neutral-400 hover:text-white">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Navigation */}
      <div className="space-y-4 text-lg overflow-y-auto flex-1">
        <div
          className="flex items-center space-x-4 text-white"
          onClick={() => handleSelectAndClose("all")}
        >
          <Home className="w-6 h-6" /> <span>Home ({songsCount})</span>
        </div>

        <div className="border-t border-neutral-800 pt-4">
          <div className="text-xs font-bold text-neutral-500 mb-2 tracking-widest">YOUR PLAYLISTS</div>
          <div
            onClick={() => handleSelectAndClose("favorites")}
            className="py-2 text-neutral-300 flex items-center space-x-2"
          >
            <Heart className="w-4 h-4 text-green-500 fill-green-500" />
            <span>Liked Songs ({favorites.length})</span>
          </div>

          {playlists
            .filter((p) => p.id !== 'fav-list')
            .map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2">
                <div
                  onClick={() => handleSelectAndClose(p.id)}
                  className="text-neutral-300 flex-1"
                >
                  {p.name === "Local Files" && (
                    <FolderOpen className="w-4 h-4 inline mr-1 text-blue-400" />
                  )}
                  {p.name} ({p.songIds.length})
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete playlist "${p.name}"?`)) {
                      onDeletePlaylist(p.id);
                    }
                  }}
                  className="text-neutral-500 hover:text-red-500 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}