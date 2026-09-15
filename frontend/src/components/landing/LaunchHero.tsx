import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSimulationCanvas } from './HeroSimulationCanvas';
import {
  ArrowRight,
  Terminal,
  Activity,
  Cpu,
  Sparkles,
  Sliders
} from 'lucide-react';

export const LaunchHero: React.FC = () => {
  const navigate = useNavigate();
  const [isInitiating, setIsInitiating] = useState(false);

  const handleEnterSimulation = () => {
    setIsInitiating(true);
    setTimeout(() => {
      navigate('/register');
    }, 450);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-tech-grid border-b border-white/5">
      {/* Dynamic Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-indigo-600/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Vision Statement & Interactive Launch Controls */}
        <div className="lg:col-span-7 space-y-8 z-10 text-left">
          
          {/* Technical Status Badge */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="tracking-widest uppercase">ADAPTIVE INTELLIGENCE ENGINE v1.0</span>
          </div>

          {/* Core Statement */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
              Your world adapts to the way you{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
                learn.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              GameLearn transforms real-life skills into responsive browser-based 3D simulations. The platform observes your decisions in real-time, scores behavioral telemetry, and automatically adjusts future challenges to your capability.
            </p>
          </div>

          {/* Interactive Launch Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={handleEnterSimulation}
              disabled={isInitiating}
              className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
                isInitiating
                  ? 'bg-cyan-500 text-black scale-95 shadow-glow-cyan'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-glow-indigo hover:shadow-glow-cyan hover:scale-[1.02]'
              }`}
            >
              <span className="font-mono">
                {isInitiating ? 'INITIALIZING PROTOCOL...' : 'ENTER THE SIMULATION'}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-mono text-slate-300 bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-indigo-500/40 transition"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>ACCESS TERMINAL</span>
            </button>
          </div>

          {/* Live Pipeline Telemetry Strip */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
                <span>OBSERVE</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Real-Time Actions</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>PREDICT</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Random Forest ML</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                <Sliders className="w-3.5 h-3.5" />
                <span>ADAPT</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Dynamic Difficulty</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EVOLVE</span>
              </div>
              <p className="text-xs font-semibold text-slate-200">Personalized Curve</p>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive 3D Simulation Node & HUD Frame */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-cyan-500/30 via-indigo-500/20 to-transparent shadow-2xl">
            <div className="hud-panel rounded-2xl overflow-hidden p-2 relative">
              {/* HUD Header Bar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white font-semibold">SIM_CORE // 01</span>
                </div>
                <span className="text-cyan-400 font-medium">INTERACTIVE 3D</span>
              </div>

              {/* 3D WebGL Canvas */}
              <HeroSimulationCanvas />

              {/* HUD Footer Diagnostics */}
              <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-slate-400">INPUT: CURSOR / TOUCH</span>
                <span className="text-indigo-400">FRAME_BUDGET: 16.6MS</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
