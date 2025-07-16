import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';

export const useAnimation = () => {
    const user = useUserStore((state) => state.user);
    const animationPreference = user?.preferences?.animations || 'full';

    const shouldAnimate = animationPreference !== 'none';
    const shouldReduceMotion = animationPreference === 'reduced';

    return {
        shouldAnimate,
        shouldReduceMotion,
        animationPreference,
    };
};

export const useCountUp = (end: number, duration: number = 1000, start: number = 0) => {
    const [count, setCount] = useState(start);
    const { shouldAnimate } = useAnimation();

    useEffect(() => {
        if (!shouldAnimate) {
            setCount(end);
            return;
        }

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(start + (end - start) * easeOutQuart);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [end, duration, start, shouldAnimate]);

    return count;
};

export const useIntersectionObserver = (
    elementRef: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                ...options,
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [elementRef, options]);

    return isIntersecting;
};