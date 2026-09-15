import React from 'react';
import { X, Terminal, Activity, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AboutTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutTerminal: React.FC<AboutTerminalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="hud-panel-glow w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span id="about-dialog-title">SYSTEM INFO // ABOUT GAMELEARN</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-black text-white">
            GameLearn AI
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            GameLearn combines interactive 3D simulation and adaptive intelligence to help learners practice real-life skills.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rather than passive multiple-choice exams, learners navigate interactive browser-based scenarios where choices generate high-resolution telemetry. Dual Random Forest ML classifiers independently evaluate domain capabilities and recalibrate the challenge difficulty.
          </p>
        </div>

        {/* Architecture Points */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              Dual Random Forest
            </span>
            <p className="text-[11px] text-slate-400">Decoupled Skill & Difficulty models</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              Lightweight WebGL
            </span>
            <p className="text-[11px] text-slate-400">60 FPS on low-power laptop GPUs</p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-mono uppercase font-bold tracking-wider text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-glow-indigo transition"
          >
            START LEARNING →
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
