import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';

interface ObjectHUDProps {
  selectedZone: string | null;
  selectedNode: string | null;
  onClose: () => void;
}

const ZONE_DETAILS: Record<
  string,
  {
    title: string;
    category: string;
    description: string;
    simulatedDecisions: string[];
    difficulty: string;
    hudCode: string;
    accentColor: string;
  }
> = {
  road_safety: {
    title: 'Road & Pedestrian Safety',
    category: 'PHYSICAL ENVIRONMENT',
    description: 'Practice real-world crossing decisions, signal obedience, and traffic gap anticipation in 3D.',
    simulatedDecisions: ['Curb pause', 'Look left/right scan', 'Push-button activation', 'Zebra alignment'],
    difficulty: 'Adaptive (Easy / Medium / Hard)',
    hudCode: 'SIM_ZONE_01 // ROAD_SAFETY',
    accentColor: '#06B6D4',
  },
  transport: {
    title: 'Public Transportation',
    category: 'URBAN NAVIGATION',
    description: 'Navigate bus routes, subway platform connections, ticket validators, and schedule delays.',
    simulatedDecisions: ['Route map verification', 'Ticket scanning', 'Schedule timing', 'Platform identification'],
    difficulty: 'Adaptive (Easy / Medium / Hard)',
    hudCode: 'SIM_ZONE_02 // TRANSIT',
    accentColor: '#818CF8',
  },
  money: {
    title: 'Money Management',
    category: 'FINANCIAL DECISIONS',
    description: 'Build better everyday financial decisions balancing essential costs and savings buffers.',
    simulatedDecisions: ['Need vs. Want allocation', 'Emergency fund buffer', 'Bill prioritization'],
    difficulty: 'Adaptive (Easy / Medium / Hard)',
    hudCode: 'SIM_ZONE_03 // CAPITAL',
    accentColor: '#10B981',
  },
  shopping: {
    title: 'Shopping & Transactions',
    category: 'PRACTICAL COMMERCE',
    description: 'Master unit price comparisons, supermarket cart navigation, and receipt error detection.',
    simulatedDecisions: ['Unit cost comparison', 'Discount evaluation', 'Receipt verification'],
    difficulty: 'Adaptive (Easy / Medium / Hard)',
    hudCode: 'SIM_ZONE_04 // COMMERCE',
    accentColor: '#F59E0B',
  },
  communication: {
    title: 'Communication & Social',
    category: 'INTERPERSONAL SKILLS',
    description: 'Navigate social encounters, practice respectful assertiveness, and de-escalate tension.',
    simulatedDecisions: ['Tone selection', 'Active listening', 'Respectful boundary setting'],
    difficulty: 'Adaptive (Easy / Medium / Hard)',
    hudCode: 'SIM_ZONE_05 // DIALOGUE',
    accentColor: '#EC4899',
  },
  workplace: {
    title: 'Workplace Skills',
    category: 'CAREER COMPETENCE',
    description: 'Prioritize changing work tasks, write professional emails, and collaborate under deadlines.',
    simulatedDecisions: ['Urgency triage', 'Professional drafting', 'Meeting conduct'],
    difficulty: 'Adaptive (Easy / Medium / Hard)',
    hudCode: 'SIM_ZONE_06 // WORKPLACE',
    accentColor: '#8B5CF6',
  },
  emergency: {
    title: 'Emergency & Safety',
    category: 'CRITICAL RESPONSE',
    description: 'React decisively during emergency alarms, find safety exits, and contact first responders.',
    simulatedDecisions: ['Exit identification', 'Extinguisher selection', 'Dispatcher communication'],
    difficulty: 'Adaptive (Easy / Medium / Hard)',
    hudCode: 'SIM_ZONE_07 // EMERGENCY',
    accentColor: '#F43F5E',
  },
};

const NODE_DETAILS: Record<
  string,
  {
    title: string;
    category: string;
    description: string;
    role: string;
  }
> = {
  hub: {
    title: 'GameLearn Adaptive Intelligence Hub',
    category: 'SYSTEM CORE',
    description: 'The central orchestration engine connecting learner profiling, 3D WebGL simulations, telemetry streaming, and continuous difficulty adaptation.',
    role: 'Central AI Coordinator',
  },
  assess: {
    title: '1. ASSESS',
    category: 'PROFILING',
    description: 'Understand where you start. Captures baseline experience, confidence, and instinct through situational dilemmas.',
    role: 'Input Feature Vectorizer',
  },
  predict: {
    title: '2. PREDICT',
    category: 'SKILL CLASSIFICATION',
    description: 'Estimate your skill level. Random Forest classifies per-skill capability into Beginner, Intermediate, or Advanced.',
    role: 'Random Forest Skill Model',
  },
  simulate: {
    title: '3. SIMULATE',
    category: '3D EXECUTION',
    description: 'Practice through realistic scenarios. Browser-based 3D environment with physics and interactive objects.',
    role: 'React Three Fiber Engine',
  },
  observe: {
    title: '4. OBSERVE',
    category: 'TELEMETRY TRACKING',
    description: 'Track decisions and behaviour. Ingests millisecond-accurate road scanning, latency, and mistake telemetry.',
    role: 'Telemetry Ingestion Stream',
  },
  adapt: {
    title: '5. ADAPT',
    category: 'DIFFICULTY RECALIBRATION',
    description: 'Adjust the next challenge. Difficulty Random Forest predicts next optimal scenario challenge level.',
    role: 'Difficulty Random Forest ML',
  },
};

export const ObjectHUD: React.FC<ObjectHUDProps> = ({ selectedZone, selectedNode, onClose }) => {
  const navigate = useNavigate();

  if (!selectedZone && !selectedNode) return null;

  const zoneData = selectedZone ? ZONE_DETAILS[selectedZone] : null;
  const nodeData = selectedNode ? NODE_DETAILS[selectedNode] : null;

  return (
    <aside
      aria-label="Object Inspection HUD"
      className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 w-[92%] sm:w-[380px] z-30 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="hud-panel-glow p-5 rounded-2xl border border-white/10 shadow-2xl relative">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {zoneData?.hudCode || nodeData?.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-3 space-y-3">
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              {zoneData?.title || nodeData?.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {zoneData?.description || nodeData?.description}
            </p>
          </div>

          {/* Zone Specific Decisions */}
          {zoneData && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                Simulated Decisions:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                {zoneData.simulatedDecisions.map((dec, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-white/5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{dec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Node Specific Role */}
          {nodeData && (
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">ARCHITECTURAL ROLE:</span>
              <span className="text-emerald-400 font-bold">{nodeData.role}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono uppercase font-bold tracking-wider text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-glow-indigo transition transform hover:scale-[1.01]"
          >
            <span>START LEARNING →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
