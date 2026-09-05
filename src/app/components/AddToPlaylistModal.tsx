// components/AddToPlaylistModal.tsx
'use client';

import React from 'react';
import { Plus, FolderOpen, X } from 'lucide-react';
import { Song, Playlist } from '@/app/type';

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
  const userPlaylists = playlists.filter((p) => p.id !== 'fav-list');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg p-6 max-w-sm w-full border border-neutral-800 shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-base truncate">
            Add "{track.title}" to...
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {userPlaylists.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs text-neutral-500 mb-3">No custom playlists created yet.</p>
              <form onSubmit={onCreateAndAdd} className="flex items-center bg-neutral-800 rounded px-2 py-1">
                <input
                  type="text"
                  placeholder="Create & add..."
                  value={newPlaylistName}
                  onChange={(e) => onNewPlaylistNameChange(e.target.value)}
                  className="bg-transparent border-none text-xs text-white focus:outline-none w-full placeholder-neutral-500"
                />
                <button type="submit" className="text-neutral-400 hover:text-white">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            userPlaylists.map((p) => (
              <button
                key={p.id}
                onClick={() => onAddToPlaylist(p.id, track.id)}
                className="w-full text-left p-2.5 rounded bg-neutral-800 hover:bg-neutral-700 transition text-sm text-white font-medium block truncate"
              >
                {p.name === "Local Files" && (
                  <FolderOpen className="w-4 h-4 inline mr-1 text-blue-400" />
                )}
                {p.name} ({p.songIds.length})
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}