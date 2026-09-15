import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface SimulationAction {
  id: string;
  name: string;
  userAction: string;
  telemetryEvent: {
    event: string;
    safe: boolean;
    reaction_time: string;
    infraction_count: number;
    crosswalk_alignment: string;
  };
  scoringBreakdown: {
    accuracy: number;
    safety: number;
    decision: number;
    reaction: number;
    total: number;
  };
  difficultyPrediction: {
    current: 'Easy' | 'Medium' | 'Hard';
    predicted: 'Easy' | 'Medium' | 'Hard';
    reason: string;
  };
}

const simulationActions: SimulationAction[] = [
  {
    id: 'safe_patient',
    name: 'Action A: Patient Safe Crossing',
    userAction: 'Learner stopped at curb, activated pedestrian signal, looked both directions, and waited for vehicles to halt completely.',
    telemetryEvent: {
      event: 'road_entry_signal_green',
      safe: true,
      reaction_time: '1.2s',
      infraction_count: 0,
      crosswalk_alignment: '98%',
    },
    scoringBreakdown: {
      accuracy: 96,
      safety: 100,
      decision: 95,
      reaction: 90,
      total: 96,
    },
    difficultyPrediction: {
      current: 'Easy',
      predicted: 'Medium',
      reason: 'Learner demonstrated flawless safety instincts and high crossing precision. Challenge escalated to 2-lane traffic.',
    },
  },
  {
    id: 'rushed_jaywalk',
    name: 'Action B: Rushed Crossing (Violation)',
    userAction: 'Learner stepped into lane while signal was red, did not perform a left-right camera look scan, and crossed diagonally outside markings.',
    telemetryEvent: {
      event: 'jaywalk_safety_violation',
      safe: false,
      reaction_time: '0.4s',
      infraction_count: 2,
      crosswalk_alignment: '45%',
    },
    scoringBreakdown: {
      accuracy: 45,
      safety: 20,
      decision: 30,
      reaction: 60,
      total: 38,
    },
    difficultyPrediction: {
      current: 'Easy',
      predicted: 'Easy',
      reason: 'Critical safety violations detected. Difficulty maintained at Easy with added visual and audio guidance cues.',
    },
  },
  {
    id: 'hesitant_delay',
    name: 'Action C: Hesitant / Timid Crossing',
    userAction: 'Learner pressed button but hesitated at the curb for 9 seconds after green signal, stepping off as the pedestrian timer expired.',
    telemetryEvent: {
      event: 'delayed_curb_departure',
      safe: true,
      reaction_time: '9.4s',
      infraction_count: 1,
      crosswalk_alignment: '90%',
    },
    scoringBreakdown: {
      accuracy: 85,
      safety: 70,
      decision: 65,
      reaction: 40,
      total: 68,
    },
    difficultyPrediction: {
      current: 'Medium',
      predicted: 'Medium',
      reason: 'High safety awareness but excessive reaction latency. Scenario repeated with targeted timing prompts.',
    },
  },
];

export const BehaviourVisualization: React.FC = () => {
  const [selectedActionId, setSelectedActionId] = useState('safe_patient');

  const action = simulationActions.find((a) => a.id === selectedActionId)!;

  return (
    <section id="behaviour-intelligence" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5" />
          Actions Become Intelligence
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          How Simulation Behaviour Powers the AI
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Select a sample learner action below to watch raw physical simulation movement turn into telemetry, multi-factor scoring, and Random Forest adaptation.
        </p>
      </div>

      {/* Action Switcher Buttons */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {simulationActions.map((item) => {
            const isSelected = item.id === selectedActionId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedActionId(item.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-300 border ${
                  isSelected
                    ? 'bg-slate-900 border-rose-500/50 shadow-glow-indigo scale-[1.02]'
                    : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-white">
                    {item.name.split(':')[0]}
                  </span>
                  {item.telemetryEvent.safe ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {item.name.split(': ')[1]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* The 4-Stage Behaviour Telemetry Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        
        {/* Step 1: User Action in Simulation */}
        <div className="hud-panel p-5 rounded-3xl flex flex-col justify-between border-t-2 border-t-indigo-500">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400">
              <span>STAGE 01</span>
              <span>3D SIMULATION</span>
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Physical Action
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {action.userAction}
            </p>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 text-[10px] font-mono text-slate-500">
            Source: WebGL Player Controller
          </div>
        </div>

        {/* Step 2: Ingested Behaviour Telemetry */}
        <div className="hud-panel p-5 rounded-3xl flex flex-col justify-between border-t-2 border-t-cyan-500">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
              <span>STAGE 02</span>
              <span>TELEMETRY</span>
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Raw Telemetry Event
            </h4>
            <pre className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-xl overflow-x-auto leading-tight border border-white/5">
              <code>{`{\n  "event": "${action.telemetryEvent.event}",\n  "safe": ${action.telemetryEvent.safe},\n  "latency": "${action.telemetryEvent.reaction_time}",\n  "violations": ${action.telemetryEvent.infraction_count}\n}`}</code>
            </pre>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 text-[10px] font-mono text-slate-500">
            Payload: High-frequency JSON
          </div>
        </div>

        {/* Step 3: Transparent Performance Score */}
        <div className="hud-panel p-5 rounded-3xl flex flex-col justify-between border-t-2 border-t-purple-500">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-purple-400">
              <span>STAGE 03</span>
              <span>EVALUATION</span>
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              3. Scored Performance
            </h4>
            
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Accuracy (30%):</span>
                <span className="text-white font-bold">{action.scoringBreakdown.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safety (25%):</span>
                <span className="text-white font-bold">{action.scoringBreakdown.safety}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reaction (10%):</span>
                <span className="text-white font-bold">{action.scoringBreakdown.reaction}%</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-emerald-400 font-bold">
                <span>TOTAL SCORE:</span>
                <span>{action.scoringBreakdown.total} / 100</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 text-[10px] font-mono text-slate-500">
            Weighted Performance Engine
          </div>
        </div>

        {/* Step 4: Difficulty Random Forest ML */}
        <div className="hud-panel p-5 rounded-3xl flex flex-col justify-between border-t-2 border-t-emerald-500">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span>STAGE 04</span>
              <span>ADAPTIVE ML</span>
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              4. Next Difficulty
            </h4>
            
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Current: {action.difficultyPrediction.current}</span>
                <span className="text-emerald-400 font-bold">
                  Next: {action.difficultyPrediction.predicted}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug pt-1">
                {action.difficultyPrediction.reason}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4 text-[10px] font-mono text-slate-500">
            Random Forest Classifier v1
          </div>
        </div>

      </div>
    </section>
  );
};
