import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorGlow({ paused = false }: { paused?: boolean }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const glow = glowRef.current;
    const innerGlow = innerGlowRef.current;
    if (!glow || !innerGlow) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.to(innerGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to([glow, innerGlow], {
        opacity: 0,
        duration: 0.3,
      });
    };

    const handleMouseEnter = () => {
      gsap.to([glow, innerGlow], {
        opacity: 1,
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [paused]);

  // Hide on mobile/touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && glowRef.current && innerGlowRef.current) {
      glowRef.current.style.display = 'none';
      innerGlowRef.current.style.display = 'none';
    }
  }, []);

  // Hide glows if paused
  if (paused) return null;
  return (
    <>
      {/* Outer large glow */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, hsl(15 45% 70% / 0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      {/* Inner concentrated glow */}
      <div
        ref={innerGlowRef}
        className="fixed pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, hsl(350 40% 65% / 0.12) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
    </>
  );
}
