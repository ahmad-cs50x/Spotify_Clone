// components/TrackList.tsx
'use client';

import React from 'react';
import { Heart, ListMusic, Trash2, Music } from 'lucide-react';
import { Song } from '../type';

interface TrackListProps {
  songs: Song[];
  currentTrackId: string | undefined;
  isPlaying: boolean;
  favorites: string[];
  isCustomPlaylist: boolean;
  onPlaySong: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToPlaylist: (song: Song) => void;
  onDeleteLocal: (id: string) => void;
  onRemoveFromPlaylist: (id: string) => void;
}

export default function TrackList({
  songs,
  currentTrackId,
  isPlaying,
  favorites,
  isCustomPlaylist,
  onPlaySong,
  onToggleFavorite,
  onAddToPlaylist,
  onDeleteLocal,
  onRemoveFromPlaylist,
}: TrackListProps) {
  if (songs.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500 text-sm">
        {isCustomPlaylist ? (
          <div className="space-y-3">
            <Music className="w-12 h-12 mx-auto text-neutral-600" />
            <p className="text-lg">No songs in this playlist</p>
            <p className="text-xs">Click the list icon on any song to add it here</p>
          </div>
        ) : (
          "No songs found in this view."
        )}
      </div>
    );
  }

  return (
    <>
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-2 p-2 text-xs font-bold tracking-wider text-neutral-400 border-b border-neutral-800 uppercase mb-3">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5 sm:col-span-5 md:col-span-5">Title</div>
        <div className="hidden md:col-span-4 md:block">Album</div>
        <div className="col-span-3 sm:col-span-2 md:col-span-1 text-center">Actions</div>
        <div className="col-span-3 sm:col-span-3 md:col-span-1 text-right pr-3">Time</div>
      </div>

      {/* Song Rows */}
      {songs.map((song, index) => {
        const isSelected = song.id === currentTrackId;
        return (
          <div
            key={song.id}
            className={`grid grid-cols-12 gap-2 p-2 rounded-md hover:bg-neutral-800/60 transition group items-center text-sm cursor-pointer ${
              isSelected ? 'bg-neutral-800/80' : ''
            }`}
            onClick={() => onPlaySong(song)}
          >
            {/* Number / Playing Indicator */}
            <div className="col-span-1 text-center text-neutral-400 font-medium">
              {isSelected && isPlaying ? (
                <span className="text-green-500 animate-pulse">●</span>
              ) : (
                index + 1
              )}
            </div>

            {/* Title & Artist */}
            <div className="col-span-5 sm:col-span-5 md:col-span-5 flex items-center space-x-3 min-w-0">
              <img
                src={song.cover}
                alt=""
                className="w-10 h-10 object-cover rounded shadow"
                loading="lazy"
              />
              <div className="truncate">
                <div className={`font-semibold truncate ${isSelected ? 'text-green-500' : 'text-white'}`}>
                  {song.title}
                  {song.isLocal && <span className="text-xs text-blue-400 ml-1">📁</span>}
                </div>
                <div className="text-xs text-neutral-400 truncate">{song.artist}</div>
              </div>
            </div>

            {/* Album */}
            <div className="hidden md:col-span-4 md:block text-neutral-400 truncate">{song.album}</div>

            {/* Actions */}
            <div
              className="col-span-3 sm:col-span-2 md:col-span-1 flex items-center justify-center space-x-1 sm:space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onToggleFavorite(song.id)}
                className="hover:scale-110 transition p-1"
                title={favorites.includes(song.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(song.id)
                      ? 'text-green-500 fill-green-500'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                />
              </button>

              <button
                onClick={() => onAddToPlaylist(song)}
                className="text-neutral-400 hover:text-white hover:scale-110 transition p-1"
                title="Add to playlist"
              >
                <ListMusic className="w-4 h-4" />
              </button>

              {song.isLocal && (
                <button
                  onClick={() => onDeleteLocal(song.id)}
                  className="text-neutral-400 hover:text-red-500 hover:scale-110 transition p-1"
                  title="Delete from library"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {isCustomPlaylist && !song.isLocal && (
                <button
                  onClick={() => onRemoveFromPlaylist(song.id)}
                  className="text-neutral-400 hover:text-red-500 hover:scale-110 transition p-1"
                  title="Remove from this playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Duration */}
            <div className="col-span-3 sm:col-span-3 md:col-span-1 text-right text-neutral-400 pr-3 text-xs">
              {song.duration}
            </div>
          </div>
        );
      })}
    </>
  );
}