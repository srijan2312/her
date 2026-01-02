import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  targetX?: number;
  targetY?: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

export default function ConstellationSection({ paused = false }: { paused?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-20%' });
  const [isInteracting, setIsInteracting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  
  const starsRef = useRef<Star[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Heart shape points (normalized)
  const heartShape = useCallback(() => {
    const points: { x: number; y: number }[] = [];
    const numPoints = 20;
    
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      // Parametric heart equation
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      points.push({ x: x / 20, y: y / 20 });
    }
    
    return points;
  }, []);

  // Initialize stars
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Create stars in random positions
    const numStars = 25;
    const stars: Star[] = [];
    
    for (let i = 0; i < numStars; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 200;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      stars.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
    
    starsRef.current = stars;
    
    // Create potential connections (sparse)
    const connections: Connection[] = [];
    for (let i = 0; i < numStars; i++) {
      for (let j = i + 1; j < numStars; j++) {
        if (Math.random() > 0.85) {
          connections.push({ from: i, to: j, opacity: 0 });
        }
      }
    }
    connectionsRef.current = connections;
  }, []);

  // Animation loop
  useEffect(() => {
    if (paused || !canvasRef.current || !isInView) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const heartPoints = heartShape();
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const heartScale = Math.min(rect.width, rect.height) * 0.35;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stars = starsRef.current;
      const connections = connectionsRef.current;
      // Update star positions
      stars.forEach((star, i) => {
        if (isInteracting && formProgress > 0) {
          // Move towards heart shape
          const heartPoint = heartPoints[i % heartPoints.length];
          const targetX = centerX + heartPoint.x * heartScale;
          const targetY = centerY + heartPoint.y * heartScale;
          star.x += (targetX - star.x) * 0.05 * formProgress;
          star.y += (targetY - star.y) * 0.05 * formProgress;
        } else {
          // Gentle drift back to base + ambient movement
          const time = Date.now() * 0.001;
          const drift = Math.sin(time + i) * 5;
          const targetX = star.baseX + drift;
          const targetY = star.baseY + Math.cos(time * 0.8 + i) * 5;
          star.x += (targetX - star.x) * 0.03;
          star.y += (targetY - star.y) * 0.03;
        }
      });
      // Draw connections
      connections.forEach((conn) => {
        const from = stars[conn.from];
        const to = stars[conn.to];
        const targetOpacity = isInteracting ? 0.4 * formProgress : 0;
        conn.opacity += (targetOpacity - conn.opacity) * 0.05;
        if (conn.opacity > 0.01) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = `hsla(15, 45%, 70%, ${conn.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        const glowOpacity = isInteracting ? 0.8 : star.opacity;
        ctx.fillStyle = `hsla(15, 45%, 70%, ${glowOpacity})`;
        ctx.fill();
        // Glow effect
        if (isInteracting) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          gradient.addColorStop(0, `hsla(15, 45%, 70%, ${0.3 * formProgress})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paused, isInView, isInteracting, formProgress, heartShape]);

  // Handle interaction
  const handleInteractionStart = () => {
    if (paused) return;
    setIsInteracting(true);
    // Animate form progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      setFormProgress(Math.min(progress, 1));
      if (progress >= 1) clearInterval(interval);
    }, 16);
  };

  const handleInteractionEnd = () => {
    if (paused) return;
    setIsInteracting(false);
    // Animate form progress back
    let progress = formProgress;
    const interval = setInterval(() => {
      progress -= 0.03;
      setFormProgress(Math.max(progress, 0));
      if (progress <= 0) {
        clearInterval(interval);
        setFormProgress(0);
      }
    }, 16);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      {/* Canvas for constellation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: isInView ? 1 : 0, transition: 'opacity 1s ease' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center section-padding max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
            A Gentle Moment
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
            Touch the stars
          </h2>
          <p className="text-muted-foreground text-lg font-body mb-12">
            Hover or hold to see them come together
          </p>

          {/* Interactive area */}
          <motion.button
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="glass rounded-full px-12 py-6 font-body text-lg text-foreground/80 hover:text-foreground transition-colors duration-300 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-3">
              <motion.span
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦
              </motion.span>
              {isInteracting ? 'Keep holding...' : 'Hover here'}
              <motion.span
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                ✦
              </motion.span>
            </span>
          </motion.button>

          {/* Hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: formProgress > 0.8 ? 1 : 0 }}
            className="mt-8 text-primary/60 font-body text-sm"
          >
            ♡
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
