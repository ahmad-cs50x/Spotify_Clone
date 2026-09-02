// hooks/useFileUpload.ts
'use client';

import { useState, useCallback } from 'react';
import { Song } from '../type';

// IndexedDB save function (same as in SpotifyClone)
const DB_NAME = 'SpotifyCloneDB';
const DB_VERSION = 1;
const SONGS_STORE = 'localSongs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(SONGS_STORE)) {
        db.createObjectStore(SONGS_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveSongToDB(song: Song): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(SONGS_STORE, 'readwrite');
    const store = transaction.objectStore(SONGS_STORE);
    return new Promise((resolve, reject) => {
      const request = store.put(song);
      request.onsuccess = () => { db.close(); resolve(); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  } catch (err) {
    console.error('Failed to save song to IndexedDB:', err);
  }
}

export function useFileUpload(
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>,
  playlists: any[],
) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    let processedFiles = 0;
    const totalFiles = files.length;
    const newSongs: Song[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)) {
        processedFiles++;
        if (processedFiles === totalFiles) finishUpload(newSongs);
        return;
      }

      // Create blob URL instead of base64
      const blobUrl = URL.createObjectURL(file);
      const tempAudio = new Audio();
      tempAudio.src = blobUrl;

      tempAudio.onloadedmetadata = () => {
        const audioDuration = tempAudio.duration;
        const mins = Math.floor(audioDuration / 60);
        const secs = Math.floor(audioDuration % 60);
        const formattedDuration = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
        const fileName = file.name.replace(/\.[^/.]+$/, "");

        const newSong: Song = {
          id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          title: fileName,
          artist: "Local File",
          album: "My Library",
          duration: formattedDuration,
          durationSec: Math.floor(audioDuration),
          cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
          url: blobUrl,
          isLocal: true,
          fileName: file.name,
        };

        // Save to IndexedDB
        saveSongToDB(newSong).catch(err => {
          console.error('Failed to save to IndexedDB:', err);
        });

        newSongs.push(newSong);
        processedFiles++;
        setUploadProgress(Math.round((processedFiles / totalFiles) * 100));

        if (processedFiles === totalFiles) finishUpload(newSongs);
        tempAudio.remove();
      };

      tempAudio.onerror = () => {
        processedFiles++;
        setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
        if (processedFiles === totalFiles) finishUpload(newSongs);
      };
    });

    const finishUpload = (songsToAdd: Song[]) => {
      if (songsToAdd.length > 0) {
        setSongs((prev) => [...prev, ...songsToAdd]);
      }
      setIsUploading(false);
      setUploadProgress(0);
    };

    if (e.target) e.target.value = '';
  }, [setSongs]);

  return {
    isUploading,
    uploadProgress,
    handleFileUpload,
  };
}