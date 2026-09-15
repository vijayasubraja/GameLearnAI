import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, User as UserIcon, LogOut, ArrowRight, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050811]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow-indigo">
              <div className="w-full h-full bg-[#050811] rounded-xl flex items-center justify-center transition group-hover:bg-opacity-80">
                <Gamepad2 className="w-4 h-4 text-cyan-400 transition transform group-hover:scale-110" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                GameLearn <span className="text-cyan-400 font-extrabold">AI</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Adaptive 3D System
              </span>
            </div>
          </Link>

          {/* Minimal Section Links (Only shown on Landing Page) */}
          {isLandingPage && (
            <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
              <a href="#how-it-adapts" className="hover:text-cyan-400 transition">
                HOW IT ADAPTS
              </a>
              <a href="#adaptive-loop" className="hover:text-cyan-400 transition">
                FEEDBACK LOOP
              </a>
              <a href="#simulations" className="hover:text-cyan-400 transition">
                SIMULATION
              </a>
              <a href="#skills" className="hover:text-cyan-400 transition">
                SKILL WORLDS
              </a>
            </div>
          )}

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>DASHBOARD</span>
                </Link>

                <div className="h-4 w-[1px] bg-white/10" />

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-slate-300">
                    <UserIcon className="w-3 h-3 text-cyan-400" />
                    <span>{user.username}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>LOGOUT</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="text-xs font-mono font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-3.5 py-2 rounded-xl shadow-glow-indigo transition transform hover:scale-[1.02]"
                >
                  <span>START LEARNING</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
