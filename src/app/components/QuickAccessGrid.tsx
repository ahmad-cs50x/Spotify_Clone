// components/QuickAccessGrid.tsx
'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { Song } from '../type';

interface QuickAccessGridProps {
  songs: Song[];
  onPlaySong: (song: Song) => void;
}

export default function QuickAccessGrid({ songs, onPlaySong }: QuickAccessGridProps) {
  const displaySongs = songs.slice(0, 3);

  if (displaySongs.length === 0) return null;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
      {displaySongs.map((song) => (
        <div
          key={`panel-${song.id}`}
          className="bg-neutral-700/30 hover:bg-neutral-700/50 transition duration-300 rounded overflow-hidden flex items-center group relative cursor-pointer"
        >
          <img
            src={song.cover}
            alt={song.title}
            className="w-16 h-16 object-cover shadow-md"
            loading="lazy"
          />
          <div className="p-3 font-bold text-sm text-white truncate max-w-[60%]">
            {song.title}
            {song.isLocal && <span className="text-xs text-blue-400 block">Local File</span>}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlaySong(song);
            }}
            className="absolute right-4 bg-green-500 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition duration-200 transform translate-y-2 group-hover:translate-y-0 text-black"
          >
            <Play className="w-4 h-4 fill-black" />
          </button>
        </div>
      ))}
    </section>
  );
}