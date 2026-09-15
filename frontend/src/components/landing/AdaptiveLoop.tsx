import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Database,
  Cpu,
  Layers,
  Activity,
  Award
} from 'lucide-react';

interface LoopNode {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  input: string;
  output: string;
  icon: React.ReactNode;
}

const loopNodes: LoopNode[] = [
  {
    id: 'assess',
    name: '1. Assessment',
    category: 'PROFILING',
    type: 'Situational Questionnaire',
    description: '25–35 scenario questions capture initial experience, instincts, and decision confidence.',
    input: 'Learner responses to real-world dilemmas',
    output: 'Normalized numerical feature vector',
    icon: <Database className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: 'skill_ml',
    name: '2. Skill ML Model',
    category: 'MACHINE LEARNING',
    type: 'Random Forest Classifier',
    description: 'Predicts independent capability levels for each distinct life-skill domain.',
    input: 'Experience, confidence, knowledge vector',
    output: 'Beginner | Intermediate | Advanced',
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: 'scenario_selector',
    name: '3. Scenario Selector',
    category: 'RULE ENGINE',
    type: 'Contextual Engine',
    description: 'Maps initial skill level to difficulty and selects target mission scenario.',
    input: 'Domain + Skill Level + History',
    output: 'Configured 3D scenario bundle',
    icon: <Layers className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: 'simulation',
    name: '4. 3D WebGL Sim',
    category: 'SIMULATION',
    type: 'React Three Fiber Scene',
    description: 'Interactive low-poly simulation executing at 60 FPS in modern browsers.',
    input: 'Scenario parameters + Player input',
    output: 'Interactive simulation environment',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'telemetry',
    name: '5. Behaviour Stream',
    category: 'TELEMETRY',
    type: 'High-Frequency Ingestion',
    description: 'Captures road scanning, reaction speeds, hesitation, and safety violations.',
    input: 'Player actions, camera angles, timestamps',
    output: 'Structured telemetry event sequence',
    icon: <Activity className="w-5 h-5 text-rose-400" />,
  },
  {
    id: 'scoring',
    name: '6. Scoring Engine',
    category: 'ANALYTICS',
    type: 'Multi-Factor Evaluator',
    description: 'Computes weighted scores: Accuracy (30%), Safety (25%), Decision (20%), Reaction (10%).',
    input: 'Telemetry stream & checklist items',
    output: 'Composite Performance Vector (0-100)',
    icon: <Award className="w-5 h-5 text-purple-400" />,
  },
  {
    id: 'difficulty_ml',
    name: '7. Difficulty ML Model',
    category: 'MACHINE LEARNING',
    type: 'Random Forest Classifier',
    description: 'Evaluates performance trends to predict the next challenge difficulty.',
    input: 'Accuracy, safety score, mistake count, latency',
    output: 'Next Difficulty: Easy | Medium | Hard',
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: 'adapt_loop',
    name: '8. Profile & Next Loop',
    category: 'FEEDBACK LOOP',
    type: 'Adaptive Recalibration',
    description: 'Updates learner profile and immediately selects the adapted next scenario.',
    input: 'Updated competency + New difficulty',
    output: 'Trigger adapted Next Scenario',
    icon: <RotateCcw className="w-5 h-5 text-emerald-400" />,
  },
];

export const AdaptiveLoop: React.FC = () => {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % loopNodes.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeNode = loopNodes[activeNodeIndex];

  return (
    <section id="adaptive-loop" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest">
          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          Autonomous Closed-Loop
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          The Continuous Intelligence Feedback Loop
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Observe how learner decisions seamlessly travel through feature ingestion, ML inference, 3D simulation, and real-time difficulty recalibration.
        </p>
      </div>

      {/* Main Interactive Loop Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Interactive Circuit Grid of 8 Nodes */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-3xl bg-slate-950/80 border border-white/10 relative">
            {loopNodes.map((node, idx) => {
              const isActive = idx === activeNodeIndex;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setActiveNodeIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-300 flex flex-col justify-between min-h-[110px] relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 border border-cyan-400 shadow-glow-cyan scale-[1.03] z-10'
                      : 'bg-slate-900/40 border border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Top: Icon + Stage */}
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                      {node.icon}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Bottom: Name */}
                  <div className="mt-2">
                    <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
                      {node.category}
                    </p>
                    <p className="text-xs font-bold text-white leading-snug truncate">
                      {node.name.split('. ')[1]}
                    </p>
                  </div>

                  {/* Active Pulse Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Autoplay Controls */}
          <div className="mt-4 flex items-center justify-between px-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>PACKET TRAVERSAL: {isAutoPlaying ? 'ACTIVE' : 'MANUAL INSPECTION'}</span>
            </span>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
            >
              {isAutoPlaying ? 'Pause Animation' : 'Resume Autoplay'}
            </button>
          </div>
        </div>

        {/* Right: Active Node Deep-Dive Inspector */}
        <div className="lg:col-span-5">
          <div className="hud-panel-glow p-6 sm:p-7 rounded-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>ACTIVE NODE INSPECTOR</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300 border border-white/10">
                {activeNode.category}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-display font-extrabold text-white">
                {activeNode.name}
              </h3>
              <p className="text-xs font-mono text-indigo-400 mt-0.5">
                {activeNode.type}
              </p>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {activeNode.description}
              </p>
            </div>

            {/* Input / Output Contract */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Data Ingested (Input)</span>
                <p className="text-xs font-mono text-slate-200">{activeNode.input}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Engine Output (Payload)</span>
                <p className="text-xs font-mono text-emerald-300 font-semibold">{activeNode.output}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>LATENCY: &lt; 3.5ms</span>
              <span className="text-emerald-400">STATUS: VERIFIED</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
