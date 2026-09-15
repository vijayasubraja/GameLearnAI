import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Eye,
  TrafficCone
} from 'lucide-react';

type ViewMode = 'pedestrian' | 'drone' | 'telemetry';

export const SimulationShowcase: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('pedestrian');
  const [activeHotspot, setActiveHotspot] = useState<string | null>('signal');

  return (
    <section id="simulations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-widest">
          <Layers className="w-3.5 h-3.5" />
          WebGL Simulation Engine
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Lightweight 3D Browser Simulation
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Engineered for laptops with integrated GPUs. Zero heavy downloads. Pure WebGL delivering responsive physics, traffic logic, and sub-second decision tracking.
        </p>
      </div>

      {/* Main Cinematic Simulation Frame Container */}
      <div className="max-w-5xl mx-auto">
        <div className="hud-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
          
          {/* Top Frame Control Bar */}
          <div className="p-4 bg-slate-950/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>SCENARIO: ROAD SAFETY 01</span>
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                TARGET: CROSSWALK
              </span>
            </div>

            {/* View Angle Switcher */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setViewMode('pedestrian')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'pedestrian'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pedestrian View
              </button>
              <button
                onClick={() => setViewMode('drone')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'drone'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Aerial Drone
              </button>
              <button
                onClick={() => setViewMode('telemetry')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'telemetry'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Telemetry HUD
              </button>
            </div>
          </div>

          {/* Simulation Viewport Canvas Simulation Area */}
          <div className="relative min-h-[380px] sm:min-h-[460px] bg-gradient-to-b from-slate-950 via-[#0B1020] to-slate-950 flex items-center justify-center p-6 overflow-hidden">
            
            {/* Visual Simulation Representation */}
            <div className="w-full max-w-2xl aspect-video rounded-2xl bg-slate-950 border border-white/10 relative overflow-hidden flex flex-col justify-between p-6 shadow-inner">
              
              {/* Road Markings & Visual Scene Elements */}
              <div className="absolute inset-0 opacity-40 bg-tech-grid" />
              
              {/* Center Crosswalk Zebra Stripes */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 bg-slate-900/90 border-y border-white/10 flex items-center justify-around px-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-8 h-16 bg-white/30 rounded-sm" />
                ))}
              </div>

              {/* Animated Vehicle Representation */}
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-24 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 border border-cyan-400/40 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-glow-cyan">
                VEHICLE_01
              </div>

              {/* Pedestrian Starting Position */}
              <div className="absolute right-12 bottom-6 w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-xs font-mono font-bold text-emerald-300 shadow-glow-emerald animate-pulse">
                YOU
              </div>

              {/* Interactive Scene Checkpoints */}
              <div className="relative z-10 flex items-center justify-between">
                <button
                  onClick={() => setActiveHotspot('signal')}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition ${
                    activeHotspot === 'signal'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:border-white/30'
                  }`}
                >
                  <TrafficCone className="w-4 h-4" />
                  <span>Traffic Signal (WAIT)</span>
                </button>

                <button
                  onClick={() => setActiveHotspot('curb')}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition ${
                    activeHotspot === 'curb'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:border-white/30'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Look Check: Left & Right</span>
                </button>
              </div>

              {/* Center Status HUD Display */}
              <div className="relative z-10 text-center space-y-1">
                {viewMode === 'telemetry' ? (
                  <div className="inline-block p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                    <p className="font-bold">TELEMETRY DATA PACKET ACTIVE</p>
                    <p className="text-[10px] text-slate-400">Lat: 1.1s | Gap: 7.8s | Angle: 90° | Safe: TRUE</p>
                  </div>
                ) : (
                  <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300">
                    MODE: {viewMode.toUpperCase()} | CAMERA: 60 FPS
                  </div>
                )}
              </div>

              {/* Bottom Checklist HUD */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Zebra Boundary Triggered
                </span>
                <span>Approaching Traffic Gap: 7.8s</span>
              </div>
            </div>

          </div>

          {/* Bottom Live Hotspot Inspector Info */}
          <div className="p-4 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">HOTSPOT DETAIL:</span>
              <span className="text-white font-bold">
                {activeHotspot === 'signal'
                  ? 'Pedestrian Push Button: Activates amber warning countdown'
                  : 'Look-Scan Trigger: Evaluates learner looking left before stepping into lane'}
              </span>
            </div>
            <span className="text-cyan-400 font-semibold">
              EVALUATED BY RANDOM FOREST
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
