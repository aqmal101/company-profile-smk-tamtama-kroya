import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options?: {
  threshold?: number;
  rootMargin?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      threshold: options?.threshold || 0.1,
      rootMargin: options?.rootMargin || '0px',
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        setHasAnimated(true);
      } else {
        setIsInView(false);
      }
    }, observerOptions);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [options]);

  return { ref, isInView, scrollDirection, hasAnimated };
};
