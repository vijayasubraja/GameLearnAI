import React from 'react';
import { MapPin, Sparkles, Gamepad2 } from 'lucide-react';
import { WORLD_LOCATIONS } from '../world/worldConfig';

interface FallbackViewProps {
  selectedZone: string | null;
  onSelectZone: (zoneKey: string) => void;
}

/** Keyboard-accessible 2D map view of the GameLearn world. */
export const AccessibleFallbackView: React.FC<FallbackViewProps> = ({ selectedZone, onSelectZone }) => {
  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-b from-[#BFE7FF] to-[#CFF3C3]">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#FF5D73] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          GameLearn town — map view
        </div>
        <h1 className="mt-3 font-display text-3xl font-black text-slate-800">
          Your learning adventure starts here.
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Pick a place in town to start a real-life challenge. Every building opens an interactive
          simulation.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {WORLD_LOCATIONS.map((loc) => {
            const isSelected = selectedZone === loc.key;
            return (
              <button
                key={loc.key}
                onClick={() => onSelectZone(loc.key)}
                aria-pressed={isSelected}
                className={`flex items-start gap-3 rounded-3xl border-2 bg-white/90 p-4 text-left shadow-lg transition hover:-translate-y-0.5 ${
                  isSelected ? 'ring-4' : 'border-white/70'
                }`}
                style={{ ['--tw-ring-color' as string]: `${loc.accent}66`, borderColor: isSelected ? loc.accent : undefined }}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                  style={{ background: loc.accent }}
                >
                  <MapPin className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-sm font-black text-slate-800">{loc.name}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">{loc.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600">
          <Gamepad2 className="h-4 w-4 text-[#7C6CE8]" />
          Tip: switch to the 3D view to walk around town from above.
        </p>
      </div>
    </div>
  );
};