// components/Sidebar.tsx
'use client';

import React from 'react';
import { Home, Search, Library, Plus, Heart, Upload, FolderOpen, Trash2 } from 'lucide-react';
import { Playlist } from '../type';

interface SidebarProps {
  playlists: Playlist[];
  favorites: string[];
  selectedPlaylistId: string;
  newPlaylistName: string;
  isUploading: boolean;
  uploadProgress: number;
  songsCount: number;
  onSelectPlaylist: (id: string) => void;
  onCreatePlaylist: (e: React.FormEvent) => void;
  onDeletePlaylist: (id: string) => void;
  onNewPlaylistNameChange: (name: string) => void;
  onUploadClick: () => void;
}

export default function Sidebar({
  playlists,
  favorites,
  selectedPlaylistId,
  newPlaylistName,
  isUploading,
  uploadProgress,
  songsCount,
  onSelectPlaylist,
  onCreatePlaylist,
  onDeletePlaylist,
  onNewPlaylistNameChange,
  onUploadClick,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-black p-2 space-y-2 shrink-0">
      {/* Logo / Navigation */}
      <div className="bg-neutral-900 rounded-lg p-5 space-y-4">
        <div
          className="flex items-center space-x-4 cursor-pointer text-white"
          onClick={() => onSelectPlaylist("all")}
        >
          <Home className="w-6 h-6" />
          <span className="font-bold text-sm">Home</span>
        </div>
        <div className="flex items-center space-x-4 cursor-pointer hover:text-white transition">
          <Search className="w-6 h-6" />
          <span className="font-bold text-sm">Search</span>
        </div>
      </div>

      {/* Library Section */}
      <div className="bg-neutral-900 rounded-lg p-5 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between text-neutral-400 mb-4">
          <div className="flex items-center space-x-2 hover:text-white transition cursor-pointer">
            <Library className="w-6 h-6" />
            <span className="font-bold text-sm">Your Library</span>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={onUploadClick}
          disabled={isUploading}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded px-3 py-2 text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Music Files
            </>
          )}
        </button>

        {/* Create Playlist Form */}
        <form onSubmit={onCreatePlaylist} className="mb-4 flex items-center bg-neutral-800 rounded px-2 py-1">
          <input
            type="text"
            placeholder="New Playlist..."
            value={newPlaylistName}
            onChange={(e) => onNewPlaylistNameChange(e.target.value)}
            className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-neutral-500"
          />
          <button type="submit" className="text-neutral-400 hover:text-white">
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Playlist List */}
        <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar text-sm">
          <div
            onClick={() => onSelectPlaylist("all")}
            className={`p-2 rounded cursor-pointer transition ${
              selectedPlaylistId === 'all'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'hover:bg-neutral-800/50'
            }`}
          >
            All Available Songs ({songsCount})
          </div>
          <div
            onClick={() => onSelectPlaylist("favorites")}
            className={`p-2 rounded cursor-pointer flex items-center space-x-2 transition ${
              selectedPlaylistId === 'favorites'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'hover:bg-neutral-800/50'
            }`}
          >
            <Heart className="w-4 h-4 text-green-500 fill-green-500" />
            <span>Liked Songs ({favorites.length})</span>
          </div>

          <div className="border-t border-neutral-800 my-2 pt-2 text-xs text-neutral-500 tracking-wider font-bold">
            PLAYLISTS
          </div>

          {playlists
            .filter((p) => p.id !== 'fav-list')
            .map((playlist) => (
              <div key={playlist.id} className="group relative">
                <div
                  onClick={() => onSelectPlaylist(playlist.id)}
                  className={`p-2 pr-8 rounded cursor-pointer transition truncate ${
                    selectedPlaylistId === playlist.id
                      ? 'bg-neutral-800 text-white font-semibold'
                      : 'hover:bg-neutral-800/50'
                  }`}
                >
                  {playlist.name === "Local Files" && (
                    <FolderOpen className="w-3.5 h-3.5 inline mr-1 text-blue-400" />
                  )}
                  {playlist.name}{" "}
                  <span className="text-xs text-neutral-500">({playlist.songIds.length})</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Delete playlist "${playlist.name}"?`)) {
                      onDeletePlaylist(playlist.id);
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                  title="Delete playlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}