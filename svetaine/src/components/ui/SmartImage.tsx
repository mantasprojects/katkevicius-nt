"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface SmartImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  propertyStatus?: string;
  className?: string;
  breakout?: boolean;
}

export default function SmartImage({ 
  src, 
  alt, 
  priority = false, 
  propertyStatus = "Parduodama", 
  className = "",
  breakout = true
}: SmartImageProps) {
  const [aspect, setAspect] = useState<'horizontal' | 'vertical' | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth >= naturalHeight) {
      setAspect('horizontal');
    } else {
      setAspect('vertical');
    }
  };

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      const { naturalWidth, naturalHeight } = img;
      if (naturalWidth > 0 && naturalHeight > 0) {
        if (naturalWidth >= naturalHeight) {
          setAspect('horizontal');
        } else {
          setAspect('vertical');
        }
      }
    }
  }, [src]);

  if (aspect === 'horizontal') {
    return (
      <div className="w-full leading-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={src} 
          alt={alt}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"} 
          className={`w-full h-auto object-contain block ${propertyStatus !== "Parduodama" ? "grayscale-[30%]" : ""} ${className}`} 
        />
      </div>
    );
  }

  if (aspect === 'vertical') {
    return (
      <div className={`${breakout ? "w-screen -mx-4" : "w-full"} aspect-[3/4] relative overflow-hidden rounded-none md:w-full md:mx-0 md:absolute md:inset-0 md:h-full md:aspect-auto`}>
         <Image 
           src={src} 
           alt={alt}
           fill
           priority={priority}
           className={`object-cover ${propertyStatus !== "Parduodama" ? "grayscale-[30%]" : ""} ${className}`} 
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
         />
      </div>
    );
  }

  // Initial render: absolute and invisible to load first
  return (
    <div className="w-full h-[300px] bg-slate-100 animate-pulse relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        ref={imgRef}
        src={src} 
        alt={alt} 
        onLoad={handleLoad} 
        className="absolute opacity-0 pointer-events-none" 
      />
    </div>
  );
}
