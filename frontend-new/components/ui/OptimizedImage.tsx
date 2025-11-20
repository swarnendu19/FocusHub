/**
 * Optimized Image Component
 *
 * Wrapper around Next.js Image with default optimizations and error handling.
 */

"use client";

import * as React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/utils";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  objectFit?: "contain" | "cover" | "fill" | "none";
  className?: string;
}

export function OptimizedImage({
  alt,
  fallbackSrc = "/placeholder.svg",
  aspectRatio,
  objectFit = "cover",
  className,
  onError,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const objectFitClasses = {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
    none: "object-none",
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setError(true);
    setIsLoading(false);
    if (onError) {
      onError(event);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#FAFAFA] dark:bg-[#1C1C1C]/30",
        aspectRatio && aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1C1C1C] dark:border-white border-t-transparent" />
        </div>
      )}

      <Image
        {...props}
        src={error ? fallbackSrc : props.src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit && objectFitClasses[objectFit]
        )}
        quality={props.quality || 85}
        placeholder={props.placeholder || "blur"}
        blurDataURL={
          props.blurDataURL ||
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ZBRkFGQSIvPjwvc3ZnPg=="
        }
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAFA] dark:bg-[#1C1C1C]/30">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-8 w-8 text-[#757373]"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p className="mt-2 text-xs text-[#757373]">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Avatar Image Component
 *
 * Specialized image component for user avatars with initials fallback.
 */
interface AvatarImageProps {
  src?: string | null;
  alt: string;
  fallbackInitials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AvatarImage({
  src,
  alt,
  fallbackInitials,
  size = "md",
  className,
}: AvatarImageProps) {
  const [error, setError] = React.useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
    xl: "h-24 w-24 text-3xl",
  };

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-[#1C1C1C] to-[#757373] dark:from-white dark:to-[#FAFAFA] font-bold text-white dark:text-[#1C1C1C]",
          sizeClasses[size],
          className
        )}
      >
        {fallbackInitials || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={
          size === "sm"
            ? "32px"
            : size === "md"
            ? "48px"
            : size === "lg"
            ? "64px"
            : "96px"
        }
        onError={() => setError(true)}
        quality={85}
      />
    </div>
  );
}

/**
 * Logo Image Component
 *
 * Specialized component for logos with proper sizing and optimization.
 */
interface LogoImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function LogoImage({
  src,
  alt,
  width = 120,
  height = 40,
  priority = false,
  className,
}: LogoImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
      quality={100}
      unoptimized={src.endsWith(".svg")}
    />
  );
}
