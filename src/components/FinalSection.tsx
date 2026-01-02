import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function FinalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-20%' });
  const [hasClicked, setHasClicked] = useState(false);

  const triggerConfetti = () => {
    if (hasClicked) return;
    setHasClicked(true);

    // Custom confetti with warm colors
    const colors = ['#E8A87C', '#C38D94', '#D4A574', '#B8A9C9', '#85A3B2'];
    
    // Create a nebula-like burst
    const end = Date.now() + 3000;
    
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 75,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
        scalar: 1.2,
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 75,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 0.8,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['circle'],
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();

    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        ticks: 300,
        gravity: 0.6,
        decay: 0.95,
        startVelocity: 40,
        shapes: ['circle'],
        scalar: 1.5,
      });
    }, 500);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[150px] animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] animate-drift" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center section-padding max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative element */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="inline-block mb-8"
          >
            <span className="text-4xl text-primary text-glow">✦</span>
          </motion.div>

          {/* Main message */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-8 leading-tight"
          >
            No rush. No expectations.
            <br />
            <span className="text-gradient">Just a small effort from my side.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed"
          >
            You deserve beautiful things,
            <br />
            so I built one for you.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={triggerConfetti}
            disabled={hasClicked}
            className="btn-luxury text-lg md:text-xl group"
          >
            <span className="flex items-center gap-2">
              {hasClicked ? (
                <>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    ♡
                  </motion.span>
                  <span>Thank you for smiling😊</span>
                </>
              ) : (
                <>
                  <span>Click here to smile</span>
                  <span className="text-xl transition-transform group-hover:translate-x-1">🙂</span>
                </>
              )}
            </span>
          </motion.button>

          {/* Post-click message */}
          {hasClicked && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 font-body text-lg text-primary/80"
            >
              I hope this little surprise brightened your day as much as you brighten mine.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
