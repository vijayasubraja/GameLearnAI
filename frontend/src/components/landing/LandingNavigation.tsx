import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, ArrowRight, Info, Layers, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LandingNavigationProps {
  onOpenAbout: () => void;
  onOpenFeatures: () => void;
  onOpenSimulations: () => void;
  onResetView: () => void;
  is2DView: boolean;
  onToggle2DView: () => void;
}

export const LandingNavigation: React.FC<LandingNavigationProps> = ({
  onOpenAbout,
  onOpenFeatures,
  onOpenSimulations,
  onResetView,
  is2DView,
  onToggle2DView,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="absolute top-0 inset-x-0 z-40 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div
          onClick={onResetView}
          className="hud-panel py-2 px-3.5 rounded-2xl flex items-center gap-3 pointer-events-auto cursor-pointer border border-white/10 hover:border-cyan-500/40 transition group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#050811] rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-cyan-400 transition group-hover:scale-110" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-sm tracking-tight text-white leading-none">
              GAMELEARN <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              3D Simulation World
            </span>
          </div>
        </div>

        {/* Center Minimal Actions (Desktop) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 hud-panel py-1.5 px-2 rounded-2xl pointer-events-auto border border-white/10 text-xs font-mono">
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>ABOUT</span>
          </button>
          <button
            onClick={onOpenFeatures}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>FEATURES</span>
          </button>
          <button
            onClick={onOpenSimulations}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>SIMULATIONS</span>
          </button>
          <button
            onClick={onToggle2DView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              is2DView ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{is2DView ? '3D VIEW' : '2D MAP'}</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="hud-panel py-2 px-4 rounded-xl text-xs font-mono font-bold text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition flex items-center gap-2"
            >
              <span>DASHBOARD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="hud-panel py-2 px-3.5 rounded-xl text-xs font-mono font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition hidden sm:inline-block"
              >
                LOGIN
              </button>
              <button
                onClick={() => navigate('/login')}
                className="py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-glow-indigo transition transform hover:scale-[1.02] flex items-center gap-2"
              >
                <span>START LEARNING</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
