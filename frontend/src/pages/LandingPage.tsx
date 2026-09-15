import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameLearnWorld } from '../components/landing/GameLearnWorld';
import { LandingNavigation } from '../components/landing/LandingNavigation';
import { ObjectHUD } from '../components/landing/ObjectHUD';
import { AboutTerminal } from '../components/landing/AboutTerminal';
import { AccessibleFallbackView } from '../components/landing/AccessibleFallbackView';
import { ArrowRight, Compass, Sparkles, Move3d } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [is2DView, setIs2DView] = useState(false);

  const handleSelectZone = (zoneKey: string) => {
    setSelectedNode(null);
    setSelectedZone((prev) => (prev === zoneKey ? null : zoneKey));
  };

  const handleSelectNode = (nodeKey: string) => {
    setSelectedZone(null);
    setSelectedNode((prev) => (prev === nodeKey ? null : nodeKey));
  };

  const handleResetView = () => {
    setSelectedZone(null);
    setSelectedNode(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050811] text-slate-100 select-none font-sans">
      
      {/* 1. Master 3D WebGL Simulation World or Accessible 2D View */}
      {!is2DView ? (
        <GameLearnWorld
          selectedZone={selectedZone}
          onSelectZone={handleSelectZone}
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
        />
      ) : (
        <AccessibleFallbackView
          selectedZone={selectedZone}
          selectedNode={selectedNode}
          onSelectZone={handleSelectZone}
          onSelectNode={handleSelectNode}
        />
      )}

      {/* 2. Minimal HUD Top Navigation */}
      <LandingNavigation
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenFeatures={() => handleSelectNode('assess')}
        onOpenSimulations={() => handleSelectZone('road_safety')}
        onResetView={handleResetView}
        is2DView={is2DView}
        onToggle2DView={() => setIs2DView(!is2DView)}
      />

      {/* 3. Bottom-Left Futuristic Hero Vision Card */}
      <section
        aria-label="Welcome and Overview"
        className="absolute bottom-6 left-6 z-20 max-w-sm pointer-events-auto hidden sm:block animate-in fade-in slide-in-from-left-4 duration-300"
      >
        <div className="hud-panel-glow p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            3D ADAPTIVE WORLD
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              GAMELEARN
            </h1>
            <p className="text-sm font-semibold text-cyan-300 leading-snug">
              Learn real-life skills by experiencing them.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Adaptive simulations that change with the way you learn.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono uppercase font-bold tracking-wider text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-glow-indigo transition transform hover:scale-[1.01]"
            >
              <span>START LEARNING →</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetView}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 transition"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>EXPLORE GAMELEARN</span>
            </button>
          </div>

        </div>
      </section>

      {/* 4. Center-Bottom Controls Tip Bar */}
      {!selectedZone && !selectedNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-[11px] font-mono text-slate-400 backdrop-blur-md">
          <Move3d className="w-3.5 h-3.5 text-cyan-400" />
          <span>DRAG TO ROTATE // SCROLL TO ZOOM // CLICK OBJECTS TO DISCOVER</span>
        </div>
      )}

      {/* 5. Object HUD Overlay (Triggered when Zone or Node is selected) */}
      <ObjectHUD
        selectedZone={selectedZone}
        selectedNode={selectedNode}
        onClose={handleResetView}
      />

      {/* 6. About GameLearn Terminal Dialog */}
      <AboutTerminal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

    </div>
  );
};
