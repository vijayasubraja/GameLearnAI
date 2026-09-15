import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand & Purpose */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span className="font-display font-bold text-lg text-white">
              GameLearn <span className="text-cyan-400">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Smart Adaptive Learning Adventure teaching real-life skills through lightweight browser-based 3D simulations and dual Random Forest machine learning.
          </p>
        </div>

        {/* Col 2: Navigation Jumps */}
        <div className="space-y-2 text-xs font-mono">
          <p className="text-slate-200 font-bold uppercase tracking-wider">Navigation</p>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <a href="#how-it-adapts" className="hover:text-cyan-400 transition">
                // 5-Stage Adaptive Methodology
              </a>
            </li>
            <li>
              <a href="#adaptive-loop" className="hover:text-cyan-400 transition">
                // Continuous Feedback Loop
              </a>
            </li>
            <li>
              <a href="#adaptive-comparison" className="hover:text-cyan-400 transition">
                // The World Changes With You
              </a>
            </li>
            <li>
              <a href="#simulations" className="hover:text-cyan-400 transition">
                // 3D WebGL Simulation Engine
              </a>
            </li>
            <li>
              <a href="#skills" className="hover:text-cyan-400 transition">
                // 7 Life-Skill Worlds
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Architecture Diagnostics */}
        <div className="space-y-2 text-xs font-mono">
          <p className="text-slate-200 font-bold uppercase tracking-wider">Architecture</p>
          <div className="space-y-1.5 text-slate-400">
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              FastAPI + PostgreSQL
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Three.js + WebGL
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              scikit-learn Random Forest
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              bcrypt + JWT Security
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
        <p>GameLearn AI © 2026 — Smart Adaptive Simulation Platform</p>
        <p className="text-slate-400">
          ASSESS → PREDICT → SIMULATE → TRACK → SCORE → ADAPT
        </p>
      </div>
    </footer>
  );
};
