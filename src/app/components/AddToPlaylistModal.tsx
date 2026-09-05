// components/AddToPlaylistModal.tsx
'use client';

import React from 'react';
import { Plus, FolderOpen, X } from 'lucide-react';
import { Song, Playlist } from '../type';

interface AddToPlaylistModalProps {
  track: Song;
  playlists: Playlist[];
  newPlaylistName: string;
  onClose: () => void;
  onAddToPlaylist: (playlistId: string, songId: string) => void;
  onCreateAndAdd: (e: React.FormEvent) => void;
  onNewPlaylistNameChange: (name: string) => void;
}

export default function AddToPlaylistModal({
  track,
  playlists,
  newPlaylistName,
  onClose,
  onAddToPlaylist,
  onCreateAndAdd,
  onNewPlaylistNameChange,
}: AddToPlaylistModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg w-full max-w-md shadow-2xl border border-neutral-800 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-500" />
            Add to Playlist
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {/* Existing Playlists */}
          {playlists.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                Your Playlists
              </p>
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => onAddToPlaylist(playlist.id, track.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-800 transition group"
                >
                  <FolderOpen className="w-5 h-5 text-neutral-500 group-hover:text-green-500 transition" />
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{playlist.name}</p>
                    <p className="text-xs text-neutral-500">{playlist.songIds.length} songs</p>
                  </div>
                  <Plus className="w-4 h-4 text-neutral-600 group-hover:text-green-500" />
                </button>
              ))}
            </div>
          )}

          {/* Create New Playlist */}
          <div className="border-t border-neutral-800 pt-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Create New Playlist
            </p>
            <form onSubmit={onCreateAndAdd}>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => onNewPlaylistNameChange(e.target.value)}
                placeholder="Playlist name..."
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-green-500 focus:outline-none mb-3"
                autoFocus
              />
              <button
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-neutral-700 disabled:text-neutral-500 text-black font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create & Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
