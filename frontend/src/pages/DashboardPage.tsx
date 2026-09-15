import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Lock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-white/10 bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-slate-900/90 shadow-2xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Phase 1: Foundation Active
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Welcome, {user?.full_name || user?.username}!
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Your authenticated learner profile is securely synchronized. The adaptive assessment and 3D simulation modules are ready for activation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Joined</p>
                <p className="text-xs font-bold text-white">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
              <Award className="w-4 h-4 text-indigo-400" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Status</p>
                <p className="text-xs font-bold text-emerald-400">Authenticated (JWT)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Progression Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Initial Profiling */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-indigo-500">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Step 1</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Learner Assessment</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Complete situational decision questions to establish your baseline skills across 7 real-life domains.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Ready for Phase 2
            </span>
            <button
              disabled
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs font-semibold cursor-not-allowed border border-indigo-500/20"
            >
              Start Assessment
            </button>
          </div>
        </div>

        {/* Card 2: Skill Classification */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-cyan-500 opacity-90">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Step 2</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Skill ML Inference</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Random Forest classifies per-skill capability into Beginner, Intermediate, or Advanced.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Requires Step 1
            </span>
            <span className="text-xs text-slate-500 font-semibold">Phase 3</span>
          </div>
        </div>

        {/* Card 3: 3D Simulation */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-emerald-500 opacity-90">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Step 3</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">3D Simulation Scenario</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Interactive WebGL road safety environment tracking telemetry, reaction time, and decision quality.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Requires Step 2
            </span>
            <span className="text-slate-500 font-semibold text-xs">Phase 4</span>
          </div>
        </div>
      </div>

      {/* System Health / Diagnostic Matrix */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          Foundation Subsystem Diagnostics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <p className="text-slate-400 font-medium">Session Security</p>
            <p className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              JWT Bearer (HS256)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <p className="text-slate-400 font-medium">Password Hashing</p>
            <p className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              bcrypt Salt & Hash
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <p className="text-slate-400 font-medium">API Layer</p>
            <p className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              FastAPI v1 Connected
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <p className="text-slate-400 font-medium">Database Layer</p>
            <p className="text-white font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              SQLAlchemy ORM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
