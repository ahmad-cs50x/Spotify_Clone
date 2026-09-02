// components/Player.tsx
'use client';

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Maximize2,
  MonitorPlay,
} from 'lucide-react';
import { Song } from '../type';
import { formatTime } from '../utils/formatTime';

interface PlayerProps {
  currentTrack: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffle: boolean;
  favorites: string[];
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onToggleLoop: () => void;
  onToggleShuffle: () => void;
  onToggleFavorite: (trackId: string) => void;
  onToggleFullscreen: () => void;
}

export default function Player({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLooping,
  isShuffle,
  favorites,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLoop,
  onToggleShuffle,
  onToggleFavorite,
  onToggleFullscreen,
}: PlayerProps) {
  if (!currentTrack) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-neutral-950 border-t border-neutral-900 px-4 flex items-center justify-center z-40">
        <span className="text-xs text-neutral-500">No track selected</span>
      </footer>
    );
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 bg-neutral-950 border-t border-neutral-900 px-4 flex items-center justify-between z-40">
      {/* Left: Track Info */}
      <div className="flex items-center space-x-4 w-1/4 min-w-[180px]">
        <img
          src={currentTrack.cover}
          alt=""
          className="w-14 h-14 object-cover rounded shadow-lg shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">
            {currentTrack.title}
            {currentTrack.isLocal && <span className="text-xs text-blue-400 ml-1">📁</span>}
          </h4>
          <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(currentTrack.id)}
          className="hover:scale-105 transition shrink-0"
        >
          <Heart
            className={`w-4 h-4 ${
              favorites.includes(currentTrack.id)
                ? 'text-green-500 fill-green-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          />
        </button>
      </div>

      {/* Center: Controls & Seek Bar */}
      <div className="flex flex-col items-center flex-1 max-w-xl px-2">
        <div className="flex items-center space-x-4 sm:space-x-6 mb-1.5">
          <button
            onClick={onToggleShuffle}
            className={`transition hidden sm:block ${isShuffle ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={onPrev} className="text-neutral-400 hover:text-white transition">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={onTogglePlay}
            className="bg-white text-black p-2 rounded-full hover:scale-105 transition shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>
          <button onClick={onNext} className="text-neutral-400 hover:text-white transition">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={onToggleLoop}
            className={`transition hidden sm:block ${isLooping ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center space-x-2 w-full text-xs text-neutral-400">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={onSeek}
            className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-500"
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Fullscreen */}
      <div className="hidden md:flex items-center justify-end space-x-3 w-1/4">
        <button className="text-neutral-400 hover:text-white transition">
          <MonitorPlay className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-2">
          <button onClick={onToggleMute} className="text-neutral-400 hover:text-white transition">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className="w-20 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-500"
          />
        </div>
        <button
          onClick={onToggleFullscreen}
          className="text-neutral-400 hover:text-white transition"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}