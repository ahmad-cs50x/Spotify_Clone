// components/UploadPrompt.tsx
'use client';

import React from 'react';
import { Upload } from 'lucide-react';

interface UploadPromptProps {
  onUploadClick: () => void;
}

export default function UploadPrompt({ onUploadClick }: UploadPromptProps) {
  return (
    <section className="mb-8 bg-neutral-800/30 rounded-xl p-6 text-center border border-dashed border-neutral-700">
      <Upload className="w-10 h-10 mx-auto mb-3 text-neutral-500" />
      <h3 className="text-lg font-semibold text-white mb-2">Add Your Music</h3>
      <p className="text-sm text-neutral-400 mb-4">
        Upload your MP3, WAV, or other audio files to play them here
      </p>
      <button
        onClick={onUploadClick}
        className="bg-white text-black font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition-transform text-sm"
      >
        Choose Files
      </button>
    </section>
  );
}