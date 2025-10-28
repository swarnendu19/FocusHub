import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLazyLoading } from '@/hooks/usePerformance';

interface LazyImageProps {
    src: string;
    alt: string;
    placeholder?: string;
    className?: string;
    width?: number;
    height?: number;
    quality?: number;
    loading?: 'lazy' | 'eager';
    onLoad?: () => void;
    onError?: () => void;
}

export function LazyImage({
    src,
    alt,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiNjY2MiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
    className = '',
    width,
    height,
    quality = 75,
    loading = 'lazy',
    onLoad,
    onError,
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(placeholder);
    const imgRef = useRef<HTMLImageElement>(null);
    const { elementRef, observe } = useLazyLoading({
        rootMargin: '50px',
        threshold: 0.1,
    });

    // Generate optimized image URL
    const getOptimizedSrc = (originalSrc: string) => {
        // In a real app, you might use a service like Cloudinary or ImageKit
        // For now, we'll just add quality parameter if it's a supported format
        if (originalSrc.includes('?')) {
            return `${originalSrc}&q=${quality}`;
        }
        return `${originalSrc}?q=${quality}`;
    };

    useEffect(() => {
        if (loading === 'eager') {
            // Load immediately for eager loading
            loadImage();
        } else {
            // Use intersection observer for lazy loading
            observe(loadImage);
        }
    }, [src, loading, observe]);

    const loadImage = () => {
        const img = new Image();

        img.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
            onLoad?.();
        };

        img.onerror = () => {
            setIsError(true);
            onError?.();
        };

        img.src = getOptimizedSrc(src);
    };

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        setIsError(true);
        onError?.();
    };

    return (
        <div
            ref={elementRef}
            className={`relative overflow-hidden ${className}`}
            style={{ width, height }}
        >
            <motion.img
                ref={imgRef}
                src={currentSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Loading placeholder */}
            {!isLoaded && !isError && (
                <motion.div
                    className="absolute inset-0 bg-gray-200 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoaded ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                </motion.div>
            )}

            {/* Error state */}
            {isError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <svg
                            className="w-8 h-8 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                        <p className="text-xs">Failed to load</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Progressive image loading component
interface ProgressiveImageProps extends LazyImageProps {
    lowQualitySrc?: string;
}

export function ProgressiveImage({
    src,
    lowQualitySrc,
    alt,
    className = '',
    ...props
}: ProgressiveImageProps) {
    const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || props.placeholder);

    useEffect(() => {
        // Load low quality image first
        if (lowQualitySrc) {
            const lowQualityImg = new Image();
            lowQualityImg.onload = () => {
                setCurrentSrc(lowQualitySrc);
            };
            lowQualityImg.src = lowQualitySrc;
        }

        // Then load high quality image
        const highQualityImg = new Image();
        highQualityImg.onload = () => {
            setCurrentSrc(src);
            setIsHighQualityLoaded(true);
        };
        highQualityImg.src = src;
    }, [src, lowQualitySrc]);

    return (
        <LazyImage
            {...props}
            src={currentSrc}
            alt={alt}
            className={`${className} ${!isHighQualityLoaded && lowQualitySrc ? 'blur-sm' : ''}`}
            loading="eager" // Since we're handling the loading ourselves
        />
    );
}

// Image with WebP support
interface OptimizedImageProps extends LazyImageProps {
    webpSrc?: string;
}

export function OptimizedImage({
    src,
    webpSrc,
    alt,
    ...props
}: OptimizedImageProps) {
    const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

    useEffect(() => {
        // Check WebP support
        const checkWebPSupport = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const dataURL = canvas.toDataURL('image/webp');
            setSupportsWebP(dataURL.indexOf('data:image/webp') === 0);
        };

        checkWebPSupport();
    }, []);

    const imageSrc = supportsWebP && webpSrc ? webpSrc : src;

    if (supportsWebP === null) {
        // Still checking WebP support
        return <LazyImage {...props} src={props.placeholder || ''} alt={alt} />;
    }

    return <LazyImage {...props} src={imageSrc} alt={alt} />;
}