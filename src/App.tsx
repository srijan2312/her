import { useEffect, useRef, useState } from "react";

function BackgroundMusic({ play }: { play: boolean }) {
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && play) {
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } else if (audio && !play) {
      audio.pause();
      // Do not reset currentTime here, so music resumes from where it was paused
    }
  }, [play]);
  return (
    <audio
      ref={audioRef}
      src="Perfect.mp3" // Place your mp3 in the public folder and update the filename
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WhatIf from "./pages/WhatIf";

const queryClient = new QueryClient();



const App = () => {
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Prevent scrolling when overlay is visible
  useEffect(() => {
    if (!musicStarted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [musicStarted]);

  return (
    <>
      <BackgroundMusic play={musicPlaying} />
      {/* Play/Pause button in top right corner */}
      {musicStarted && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          right: '2rem',
          zIndex: 10000,
        }}>
          <button
            onClick={() => setMusicPlaying((prev) => !prev)}
            style={{
              fontSize: '1.5rem',
              padding: '0.5rem 1.2rem',
              borderRadius: '2rem',
              background: 'linear-gradient(90deg, #ffb6b9, #fae3d9)',
              color: '#222',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
              transition: 'background 0.2s',
            }}
            aria-label={musicPlaying ? 'Pause Music' : 'Play Music'}
          >
            {musicPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>
      )}
      {/* Initial overlay for music start */}
      {!musicStarted && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(10,10,20,0.96)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <button
            onClick={() => { setMusicStarted(true); setMusicPlaying(true); }}
            style={{
              fontSize: '2rem',
              padding: '1rem 2.5rem',
              borderRadius: '2rem',
              background: 'linear-gradient(90deg, #ffb6b9, #fae3d9)',
              color: '#222',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
              marginBottom: '1.5rem',
            }}
          >
            ▶️ Play Music
          </button>
          <span style={{ color: '#fff', fontSize: '1.1rem', opacity: 0.8 }}>Click to enter and enjoy the music!</span>
        </div>
      )}
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/what-if" element={<WhatIf />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
