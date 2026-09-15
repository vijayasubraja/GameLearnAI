import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Terminal, Sparkles, ShieldCheck, Activity } from 'lucide-react';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-r from-indigo-600/20 via-cyan-500/15 to-purple-600/20 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto hud-panel-glow p-8 sm:p-14 rounded-3xl text-center space-y-8 relative overflow-hidden border border-indigo-500/30">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          SIMULATION PROTOCOL READY
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
            Ready to experience a world that{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              adapts to your decisions?
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Begin your situational profiling assessment. Establish your real-life skill baseline and enter the browser-based 3D simulation today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-xl text-sm font-mono font-bold tracking-wider uppercase text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-glow-indigo hover:shadow-glow-cyan transition transform hover:scale-[1.02]"
          >
            <span>START YOUR JOURNEY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/40 transition"
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>LEARNER SIGN IN</span>
          </button>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            JWT Secured
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            WebGL 60 FPS Engine
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Dual Random Forest ML
          </span>
        </div>

      </div>
    </section>
  );
};
