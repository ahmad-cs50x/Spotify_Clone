// hooks/useAudioPlayer.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Song } from '../type';

export function useAudioPlayer(songs: Song[]) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = songs[currentTrackIndex] || null;

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.remove();
    };
  }, []);

  // Handle track change and play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex, currentTrack]);

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleNext = useCallback(() => {
    if (songs.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % songs.length);
    }
    setIsPlaying(true);
    setCurrentTime(0);
  }, [isShuffle, songs.length]);

  const handlePrev = useCallback(() => {
    if (songs.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    setCurrentTrackIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
    setCurrentTime(0);
  }, [songs.length]);

  // Handle track ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNext();
      }
    };

    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [isLooping, handleNext]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (isMuted && newVolume > 0) setIsMuted(false);
  }, [isMuted]);

  const playSongAtIndex = useCallback((index: number) => {
    if (index >= 0 && index < songs.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [songs.length]);

  return {
    currentTrack,
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
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
    toggleMute: () => setIsMuted((prev) => !prev),
    toggleLoop: () => setIsLooping((prev) => !prev),
    toggleShuffle: () => setIsShuffle((prev) => !prev),
    playSongAtIndex,
  };
}