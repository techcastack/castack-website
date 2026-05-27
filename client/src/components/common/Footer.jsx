import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import { ArrowRight, Mail, Phone, MapPin, Send, Github, Twitter, Linkedin } from 'lucide-react';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';
import api from '../../services/api.js';

export default function Footer() {
  const { darkMode } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatusMsg('');
    try {
      const response = await api.post('/newsletter/subscribe', { email });
      setIsSuccess(true);
      setStatusMsg(response.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err) {
      setIsSuccess(false);
      setStatusMsg(err.message || 'Failed to subscribe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-brand-darkBorder/10 border-t border-slate-200 dark:border-brand-darkBorder/60 pt-20 pb-10 overflow-hidden">
      
      {/* Decorative vector background */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMN 1: BRAND SUMMARY */}
          <div className="flex flex-col gap-6">
            <img 
              src={darkMode ? logoLight : logoDark} 
              alt="Castack Logo" 
              className="h-9 w-auto self-start object-contain"
            />
            <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed">
              World-class digital engineering and enterprise intelligence systems. We craft premium SaaS platforms, intelligent AI agent ecosystems, and high-performance cloud networks.
            </p>
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
              <a href="#" className="hover:text-brand-orange transition-colors cursor-none" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className="hover:text-brand-orange transition-colors cursor-none" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-brand-orange transition-colors cursor-none" aria-label="GitHub"><Github size={18} /></a>
            </div>
          </div>

          {/* COLUMN 2: SERVICES QUICKLINKS */}
          <div>
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-6">Expertise</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/services" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">AI & Agentic Workflows</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">Web Development (MERN)</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">Enterprise Architecture</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">Staff Augmentation</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: UTILITY NAVIGATION */}
          <div>
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-6">Company</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/about" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">Our Story</Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">Portfolio Case Studies</Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">Careers Portal</Link>
              </li>
              <li>
                <Link to="/ats" className="text-slate-500 hover:text-brand-orange dark:text-slate-400 dark:hover:text-brand-orange text-[14px] transition-colors cursor-none">ATS Resume Analyzer</Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-brand-orange dark:text-slate-600 dark:hover:text-brand-orange text-[12px] transition-colors cursor-none">Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER SIGNUP */}
          <div>
            <h4 className="text-[15px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 mb-6">Newsletter</h4>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed mb-4">
              Get our monthly digest on agentic AI, software engineering paradigms, and design guidelines.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 rounded-full border border-slate-200 dark:border-brand-darkBorder text-[13px] bg-white dark:bg-brand-dark text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-orange transition-colors cursor-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1 top-1 p-2 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white transition-colors duration-200 cursor-none flex items-center justify-center"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </form>
            {statusMsg && (
              <p className={`text-[12px] mt-2 font-medium ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {statusMsg}
              </p>
            )}
          </div>
        </div>

        <hr className="border-slate-200 dark:border-brand-darkBorder/40 mb-8" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-xs">
            © {new Date().getFullYear()} Castack Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-slate-400 hover:text-brand-orange dark:text-slate-500 dark:hover:text-brand-orange text-xs transition-colors cursor-none">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-brand-orange dark:text-slate-500 dark:hover:text-brand-orange text-xs transition-colors cursor-none">Terms of Service</Link>
            <Link to="/policy" className="text-slate-400 hover:text-brand-orange dark:text-slate-500 dark:hover:text-brand-orange text-xs transition-colors cursor-none">Careers Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
