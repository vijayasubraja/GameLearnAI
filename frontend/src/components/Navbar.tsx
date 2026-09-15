import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, User as UserIcon, LogOut, Sparkles, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow-indigo">
              <div className="w-full h-full bg-[#0B0F19] rounded-xl flex items-center justify-center transition group-hover:bg-opacity-80">
                <Gamepad2 className="w-5 h-5 text-cyan-400 transition transform group-hover:scale-110" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                GameLearn <span className="text-cyan-400 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold -mt-1">
                Adaptive 3D Learning
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  Dashboard
                </Link>

                <div className="h-5 w-[1px] bg-white/10" />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-white/10 text-xs font-medium text-slate-200">
                    <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{user.username}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg shadow-glow-indigo transition transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
