import React from 'react';
import { ZONE_CONFIGS } from './GameLearnWorld';
import {
  Car,
  Bus,
  Coins,
  ShoppingCart,
  MessageSquare,
  Briefcase,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

interface FallbackViewProps {
  onSelectZone: (zoneKey: string) => void;
  onSelectNode: (nodeKey: string) => void;
  selectedZone: string | null;
  selectedNode: string | null;
}

const ZONE_ICONS: Record<string, React.ReactNode> = {
  road_safety: <Car className="w-5 h-5 text-cyan-400" />,
  transport: <Bus className="w-5 h-5 text-indigo-400" />,
  money: <Coins className="w-5 h-5 text-emerald-400" />,
  shopping: <ShoppingCart className="w-5 h-5 text-amber-400" />,
  communication: <MessageSquare className="w-5 h-5 text-pink-400" />,
  workplace: <Briefcase className="w-5 h-5 text-purple-400" />,
  emergency: <AlertOctagon className="w-5 h-5 text-rose-400" />,
};

const ADAPTIVE_NODES = [
  { key: 'assess', label: '1. ASSESS', desc: 'Understand where you start' },
  { key: 'predict', label: '2. PREDICT', desc: 'Estimate your skill level' },
  { key: 'simulate', label: '3. SIMULATE', desc: 'Practice in 3D scenarios' },
  { key: 'observe', label: '4. OBSERVE', desc: 'Track decisions & telemetry' },
  { key: 'adapt', label: '5. ADAPT', desc: 'Adjust the next challenge' },
];

export const AccessibleFallbackView: React.FC<FallbackViewProps> = ({
  onSelectZone,
  onSelectNode,
  selectedZone,
  selectedNode,
}) => {
  return (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-6 bg-slate-950/90 overflow-y-auto">
      <div className="max-w-4xl w-full space-y-8 my-auto pt-20 pb-24 text-center">
        
        {/* Central Hub Node */}
        <div className="space-y-3">
          <button
            onClick={() => onSelectNode('hub')}
            className={`p-6 rounded-3xl mx-auto block transition-all max-w-md ${
              selectedNode === 'hub'
                ? 'bg-indigo-950/80 border-2 border-cyan-400 shadow-glow-cyan'
                : 'hud-panel-glow hover:border-cyan-400/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>CENTRAL LEARNING HUB</span>
            </div>
            <h2 className="text-2xl font-display font-black text-white">GAMELEARN CORE</h2>
            <p className="text-xs text-slate-300 mt-1">
              Adaptive intelligence coordinating real-life skill simulations
            </p>
          </button>
        </div>

        {/* 5-Step Adaptive Core */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-3xl mx-auto">
          {ADAPTIVE_NODES.map((n) => (
            <button
              key={n.key}
              onClick={() => onSelectNode(n.key)}
              className={`p-3 rounded-2xl text-left border transition ${
                selectedNode === n.key
                  ? 'bg-slate-900 border-cyan-400 text-white'
                  : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <p className="text-[10px] font-mono text-cyan-400 font-bold">{n.label}</p>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{n.desc}</p>
            </button>
          ))}
        </div>

        {/* 7 Skill Zones */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Interactive Skill Zones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {ZONE_CONFIGS.map((z) => (
              <button
                key={z.key}
                onClick={() => onSelectZone(z.key)}
                className={`p-4 rounded-2xl text-left border transition flex items-center gap-3 ${
                  selectedZone === z.key
                    ? 'bg-slate-900 border-indigo-400 shadow-glow-indigo text-white'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-950 border border-white/5">
                  {ZONE_ICONS[z.key]}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{z.name}</p>
                  <p className="text-[10px] font-mono text-slate-400">{z.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
