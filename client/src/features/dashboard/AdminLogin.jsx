import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import { ShieldCheck, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const { login, isAuthenticated, authLoading, authError } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center bg-brand-light dark:bg-brand-dark px-6 py-12">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-brand-darkCard border border-slate-200/60 dark:border-brand-darkBorder p-8 md:p-10 rounded-3xl shadow-sm z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-3 bg-orange-500/10 text-brand-orange rounded-full mb-4 border border-orange-500/20">
            <ShieldAlert size={26} />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white mb-2">
            Admin Console Access
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs">
            Authenticate to manage careers, applicants, blogs, and inquiries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@castack.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
              />
              <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Security Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
              />
              <Lock size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white py-3.5 rounded-xl font-bold transition-all duration-200 cursor-none shadow-lg shadow-brand-orange/15 hover:scale-[1.02] disabled:opacity-50 mt-2 text-xs uppercase tracking-wider"
          >
            {authLoading ? 'Verifying Credentials...' : 'Authenticate Access'} <ArrowRight size={14} />
          </button>

          {authError && (
            <div className="p-3.5 border border-red-500/20 bg-red-500/10 text-red-500 text-xs rounded-xl text-center font-bold">
              {authError}
            </div>
          )}

          {/* Prompt default credentials for testing (very helpful!) */}
          <div className="mt-4 p-4 rounded-xl border border-slate-100 dark:border-brand-darkBorder/40 bg-slate-50/30 dark:bg-brand-darkBorder/10 text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
            <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">Standard Demonstration Credentials:</p>
            <p className="font-mono">Email: admin@castack.com</p>
            <p className="font-mono">Password: CastackAdminSecure2026!</p>
          </div>
        </form>
      </div>
    </div>
  );
}
