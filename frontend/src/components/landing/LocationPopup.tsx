import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { WorldLocation } from '../world/worldConfig';

interface LocationPopupProps {
  location: WorldLocation;
  onClose: () => void;
}

/** Compact game-style detail card for a learning location. */
export const LocationPopup: React.FC<LocationPopupProps> = ({ location, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const enterSimulation = () => {
    if (user) {
      navigate(`/scenarios?skill=${location.key}`);
    } else {
      navigate('/login', { state: { from: { pathname: '/' } } });
    }
  };

  return (
    <section
      aria-label={`${location.name} details`}
      className="absolute bottom-4 left-3 z-30 w-[calc(100%-1.5rem)] max-w-sm animate-slide-up sm:bottom-8 sm:left-6"
    >
      <div className="rounded-3xl border-2 bg-white/95 p-4 shadow-2xl backdrop-blur sm:p-5" style={{ borderColor: location.accent }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${location.accent}22` }}>
              <MapPin className="h-5 w-5" style={{ color: location.accent }} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: location.accent }}>
                {location.short} location
              </p>
              <h2 className="font-display text-lg font-black leading-tight text-slate-800">{location.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close location details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{location.blurb}</p>

        <button
          onClick={enterSimulation}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-black tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
          style={{ background: `linear-gradient(120deg, ${location.accent}, ${location.accent}CC)` }}
        >
          <Play className="h-4 w-4 fill-current" />
          {user ? 'ENTER SIMULATION' : 'ENTER — SIGN IN TO PLAY'}
        </button>
      </div>
    </section>
  );
};