import React from 'react';
import { motion } from 'framer-motion';

const intentions = [
  {
    description: 'I promise to respect your boundaries and always seek your consent in all aspects of our relationship.'
  },
  {
    description: 'I promise to give you space to grow and be yourself, supporting your dreams and ambitions.'
  },
  {
    description: 'I promise to be honest with you at all times and communicate openly about my feelings and thoughts.'
  },
  {
    description: 'I promise to be patient and treat you with kindness, even during disagreements.'
  },
  {
    description: 'I promise to hold you tight and never let you go when you need comfort.'
  },
  {
    description: 'I promise to be your safe space, where you can always be vulnerable and authentic and one who shields you from life\'s harsh realities.'
  },
  {
    description: 'I promise to love you no matter what life throws at us.'
  }
];

export default function IntentionsPage() {
  return (
    <section className="section-padding section-margin min-h-screen bg-background flex flex-col items-center justify-center">
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-10 text-center">
        My Intentions With You💘
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {intentions.map((item, idx) => {
          // Center the last card in its row
          const isLast = idx === intentions.length - 1;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={
                `bg-card rounded-2xl p-8 shadow-lg flex flex-col items-center text-center border border-primary/10 ` +
                (isLast ? 'lg:col-start-2' : '')
              }
            >
              <p className="font-body text-lg text-foreground/80">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
