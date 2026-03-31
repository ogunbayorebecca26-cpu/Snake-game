import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000] text-[#0ff] font-mono selection:bg-[#f0f]/30 overflow-hidden relative">
      {/* CRT Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="scanline" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen gap-16">
        <header className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative inline-block"
          >
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase glitch-text italic">
              GRID_BREACH
            </h1>
            <div className="absolute -top-4 -right-4 text-[10px] bg-[#f0f] text-black px-2 py-0.5 animate-bounce">
              V1.0.4_STABLE
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 text-[#f0f] text-xs tracking-[0.5em] uppercase"
          >
            <span>[ SYSTEM_READY ]</span>
            <span className="w-2 h-2 bg-[#0ff] animate-ping" />
            <span>[ UPLINK_ACTIVE ]</span>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-16 w-full max-w-7xl">
          {/* Left Side: Music Player */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full lg:w-auto order-2 lg:order-1"
          >
            <div className="mb-2 text-[10px] text-[#f0f] tracking-widest uppercase opacity-50">
              // AUDIO_DECODER_MODULE
            </div>
            <MusicPlayer />
          </motion.div>

          {/* Center: Snake Game */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="mb-2 text-[10px] text-[#0ff] tracking-widest uppercase opacity-50 text-center">
              // SPATIAL_RECON_UNIT
            </div>
            <SnakeGame />
          </motion.div>

          {/* Right Side: Terminal/Log */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="hidden xl:flex flex-col gap-6 w-72 order-3"
          >
            <div className="bg-black p-6 glitch-border">
              <h4 className="text-[#f0f] text-sm uppercase tracking-widest mb-4 border-b border-[#f0f]/30 pb-2">KERNEL_LOG</h4>
              <div className="space-y-4 font-mono text-[10px] leading-relaxed">
                <p className="text-[#0ff]/60">
                  <span className="text-[#f0f] mr-2">[05:07:18]</span>
                  INITIALIZING_NEURAL_INTERFACE...
                </p>
                <p className="text-[#0ff]/60">
                  <span className="text-[#f0f] mr-2">[05:07:19]</span>
                  GRID_SYNC_SUCCESSFUL.
                </p>
                <p className="text-[#0ff]/60">
                  <span className="text-[#f0f] mr-2">[05:07:20]</span>
                  BREACH_DETECTED_IN_SECTOR_7G.
                </p>
                <p className="text-[#0ff] animate-pulse">
                  <span className="text-[#f0f] mr-2">[05:07:21]</span>
                  AWAITING_USER_COMMAND_
                </p>
              </div>
            </div>

            <div className="p-4 border-2 border-[#f0f]/20 bg-[#f0f]/5">
              <div className="text-[10px] text-[#f0f] uppercase tracking-widest mb-2">HARDWARE_TEMP</div>
              <div className="h-1 w-full bg-[#f0f]/10">
                <motion.div 
                  animate={{ width: ['20%', '80%', '40%', '90%', '60%'] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="h-full bg-[#f0f]" 
                />
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-auto pt-12 text-[#0ff]/20 text-[10px] uppercase tracking-[1em] animate-pulse">
          TERMINAL_ID: 0x882_GLITCH_CORE
        </footer>
      </main>
    </div>
  );
}
