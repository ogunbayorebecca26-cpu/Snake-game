import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';
import { motion } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black p-6 glitch-border">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-24 h-24 border-2 border-[#f0f] overflow-hidden"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#f0f]/10 mix-blend-overlay" />
          </motion.div>
          
          <div className="flex-1 overflow-hidden">
            <h3 className="text-[#0ff] font-bold text-2xl truncate glitch-text tracking-tighter">{currentTrack.title}</h3>
            <p className="text-[#f0f] text-sm truncate opacity-70 uppercase tracking-widest">{currentTrack.artist}</p>
            <div className="flex items-center gap-2 mt-2 text-[#0ff]/40">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]">SIGNAL_TYPE: NEURAL_STREAM</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="relative h-4 w-full bg-[#0ff]/10 border border-[#0ff]/30 overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#0ff]"
              style={{ width: `${progress}%` }}
            />
            {/* Progress Bar Glitch Artifacts */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="h-full w-1 bg-white absolute animate-pulse" style={{ left: '20%' }} />
              <div className="h-full w-1 bg-white absolute animate-pulse" style={{ left: '70%' }} />
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#0ff]/50 uppercase">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '00:00'}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-10">
          <button 
            onClick={handlePrev}
            className="text-[#f0f] hover:text-[#0ff] transition-colors uppercase text-xs font-bold tracking-widest"
          >
            [ PREV ]
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 flex items-center justify-center border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-all"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-[#f0f] hover:text-[#0ff] transition-colors uppercase text-xs font-bold tracking-widest"
          >
            [ NEXT ]
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-1 border border-[#f0f]/30 bg-[#f0f]/5">
          <span className="text-[10px] text-[#f0f] font-mono uppercase tracking-widest">AMPLITUDE_LEVEL</span>
          <div className="flex-1 h-1 bg-[#f0f]/20">
            <div className="w-3/4 h-full bg-[#f0f]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
