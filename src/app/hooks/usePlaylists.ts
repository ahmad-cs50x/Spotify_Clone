// hooks/usePlaylists.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Playlist } from '../type';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedPlaylists = localStorage.getItem('spotify_playlists');
      const savedFavorites = localStorage.getItem('spotify_favorites');

      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      } else {
        const defaultPlaylists: Playlist[] = [
          { id: "fav-list", name: "My Favorites", songIds: [] }
        ];
        setPlaylists(defaultPlaylists);
        localStorage.setItem('spotify_playlists', JSON.stringify(defaultPlaylists));
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
    }
  }, []);

  // Save playlists to localStorage whenever they change
  const savePlaylists = useCallback((updatedPlaylists: Playlist[]) => {
    setPlaylists(updatedPlaylists);
    try {
      localStorage.setItem('spotify_playlists', JSON.stringify(updatedPlaylists));
    } catch (err) {
      console.error('Failed to save playlists:', err);
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      
      try {
        localStorage.setItem('spotify_favorites', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save favorites:', err);
      }

      // Update fav-list playlist
      setPlaylists((prevPlaylists) => {
        const updatedPlaylists = prevPlaylists.map((p) =>
          p.id === "fav-list" ? { ...p, songIds: updated } : p
        );
        try {
          localStorage.setItem('spotify_playlists', JSON.stringify(updatedPlaylists));
        } catch (err) {
          console.error('Failed to save playlists:', err);
        }
        return updatedPlaylists;
      });

      return updated;
    });
  }, []);

  // Create playlist
  const createPlaylist = useCallback((name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: name.trim(),
      songIds: [],
    };
    setPlaylists((prev) => {
      const updated = [...prev, newPlaylist];
      try {
        localStorage.setItem('spotify_playlists', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save playlists:', err);
      }
      return updated;
    });
  }, []);

  // Delete playlist
  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists((prev) => {
      const updated = prev.filter((p) => p.id !== playlistId);
      try {
        localStorage.setItem('spotify_playlists', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save playlists:', err);
      }
      return updated;
    });
  }, []);

  // Add song to playlist
  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((prev) => {
      const updated = prev.map((p) =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p
      );
      try {
        localStorage.setItem('spotify_playlists', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save playlists:', err);
      }
      return updated;
    });
  }, []);

  // Remove song from playlist
  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists((prev) => {
      const updated = prev.map((p) =>
        p.id === playlistId
          ? { ...p, songIds: p.songIds.filter((id) => id !== songId) }
          : p
      );
      try {
        localStorage.setItem('spotify_playlists', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save playlists:', err);
      }
      return updated;
    });
  }, []);

  // Sync favorites with fav-list
  useEffect(() => {
    setPlaylists((prev) => {
      const updated = prev.map((p) =>
        p.id === "fav-list" ? { ...p, songIds: favorites } : p
      );
      return updated;
    });
  }, [favorites]);

  return {
    playlists,
    favorites,
    toggleFavorite,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  };
}