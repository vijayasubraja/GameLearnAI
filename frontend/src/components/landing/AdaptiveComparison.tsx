import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  AlertTriangle,
  Car,
  Clock,
  CheckCircle2
} from 'lucide-react';

type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface LevelProfile {
  level: SkillLevel;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  trafficDensity: string;
  vehicleSpeed: string;
  signalTime: string;
  distractions: string;
  expectedDecisions: string[];
  visualTag: string;
  accentColor: string;
  summary: string;
}

const levelProfiles: Record<SkillLevel, LevelProfile> = {
  Beginner: {
    level: 'Beginner',
    difficulty: 'Easy',
    trafficDensity: 'Low (1 Vehicle every 8-10 seconds)',
    vehicleSpeed: 'Slow (25 km/h)',
    signalTime: '18 Seconds (Extended walk phase)',
    distractions: 'None (Clear line of sight)',
    expectedDecisions: [
      'Stop at curb before stepping off',
      'Press pedestrian crossing push-button',
      'Look left and right before walking',
      'Cross within marked zebra boundary',
    ],
    visualTag: 'GUIDED_CROSSWALK_SCENARIO',
    accentColor: '#10B981',
    summary: 'A supportive, well-lit pedestrian crossing with predictable single-lane traffic and audio cues to build foundational instincts.',
  },
  Intermediate: {
    level: 'Intermediate',
    difficulty: 'Medium',
    trafficDensity: 'Moderate (Continuous 2-lane traffic flow)',
    vehicleSpeed: 'Standard (45 km/h)',
    signalTime: '12 Seconds (Standard crossing window)',
    distractions: 'Parked delivery van obstructing view of lane 2',
    expectedDecisions: [
      'Identify blind spots created by parked delivery van',
      'Anticipate turning vehicles at intersection',
      'Time crossing gap with high reaction precision',
      'Maintain continuous 360-degree awareness',
    ],
    visualTag: 'MULTI_LANE_URBAN_ARTERIAL',
    accentColor: '#F59E0B',
    summary: 'Dynamic two-lane city street requiring the learner to account for turning traffic and visual blind spots behind stationary vehicles.',
  },
  Advanced: {
    level: 'Advanced',
    difficulty: 'Hard',
    trafficDensity: 'High (Dense multi-way intersection flow)',
    vehicleSpeed: 'Variable (50-60 km/h with sudden stops)',
    signalTime: '8 Seconds (Tight decision threshold)',
    distractions: 'Approaching emergency siren + rainy wet road reflections',
    expectedDecisions: [
      'Detect and yield immediately to approaching siren',
      'Factor in longer vehicle wet-braking distances',
      'Make split-second abort or proceed decisions',
      'Evaluate multi-directional turning hazards',
    ],
    visualTag: 'COMPLEX_JUNCTION_EMERGENCY_SCENARIO',
    accentColor: '#F43F5E',
    summary: 'High-stakes urban junction featuring emergency vehicles, adverse weather traction, and tight crossing windows for master-level safety execution.',
  },
};

export const AdaptiveComparison: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>('Intermediate');

  const profile = levelProfiles[selectedLevel];

  return (
    <section id="adaptive-comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest">
          <Sliders className="w-3.5 h-3.5" />
          The World Changes With You
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Same Skill. Different Learner. Different World.
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          GameLearn does not serve static, repetitive quiz levels. Adjust the learner skill slider below to experience how the simulation dynamically morphs.
        </p>
      </div>

      {/* Interactive Skill Level Selector Slider */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="hud-panel p-2 rounded-2xl flex items-center justify-between gap-2 border border-white/10">
          {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                  isSelected
                    ? lvl === 'Beginner'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald'
                      : lvl === 'Intermediate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Morphing Simulation Showcase Matrix */}
      <div className="hud-panel-glow p-6 sm:p-8 rounded-3xl max-w-5xl mx-auto space-y-8">
        
        {/* Scenario Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-semibold">
              SCENARIO ARCHETYPE // {profile.visualTag}
            </span>
            <h3 className="text-2xl font-display font-bold text-white">
              Road Safety — Pedestrian Crossing
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
              <span className="text-slate-400">SKILL: </span>
              <span className="text-white font-bold">{profile.level}</span>
            </div>
            <div
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border"
              style={{
                backgroundColor: `${profile.accentColor}15`,
                borderColor: `${profile.accentColor}40`,
                color: profile.accentColor,
              }}
            >
              DIFFICULTY: {profile.difficulty}
            </div>
          </div>
        </div>

        {/* Narrative Summary */}
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {profile.summary}
        </p>

        {/* Dynamic Simulation Parameter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Car className="w-4 h-4" />
              <span>TRAFFIC DENSITY</span>
            </div>
            <p className="text-xs font-semibold text-slate-200">{profile.trafficDensity}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <Zap className="w-4 h-4" />
              <span>VEHICLE SPEED</span>
            </div>
            <p className="text-xs font-semibold text-slate-200">{profile.vehicleSpeed}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Clock className="w-4 h-4" />
              <span>SIGNAL WINDOW</span>
            </div>
            <p className="text-xs font-semibold text-slate-200">{profile.signalTime}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>OBSTACLES</span>
            </div>
            <p className="text-xs font-semibold text-slate-200">{profile.distractions}</p>
          </div>
        </div>

        {/* Expected Decisions Checklist */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/5 space-y-3">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">
            Required Behaviour Checklist Evaluated by Telemetry:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {profile.expectedDecisions.map((dec, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 text-xs text-slate-300 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{dec}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
