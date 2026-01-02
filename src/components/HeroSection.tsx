import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const poeticLines = [
  "Hey",
"This isn’t a story",
"or a perfect beginning…",
"just something real",
"that felt worth creating",
"for you. 💝❤️❣️"
];

export default function HeroSection({ animationsActive = true }: { animationsActive?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [showAllLines, setShowAllLines] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Animate lines one by one
    const timer = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= poeticLines.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setShowAllLines(true);
            setAnimationComplete(true);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!animationsActive) return;
    // Add subtle parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;
      gsap.to(containerRef.current, {
        rotateX: y * 2,
        rotateY: -x * 2,
        duration: 1,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animationsActive]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient glow orbs */}
      {animationsActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-glow-primary/10 blur-[80px] animate-drift" />
        </div>
      )}

      {/* Main content */}
      <div
        ref={containerRef}
        className="relative z-10 text-center px-6 max-w-4xl"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* Individual line animation */}
        <AnimatePresence mode="wait">
          {!showAllLines && (
            <motion.div
              key={currentLine}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[120px] flex items-center justify-center"
            >
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground/90 text-glow leading-relaxed">
                {poeticLines[currentLine]}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* All lines revealed */}
        {showAllLines && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="space-y-2"
          >
            {poeticLines.map((line, index) => (
              <motion.h1
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`font-display text-2xl md:text-4xl lg:text-5xl leading-relaxed ${
                  index === poeticLines.length - 1 
                    ? 'text-gradient' 
                    : 'text-foreground/80'
                }`}
              >
                {line}
              </motion.h1>
            ))}
          </motion.div>
        )}

        {/* Scroll indicator */}
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-muted-foreground text-sm tracking-widest uppercase font-body">
              Scroll to discover
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 rounded-full border border-primary/30 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
