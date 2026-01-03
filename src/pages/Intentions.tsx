

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ParticleNebula from '@/components/ParticleNebula';
import CursorGlow from '@/components/CursorGlow';

const intentions = [
  {
    description: 'I promise to respect your boundaries and always seek your consent in all aspects of our relationship.',
    detail: 'Your comfort and trust matter most.'
  },
  {
    description: 'I promise to give you space to grow and be yourself, supporting your dreams and ambitions.',
    detail: 'I want to see you shine.'
  },
  {
    description: 'I promise to be honest with you at all times and communicate openly about my feelings and thoughts.',
    detail: 'Truth is the root of our bond.'
  },
  {
    description: 'I promise to be patient and treat you with kindness, even during disagreements.',
    detail: 'Gentleness, always.'
  },
  {
    description: 'I promise to hold you tight and never let you go when you need comfort.',
    detail: 'You are safe with me.'
  },
  {
    description: 'I promise to be your safe space, where you can always be vulnerable and authentic.',
    detail: 'You can always be yourself.'
  },
  {
    description: 'I promise to love you no matter what life throws at us.',
    detail: 'My heart is yours, always.'
  }
];



function Intentions() {
  return (
    <>
      <CursorGlow />
      <ParticleNebula />
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="w-full max-w-5xl px-4 py-16 mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-primary font-body text-sm tracking-widest uppercase mb-4 block">
              Intentions
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              My Intentions With You 💘
            </h2>
            <p className="text-muted-foreground text-lg font-body mb-2">
              These are my promises to you, from the heart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {intentions.map((item, idx) => (
              <Card3D key={idx} description={item.description} detail={item.detail} isLast={idx === intentions.length - 1} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


function Card3D({ description, detail, isLast, index }: { description: string; detail: string; isLast: boolean; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
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
  };
  // Calculate row-based delay for equal interval rendering
  const cardsPerRow = 3;
  const row = Math.floor(index / cardsPerRow);
  const delay = row * 0.25;
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={
        'perspective-1000 ' + (isLast ? 'lg:col-start-2' : '')
      }
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsRevealed(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative glass rounded-2xl p-7 md:p-8 cursor-pointer group border border-primary/15 shadow-card transition-all duration-300 hover:shadow-glow"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.18) 0%, transparent 70%)',
          }}
        />
        {/* Border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: '0 0 32px hsl(var(--primary) / 0.18), inset 0 0 32px hsl(var(--primary) / 0.04)',
          }}
        />
        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isRevealed ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-lg md:text-xl text-foreground mb-2 leading-relaxed"
            style={{ minHeight: '2.2em' }}
          >
            {description}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="font-body text-sm text-primary/80 mt-1"
            style={{ minHeight: '1.2em' }}
          >
            {detail}
          </motion.p>
        </div>
        {/* Decorative accent */}
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary/40" />
      </motion.div>
    </motion.div>
  );
}

export default Intentions;
