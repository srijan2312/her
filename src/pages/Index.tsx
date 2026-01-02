import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import SmoothScroll from '@/components/SmoothScroll';
import CursorGlow from '@/components/CursorGlow';
import ParticleNebula from '@/components/ParticleNebula';
import HeroSection from '@/components/HeroSection';
import TraitsSection from '@/components/TraitsSection';
import Intentions from './Intentions';
import AppreciationCards from '@/components/AppreciationCards';
import WhatIf from './WhatIf';
import ConstellationSection from '@/components/ConstellationSection';
import FinalSection from '@/components/FinalSection';

// Loading screen component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Animated loading symbol */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-8 relative"
        >
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center text-3xl text-primary"
          >
            ✦
          </motion.span>
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-sm text-muted-foreground tracking-widest uppercase"
        >
          Creating something special
        </motion.p>

        {/* Progress bar */}
        <motion.div className="mt-6 w-48 h-px bg-border mx-auto overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Index({ animationsActive = true }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Only render animated backgrounds if animationsActive is true */}
          {animationsActive && <CursorGlow />}
          {animationsActive && <ParticleNebula />}

          {/* Main content */}
          <main className="relative z-10">
            {/* Hero with poetic intro */}
            <HeroSection animationsActive={animationsActive} />

            {/* Character traits - horizontal scroll */}
            <TraitsSection />

            {/* Intentions section */}
            <Intentions />


            {/* Little things I notice - 3D cards */}
            <AppreciationCards />

            {/* What If page section */}
            <WhatIf />

            {/* Interactive constellation */}
            {animationsActive && <ConstellationSection />}

            {/* Final sentiment */}
            <FinalSection />
          </main>
        </>
      )}
    </>
  );
}
