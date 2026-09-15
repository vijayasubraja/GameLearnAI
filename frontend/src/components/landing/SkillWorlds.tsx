import React, { useState } from 'react';
import {
  Car,
  Bus,
  Coins,
  ShoppingCart,
  MessageSquare,
  Briefcase,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SkillWorld {
  id: string;
  title: string;
  category: string;
  difficultyLevels: string[];
  missionObjective: string;
  simulatedDecisions: string[];
  hudCode: string;
  accentColor: string;
  icon: React.ReactNode;
}

const skillWorlds: SkillWorld[] = [
  {
    id: 'road_safety',
    title: 'Road & Pedestrian Safety',
    category: 'PHYSICAL ENVIRONMENT',
    difficultyLevels: ['Easy (Crosswalk)', 'Medium (Multi-lane)', 'Hard (Rain & Siren)'],
    missionObjective: 'Safely navigate busy urban crosswalks, observe vehicle gaps, and obey dynamic pedestrian signals.',
    simulatedDecisions: ['Curb pause', 'Left/Right look checks', 'Signal push activation', 'Zebra alignment'],
    hudCode: 'WORLD_01 // ROAD_SAFETY',
    accentColor: '#06B6D4',
    icon: <Car className="w-6 h-6 text-cyan-400" />,
  },
  {
    id: 'public_transport',
    title: 'Public Transportation',
    category: 'URBAN NAVIGATION',
    difficultyLevels: ['Easy (Bus Stop)', 'Medium (Metro Transfer)', 'Hard (Delayed Route)'],
    missionObjective: 'Locate the correct bus line or subway platform, validate tickets, and manage schedule delays in real-time.',
    simulatedDecisions: ['Route map reading', 'Platform verification', 'Ticket scanner interaction', 'Transfer timing'],
    hudCode: 'WORLD_02 // TRANSIT_HUB',
    accentColor: '#818CF8',
    icon: <Bus className="w-6 h-6 text-indigo-400" />,
  },
  {
    id: 'money_management',
    title: 'Money Management & Budgeting',
    category: 'FINANCIAL DECISIONS',
    difficultyLevels: ['Easy (Fixed Budget)', 'Medium (Surprise Expense)', 'Hard (Investment Risk)'],
    missionObjective: 'Allocate limited monthly funds between essential living costs, savings reserves, and impulse temptations.',
    simulatedDecisions: ['Necessity vs. Luxury tradeoff', 'Emergency buffer allocation', 'Bill payment prioritizing'],
    hudCode: 'WORLD_03 // CAPITAL_LAB',
    accentColor: '#10B981',
    icon: <Coins className="w-6 h-6 text-emerald-400" />,
  },
  {
    id: 'shopping_transactions',
    title: 'Shopping & Transactions',
    category: 'PRACTICAL COMMERCE',
    difficultyLevels: ['Easy (Item Scan)', 'Medium (Discounts & Unit Price)', 'Hard (Billing Error)'],
    missionObjective: 'Evaluate unit prices, navigate supermarket aisles, detect billing discrepancies, and verify transaction receipts.',
    simulatedDecisions: ['Unit cost comparison', 'Receipt discrepancy identification', 'Change calculation'],
    hudCode: 'WORLD_04 // COMMERCE_SIM',
    accentColor: '#F59E0B',
    icon: <ShoppingCart className="w-6 h-6 text-amber-400" />,
  },
  {
    id: 'communication',
    title: 'Communication & Social Interaction',
    category: 'INTERPERSONAL SKILLS',
    difficultyLevels: ['Easy (Polite Inquiry)', 'Medium (Assertive Boundary)', 'Hard (Conflict De-escalation)'],
    missionObjective: 'Navigate challenging social encounters, practice respectful assertiveness, and de-escalate workplace tensions.',
    simulatedDecisions: ['Tone and phrasing selection', 'Active listening verification', 'Boundary defense'],
    hudCode: 'WORLD_05 // DIALOGUE_SIM',
    accentColor: '#EC4899',
    icon: <MessageSquare className="w-6 h-6 text-pink-400" />,
  },
  {
    id: 'workplace_skills',
    title: 'Workplace & Professional Decisions',
    category: 'CAREER COMPETENCE',
    difficultyLevels: ['Easy (Task Prioritizing)', 'Medium (Meeting Protocol)', 'Hard (Deadline Crunch)'],
    missionObjective: 'Organize shifting project deadlines, respond to executive communications, and collaborate under time constraints.',
    simulatedDecisions: ['Urgency vs. Importance triage', 'Professional email drafting', 'Constructive feedback'],
    hudCode: 'WORLD_06 // WORKPLACE_OPS',
    accentColor: '#8B5CF6',
    icon: <Briefcase className="w-6 h-6 text-purple-400" />,
  },
  {
    id: 'emergency_safety',
    title: 'Emergency Decision Making',
    category: 'CRITICAL RESPONSE',
    difficultyLevels: ['Easy (Alarm Response)', 'Medium (Evacuation Route)', 'Hard (Smoke & Obstacle)'],
    missionObjective: 'React decisively during sudden building hazards, identify emergency exits, and contact first responders calmly.',
    simulatedDecisions: ['Exit signage identification', 'Fire extinguisher selection', 'Emergency dispatcher clarity'],
    hudCode: 'WORLD_07 // CRISIS_RESPONSE',
    accentColor: '#F43F5E',
    icon: <AlertOctagon className="w-6 h-6 text-rose-400" />,
  },
];

export const SkillWorlds: React.FC = () => {
  const [activeWorldIndex, setActiveWorldIndex] = useState(0);
  const navigate = useNavigate();

  const nextWorld = () => {
    setActiveWorldIndex((prev) => (prev + 1) % skillWorlds.length);
  };

  const prevWorld = () => {
    setActiveWorldIndex((prev) => (prev - 1 + skillWorlds.length) % skillWorlds.length);
  };

  const currentWorld = skillWorlds[activeWorldIndex];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/5">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          7 Real-Life Skill Worlds
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Explore Simulation Mission Domains
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          From street navigation to financial crisis management, each world offers tailored 3D scenarios calibrated to your assessed skill level.
        </p>
      </div>

      {/* World Carousel Selector Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {skillWorlds.map((world, idx) => {
          const isActive = idx === activeWorldIndex;
          return (
            <button
              key={world.id}
              onClick={() => setActiveWorldIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase font-bold tracking-wider shrink-0 transition flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white border border-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-950/60 text-slate-400 border border-white/5 hover:border-white/20'
              }`}
            >
              <span>{world.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main World Showcase Card */}
      <div className="hud-panel-glow p-6 sm:p-10 rounded-3xl max-w-5xl mx-auto relative overflow-hidden">
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/10">
              {currentWorld.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase font-semibold">
                {currentWorld.hudCode}
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {currentWorld.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevWorld}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 transition"
              aria-label="Previous world"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextWorld}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 transition"
              aria-label="Next world"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* World Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
          
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                Mission Objective
              </h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {currentWorld.missionObjective}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3">
                Decisions Tracked During Simulation
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentWorld.simulatedDecisions.map((dec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs font-mono text-slate-300 p-2.5 rounded-xl bg-slate-950/60 border border-white/5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{dec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3 font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Adaptive Difficulty Tiers Available:
              </span>
              <div className="space-y-2">
                {currentWorld.difficultyLevels.map((lvl, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300">{lvl}</span>
                    <span className="text-cyan-400 font-bold">ADAPTIVE</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/register')}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-mono uppercase font-bold tracking-wider text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-glow-indigo transition"
            >
              <span>ENTER {currentWorld.title.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
