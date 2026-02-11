import { useEffect, useState, useRef, useCallback } from 'react';
import { useScrollPerformance, useThrottle } from './usePerformance';

// Hook for parallax effects - HOME PAGE ONLY
export const useParallax = (speed: number = 0.5, offset: number = 0, enabledOnHome: boolean = false) => {
  const [transform, setTransform] = useState('translateY(0px)');
  const elementRef = useRef<any>(null);

  // Check if we're on home page
  const isHomePage = window.location.pathname === '/' || window.location.hash === '' || window.location.hash === '#home';

  const updateTransform = useThrottle((scrollY: number) => {
    if (elementRef.current && enabledOnHome && isHomePage) {
      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only apply parallax when element is in viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Simplified parallax calculation - more stable
        const yPos = scrollY * speed + offset;
        setTransform(`translateY(${yPos}px)`);
      }
    } else {
      // No parallax on other pages
      setTransform('translateY(0px)');
    }
  }, 32); // Increased throttle for better performance

  useScrollPerformance(updateTransform);

  return { transform, elementRef };
};

// Hook for scroll-triggered animations
export const useScrollAnimation = (threshold: number = 0.1, rootMargin: string = '0px') => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, hasAnimated]);

  return { isVisible, elementRef };
};

// Hook for staggered animations
export const useStaggeredAnimation = (delay: number = 100) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      const timers: NodeJS.Timeout[] = [];

      // Animate items with staggered delay
      for (let i = 0; i < 10; i++) { // Adjust max items as needed
        const timer = setTimeout(() => {
          setVisibleItems(prev => new Set([...prev, i]));
        }, i * delay);
        timers.push(timer);
      }

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isInView, delay]);

  return { visibleItems, containerRef, isInView };
};

// Hook for 3D tilt effect
export const use3DTilt = (intensity: number = 10) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setTilt({
      x: deltaY * intensity,
      y: deltaX * intensity,
    });
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const transform = `perspective(1000px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`;

  return { transform, elementRef };
};

// Hook for magnetic effect
export const useMagneticEffect = (strength: number = 0.3) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const transform = `translate3d(${position.x}px, ${position.y}px, 0)`;

  return { transform, elementRef };
};

// Hook for morphing shapes
export const useMorphingShape = (shapes: string[], duration: number = 3000) => {
  const [currentShape, setCurrentShape] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape(prev => (prev + 1) % shapes.length);
    }, duration);

    return () => clearInterval(interval);
  }, [shapes.length, duration]);

  return shapes[currentShape];
};

// Hook for floating animation
export const useFloatingAnimation = (amplitude: number = 20, duration: number = 3000) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      const yOffset = Math.sin(progress * Math.PI * 2) * amplitude;
      setOffset(yOffset);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [amplitude, duration]);

  return `translateY(${offset}px)`;
};

// Hook for text reveal animation
export const useTextReveal = (text: string, delay: number = 50) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTriggered) {
          setIsTriggered(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [isTriggered]);

  useEffect(() => {
    if (isTriggered) {
      const timer = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, delay);

      return () => clearInterval(timer);
    }
  }, [isTriggered, text.length, delay]);

  const visibleText = text.slice(0, visibleChars);
  const hiddenText = text.slice(visibleChars);

  return { visibleText, hiddenText, elementRef, isComplete: visibleChars >= text.length };
};
