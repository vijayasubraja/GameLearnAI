import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Sun, Map, Play, UserRound, Compass, Gamepad2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { profileService } from '../../services/profileService';

interface GameHudProps {
  selected: boolean;
  onResetView: () => void;
  is2DView: boolean;
  onToggle2DView: () => void;
}

export const GAMELEARN_LOGO_GRADIENT = 'from-[#FF9A3D] via-[#FF5D73] to-[#A465F0]';

/** Compact game-style HUD overlaying the 3D world. */
export const GameHud: React.FC<GameHudProps> = ({ selected, onResetView, is2DView, onToggle2DView }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dashboard } = useApi(() => profileService.getDashboard(), {
    immediate: Boolean(user),
  });

  const startLearning = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    const recommended = dashboard?.recommended_scenario;
    navigate(recommended ? `/scenarios/${recommended.id}` : '/scenarios');
  };

  const displayName = user?.full_name || user?.username || 'Player';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-40 p-3 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <button
            onClick={onResetView}
            className="group flex items-center gap-2.5 rounded-2xl border border-white/40 bg-white/85 px-3 py-1.5 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            aria-label="Back to GameLearn town"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9A3D] via-[#FF5D73] to-[#A465F0] text-white shadow-inner">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span className="text-left leading-none">
              <span className="block font-display text-sm font-black tracking-tight text-slate-800">GAMELEARN</span>
              <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Learning adventure
              </span>
            </span>
          </button>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user && dashboard ? (
              <>
                {dashboard.learning_streak_days > 0 && (
                  <span className="hidden items-center gap-1 rounded-full border border-white/40 bg-white/85 px-2.5 py-1.5 text-xs font-bold text-orange-600 shadow backdrop-blur sm:flex">
                    <Flame className="h-3.5 w-3.5" />
                    {dashboard.learning_streak_days} day streak
                  </span>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-1.5 rounded-2xl border border-white/40 bg-white/85 px-2.5 py-1.5 shadow backdrop-blur transition hover:bg-white"
                  aria-label="Open your profile"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9A3D] to-[#A465F0] text-[11px] font-black text-white">
                    {initials}
                  </span>
                  <UserRound className="hidden h-4 w-4 text-slate-600 sm:block" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden items-center gap-1.5 rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow backdrop-blur transition hover:bg-white sm:flex"
              >
                <UserRound className="h-4 w-4" />
                <span>Log in</span>
              </button>
            )}

            <button
              onClick={startLearning}
              className="ml-1 flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#FF9A3D] via-[#FF5D73] to-[#A465F0] px-3.5 py-2 text-xs font-black tracking-wide text-white shadow-lg shadow-orange-400/30 transition hover:-translate-y-0.5 hover:brightness-105 sm:px-4"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>PLAY {user ? '' : '/ START'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Welcome panel (hidden when a location is selected) */}
      {!selected && (
        <section
          aria-label="Welcome"
          className="absolute bottom-4 left-3 z-30 max-w-xs sm:bottom-8 sm:left-6"
        >
          <div className="rounded-3xl border border-white/40 bg-white/90 p-4 shadow-2xl backdrop-blur sm:p-5">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-[#FF9A3D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#FF5D73]">Welcome</span>
            </div>
            <h1 className="mt-1.5 font-display text-xl font-black leading-tight text-slate-800 sm:text-2xl">
              Your learning adventure starts here.
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
              Explore the world, complete challenges, and build real-life skills — one game at a time.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={startLearning}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-[#FF9A3D] via-[#FF5D73] to-[#A465F0] px-4 py-2 text-xs font-black tracking-wide text-white shadow-lg shadow-orange-400/25 transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                PLAY / START LEARNING
              </button>
              <button
                onClick={onResetView}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <Compass className="h-3.5 w-3.5" />
                EXPLORE WORLD
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hint pill */}
      {!selected && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/40 bg-white/80 px-4 py-1.5 text-[11px] font-semibold text-slate-600 shadow backdrop-blur lg:flex">
          <span className="rounded-full bg-[#FF9A3D] px-1.5 py-0.5 text-[9px] font-black text-white">DRAG</span>
          explore · <span className="rounded-full bg-[#FF5D73] px-1.5 py-0.5 text-[9px] font-black text-white">SCROLL</span>
          zoom · <span className="rounded-full bg-[#A465F0] px-1.5 py-0.5 text-[9px] font-black text-white">TAP</span> a
          building to start
        </div>
      )}

      {/* 2D / 3D toggle */}
      <button
        onClick={onToggle2DView}
        className="absolute bottom-4 right-3 z-30 flex items-center gap-1.5 rounded-2xl border border-white/40 bg-white/85 px-3 py-2 text-xs font-bold text-slate-600 shadow backdrop-blur transition hover:bg-white sm:bottom-8 sm:right-6"
        aria-label={is2DView ? 'Show 3D world' : 'Show 2D map'}
      >
        <Map className="h-4 w-4 text-[#7C6CE8]" />
        <span>{is2DView ? '3D VIEW' : '2D MAP'}</span>
      </button>
    </>
  );
};