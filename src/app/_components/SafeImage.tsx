"use client";

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fill?: boolean;
}

export default function SafeImage({ src, alt, width, height, className = "", fill = false }: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src provided or image failed to load, show placeholder
  if (!src || imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-400 text-xs ${className}`}
        style={fill ? {} : { width, height }}
      >
        {fill ? (
          <div className="absolute inset-0 flex items-center justify-center">
            No Image
          </div>
        ) : (
          "No Image"
        )}
      </div>
    );
  }

  return (
    <>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
        />
      )}
      {isLoading && (
        <div 
          className={`absolute bg-gray-100 flex items-center justify-center text-gray-400 text-xs ${className}`}
          style={{ width, height }}
        >
          Loading...
        </div>
      )}
    </>
  );
}
