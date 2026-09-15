import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-cyan-400/20 blur-[130px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Adaptive 3D Intelligence Engine
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Master Real-Life Skills Through{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Smart 3D Simulations
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Not a static quiz. Not a text game. GameLearn dynamically observes your real-time decisions in browser-based 3D environments, scores behavioral telemetry, and automatically adjusts future challenges to your unique skill curve.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-glow-indigo transition transform hover:scale-[1.02]"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-glow-indigo transition transform hover:scale-[1.02]"
              >
                Start Adaptive Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition"
              >
                Learner Sign In
              </Link>
            </>
          )}
        </div>

        {/* The Closed-Loop Flow Teaser Card */}
        <div className="mt-16 max-w-5xl mx-auto p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="bg-[#0B0F19]/90 rounded-xl p-6 sm:p-8">
            <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold text-center mb-6">
              Continuous Adaptive Closed-Loop
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs font-medium">
              {[
                { step: '1. Assess', label: 'Learner Profile' },
                { step: '2. Skill ML', label: 'Random Forest' },
                { step: '3. Difficulty', label: 'Initial Map' },
                { step: '4. 3D Sim', label: 'WebGL Scene' },
                { step: '5. Telemetry', label: 'Behaviour Log' },
                { step: '6. Scoring', label: 'Multi-Factor' },
                { step: '7. Adapt', label: 'Difficulty ML' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-900/60 border border-white/5 flex flex-col items-center justify-center gap-1 hover:border-indigo-500/40 transition"
                >
                  <span className="text-indigo-400 font-bold text-[11px]">{item.step}</span>
                  <span className="text-slate-300 text-[11px]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Engineered for Real-World Competence
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Powered by modern web standards, lightweight WebGL, and decoupled ML classifiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dual Random Forest ML</h3>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">
              Decoupled Skill & Difficulty models evaluate capability and dynamically recalibrate challenge levels based on raw behavioural telemetry.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Lightweight 3D WebGL</h3>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">
              Low-poly 3D environments built with React Three Fiber and Three.js running smoothly at 60 FPS on any laptop without heavy downloads.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Action Telemetry Tracking</h3>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">
              Monitors reaction latency, road scanning behavior, decision speed, and mistake frequency with transparent multi-factor scoring.
            </p>
          </div>
        </div>
      </section>

      {/* Target Skills Covered */}
      <section className="py-12 border-t border-white/5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400 mb-8">
          Core Life Skill Domains Included
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {[
            'Road & Pedestrian Safety',
            'Public Transportation',
            'Money Management & Budgeting',
            'Shopping & Transactions',
            'Communication & Social',
            'Workplace Skills',
            'Emergency Decision Making',
          ].map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
