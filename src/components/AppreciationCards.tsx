import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const appreciations = [
  {
  text: "If we were two sunflowers",
  detail: "I would still choose to face you instead of the sun",
},
{
  text: "I once wrote a list of important people",
  detail: "Your name was the only one written in ink",
},
{
  text: "Every rose has its thorns",
  detail: "I’m willing to hold yours, even if it hurts",
},
{
  text: "You cross my mind more than you realize",
  detail: "Enough to fill an entire galaxy with stars",
},
{
  text: "Loving you means understanding your fears",
  detail: "So I’ll sit with you through all of them",
},
{
  text: "Even when doubt appears again and again",
  detail: "I’ll keep reminding you that I choose you",
},
{
  text: "Let me be foolish in one way",
  detail: "By loving you without expectations",
},
{
  text: "I may struggle to express myself clearly",
  detail: "But I’ve never been dishonest about liking you",
},
{
  text: "Anything I do for you",
  detail: "Is to show care, not to ask for love",
},
{
  text: "I know you can handle things yourself",
  detail: "But I still want to do them for you",
},
{
  text: "I don’t know why, but I still believe",
  detail: "That you and I could work",
},
{
  text: "The possibility of us feels different",
  detail: "Enough to be worth waiting for",
},
{
  text: "I don’t need grand moments",
  detail: "I value the quiet ones we share",
},
{
  text: "I’m not here to rush anything",
  detail: "I’d rather let things grow naturally",
},
{
  text: "Your honesty matters to me",
  detail: "Even when the truth is difficult",
},
{
  text: "I pay attention to the small things",
  detail: "Because they say the most about you",
},
{
  text: "I want to understand you better",
  detail: "Not to change you, but to know you",
},
{
  text: "I believe in consistency over promises",
  detail: "Showing up matters more than words",
},
{
  text: "I respect your pace",
  detail: "And the space you sometimes need",
},
{
  text: "I don’t expect perfection",
  detail: "Just honesty and effort",
},
{
  text: "I’m willing to learn along the way",
  detail: "Even if it takes time",
},
{
  text: "If this turns into something real",
  detail: "I want it to feel safe for both of us",
},
{
  text: "I don’t want to impress you",
  detail: "I just want to be honest with you",
},
{
  text: "If you ever feel unsure",
  detail: "I’ll be steady, not distant",
},

];

function Card3D({ appreciation, index }: { appreciation: typeof appreciations[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPercent = mouseX / rect.width - 0.5;
    const yPercent = mouseY / rect.height - 0.5;

    x.set(xPercent);
    y.set(yPercent);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    // Do not hide text after reveal
  };

  // Calculate row-based delay for equal interval rendering
  const cardsPerRow = 3; // matches lg:grid-cols-3
  const row = Math.floor(index / cardsPerRow);
  const delay = row * 0.25; // 0.25s between each row

  // Touch support: show card on touch start, hide on touch end
  const handleTouchStart = () => setIsRevealed(true);
  const handleTouchEnd = () => {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsRevealed(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative glass rounded-2xl p-8 cursor-default group border border-primary/20"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
          }}
        />

        {/* Border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: '0 0 40px hsl(var(--primary) / 0.3), inset 0 0 40px hsl(var(--primary) / 0.05)',
          }}
        />

        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isRevealed ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-xl md:text-2xl text-foreground mb-3 leading-relaxed"
            style={{ minHeight: '2.5em' }}
          >
            "{appreciation.text}"
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="font-body text-sm text-primary"
            style={{ minHeight: '1.5em' }}
          >
            {appreciation.detail}
          </motion.p>
        </div>

        {/* Decorative accent */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/50" />
      </motion.div>
    </motion.div>
  );
}

export default function AppreciationCards() {
  return (
    <section className="section-padding section-margin">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-20"
      >
        <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
          Little Things
        </span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
          What I notice about{' '}
          <span className="text-gradient italic">you</span>
        </h2>
        <p className="text-muted-foreground text-lg font-body">
          The small moments that reveal who you really are.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {appreciations.map((appreciation, index) => (
          <Card3D key={index} appreciation={appreciation} index={index} />
        ))}
      </div>
    </section>
  );
}
