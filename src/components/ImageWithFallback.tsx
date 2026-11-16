import { useState } from 'react';
import { Coffee } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className = '' }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFECE6] text-[#5E5450] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Coffee className="w-8 h-8 mb-2 text-[#A6192E]/70" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-wide text-[#1C1513]/80">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
