import React, { useState } from 'react';
import {
  BrainCircuit,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Compass
} from 'lucide-react';

interface JourneyStep {
  number: string;
  title: string;
  tag: string;
  description: string;
  engine: string;
  metric: string;
  icon: React.ReactNode;
  visualState: {
    accentColor: string;
    hudLabel: string;
    codeSnippet: string;
    systemOutput: string;
  };
}

const steps: JourneyStep[] = [
  {
    number: '01',
    title: 'Situational Profiling',
    tag: 'ASSESS',
    description:
      'Rather than textbook multiple-choice questions, the learner faces practical scenario dilemmas across 7 essential life skill domains to evaluate instinct, confidence, and real-world awareness.',
    engine: 'Situational Feature Vectorizer',
    metric: '25–35 Scenario Dilemmas',
    icon: <Compass className="w-6 h-6 text-indigo-400" />,
    visualState: {
      accentColor: '#818CF8',
      hudLabel: 'INPUT_VECTOR_INITIALIZATION',
      codeSnippet: `{\n  "experience": 3.5,\n  "confidence": 4.0,\n  "knowledge_score": 0.82,\n  "situational_choice": "SIGNAL_CHECK"\n}`,
      systemOutput: 'PROFILING COMPLETED: Vector normalized across 7 dimensions',
    },
  },
  {
    number: '02',
    title: 'Per-Skill Capability Classification',
    tag: 'PREDICT',
    description:
      'A dedicated Random Forest Classifier analyzes the multidimensional assessment vector, generating separate capability predictions (Beginner, Intermediate, Advanced) for each individual skill category.',
    engine: 'Random Forest Skill Classifier',
    metric: 'Decoupled Per-Skill Classification',
    icon: <BrainCircuit className="w-6 h-6 text-cyan-400" />,
    visualState: {
      accentColor: '#06B6D4',
      hudLabel: 'ML_SKILL_INFERENCE_PIPELINE',
      codeSnippet: `predict_skill({\n  "domain": "Road Safety",\n  "features": [3.5, 4.0, 0.82, 0.9]\n})\n// Inference: 1.8ms`,
      systemOutput: 'PREDICTION: "Beginner" (Confidence: 89.4%) -> Initial Easy Diff',
    },
  },
  {
    number: '03',
    title: 'Interactive 3D WebGL Simulation',
    tag: 'SIMULATE',
    description:
      'The learner is placed into a tailored 3D simulation running smoothly in WebGL. Low-poly assets and physics evaluate real-time navigation, attention checks, and environmental decision-making.',
    engine: 'React Three Fiber & Three.js',
    metric: '60 FPS on Integrated GPUs',
    icon: <Layers className="w-6 h-6 text-emerald-400" />,
    visualState: {
      accentColor: '#10B981',
      hudLabel: '3D_SIMULATION_ENVIRONMENT_SPAWN',
      codeSnippet: `<SimulationCanvas\n  scenario="road_safety_crosswalk"\n  difficulty="Easy"\n  trafficGap={8.5}\n  signalDuration={15}\n/>`,
      systemOutput: 'WORLD RENDERED: Crosswalk active, traffic gap: 8.5s',
    },
  },
  {
    number: '04',
    title: 'High-Resolution Telemetry Tracking',
    tag: 'OBSERVE',
    description:
      'As the learner navigates the 3D space, millisecond-accurate telemetry captures look checks, reaction latency, safe curb pauses, jaywalking tendencies, and critical decision sequences.',
    engine: 'Telemetry Stream Engine',
    metric: 'Sub-second Behavioral Capture',
    icon: <Eye className="w-6 h-6 text-amber-400" />,
    visualState: {
      accentColor: '#F59E0B',
      hudLabel: 'TELEMETRY_INGESTION_STREAM',
      codeSnippet: `{\n  "event": "road_entry",\n  "safe": true,\n  "reaction_time": 1.15,\n  "look_checks": 2,\n  "signal_obedient": true\n}`,
      systemOutput: 'TELEMETRY LOGGED: 0 Safety Violations | 94% Path Accuracy',
    },
  },
  {
    number: '05',
    title: 'Dynamic Difficulty Recalibration',
    tag: 'ADAPT',
    description:
      'A second Random Forest Classifier evaluates scored telemetry to predict the next optimal challenge level (Easy, Medium, Hard), dynamically generating a personalized next scenario.',
    engine: 'Difficulty Random Forest ML',
    metric: 'Continuous Closed-Loop Adaptation',
    icon: <Sliders className="w-6 h-6 text-rose-400" />,
    visualState: {
      accentColor: '#F43F5E',
      hudLabel: 'DIFFICULTY_RECALIBRATION_LOOP',
      codeSnippet: `predict_difficulty({\n  "accuracy": 94,\n  "safety": 100,\n  "reaction_avg": 1.15,\n  "current_diff": "Easy"\n})`,
      systemOutput: 'RECALIBRATION RESULT: Next Scenario -> "Medium" (Multi-lane)',
    },
  },
];

export const AdaptiveJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const current = steps[activeStep];

  return (
    <section id="how-it-adapts" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          The 5-Stage Adaptive Methodology
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          How GameLearn Understands & Adapts
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Explore the five sequential stages transforming raw learner instinct into an evolving 3D simulation challenge.
        </p>
      </div>

      {/* Progress Stepper Bar: 01 ━━━ 02 ━━━ 03 ━━━ 04 ━━━ 05 */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`group flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300 text-center ${
                  isActive
                    ? 'bg-slate-900 border border-indigo-500/50 shadow-glow-indigo'
                    : 'bg-slate-950/40 border border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isActive
                        ? 'text-cyan-400'
                        : isCompleted
                        ? 'text-indigo-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.number}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-mono tracking-wider uppercase font-semibold hidden sm:inline ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {step.tag}
                </span>
                {/* Horizontal active bar indicator */}
                <div
                  className={`w-full h-1 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                      : isCompleted
                      ? 'bg-indigo-600/60'
                      : 'bg-slate-800'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage Stage Viewer */}
      <div className="max-w-5xl mx-auto hud-panel-glow p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        
        {/* Navigation Controls Floating Buttons */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">
              {current.number}
            </span>
            <div className="h-6 w-[1px] bg-white/10" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              STAGE: <span className="text-white font-bold">{current.tag}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-300 transition"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextStep}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-300 transition"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Narrative Explanation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10">
                {current.icon}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                  {current.title}
                </h3>
                <p className="text-xs font-mono text-cyan-400">{current.engine}</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {current.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Architecture Spec</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {current.metric}
              </span>
            </div>
          </div>

          {/* Right: Technical HUD Simulation Matrix Visualizer */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl p-4 bg-slate-950/90 border border-white/10 font-mono space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/5 pb-2">
                <span className="text-cyan-400 font-semibold">{current.visualState.hudLabel}</span>
                <span>STATUS: 200 OK</span>
              </div>

              <pre className="text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl overflow-x-auto leading-relaxed border border-white/5">
                <code>{current.visualState.codeSnippet}</code>
              </pre>

              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{current.visualState.systemOutput}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
