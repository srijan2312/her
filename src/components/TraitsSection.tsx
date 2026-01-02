import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const traits = [
  {
  title: "Honesty",
  description: "You say what you feel without unnecessary filters",
  symbol: "◉",
},
{
  title: "Clear Expression",
  description: "You share your thoughts openly and directly",
  symbol: "◎",
},
{
  title: "Emotional Clarity",
  description: "You keep intentions and feelings transparent",
  symbol: "◐",
},
{
  title: "Lively Spirit",
  description: "You bring energy into conversations",
  symbol: "◑",
},
{
  title: "Patient Listener",
  description: "You listen with attention, not interruption",
  symbol: "◒",
},
{
  title: "Strong Personality",
  description: "You carry yourself with confidence and balance",
  symbol: "◓",
},


];

function TraitCard({ trait, index }: { trait: typeof traits[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  // Calculate row-based delay for equal interval rendering
  const cardsPerRow = 3; // matches the grid/scroll layout
  const row = Math.floor(index / cardsPerRow);
  const delay = row * 0.25; // 0.25s between each row

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="scroll-section w-[85vw] md:w-[60vw] lg:w-[45vw] h-[60vh] flex-shrink-0 flex items-center justify-center p-4"
    >
      <div className="glass-strong rounded-3xl p-8 md:p-12 w-full h-full flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-default">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[60px]" />
        </div>

        {/* Symbol */}
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1, delay: index * 0.15 + 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-7xl text-primary mb-8 block text-glow"
        >
          {trait.symbol}
        </motion.span>

        {/* Title */}
        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
          {trait.title}
        </h3>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-6"
        />

        {/* Description */}
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-md">
          {trait.description}
        </p>

        {/* Index indicator */}
        <div className="absolute bottom-8 right-8 font-body text-sm text-muted-foreground/50">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
    </motion.div>
  );
}

export default function TraitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !sectionRef.current || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const scrollWidth = scrollContainer.scrollWidth - window.innerWidth;

    const tween = gsap.to(scrollContainer, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Section header */}
      <div className="section-padding pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
            Character Essence
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            What makes you,{' '}
            <span className="text-gradient italic">you</span>
          </h2>
          <p className="text-muted-foreground text-lg font-body">
            These are the qualities that stand out. Not just noticed — appreciated.
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll container (desktop) / Vertical scroll (mobile) */}
      {isMobile ? (
        <div className="section-padding space-y-6 pb-24">
          {traits.map((trait, index) => (
            <TraitCard key={index} trait={trait} index={index} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex gap-8 pl-12 md:pl-24"
          style={{ width: 'max-content' }}
        >
          {traits.map((trait, index) => (
            <TraitCard key={index} trait={trait} index={index} />
          ))}
          {/* Spacer */}
          <div className="w-[20vw] flex-shrink-0" />
        </div>
      )}
    </section>
  );
}
