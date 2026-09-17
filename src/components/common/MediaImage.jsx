import React, { useMemo, useState } from 'react';
import { ImageOff } from 'lucide-react';

function normalizeCandidate(value) {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/^http:\/\//i, 'https://');
}

function ImageAttempt({ sources, alt, className, loading, decoding, placeholderLabel, onLoad }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const currentSource = sources[sourceIndex];

  if (!currentSource) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#172033] via-[#101626] to-[#080B14] p-4 text-center text-gray-400 ${className}`}
        role="img"
        aria-label={alt || placeholderLabel || 'Image unavailable'}
      >
        <ImageOff className="h-6 w-6 text-gray-500" aria-hidden="true" />
        <span className="line-clamp-2 text-xs font-semibold text-gray-300">{placeholderLabel || alt || 'Artwork unavailable'}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSource}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onLoad={onLoad}
      onError={() => setSourceIndex((index) => index + 1)}
    />
  );
}

export function MediaImage({
  src,
  fallbackSrc,
  alt = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
  placeholderLabel,
  onLoad
}) {
  const sources = useMemo(() => {
    const candidates = [src, ...(Array.isArray(fallbackSrc) ? fallbackSrc : [fallbackSrc])]
      .map((candidate) => normalizeCandidate(candidate))
      .filter(Boolean);
    return [...new Set(candidates)];
  }, [src, fallbackSrc]);

  return (
    <ImageAttempt
      key={sources.join('|')}
      sources={sources}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      placeholderLabel={placeholderLabel}
      onLoad={onLoad}
    />
  );
}
