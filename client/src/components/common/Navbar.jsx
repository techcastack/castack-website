import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import { Sun, Moon, Menu, X, ArrowUpRight, ShieldAlert } from 'lucide-react';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

export default function Navbar() {
  const { darkMode, toggleDarkMode, isAuthenticated, logout } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Monitor scroll position to apply style shifts
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
    { name: 'ATS Scan', path: '/ats' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-white/70 dark:bg-brand-dark/70 shadow-lg shadow-brand-dark/5 backdrop-blur-xl border-b border-slate-200/40 dark:border-brand-darkBorder/40'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group cursor-none">
          <img 
            src={darkMode ? logoLight : logoDark} 
            alt="Castack Logo" 
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* DESKTOP NAV ITEMS */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium text-[15px] transition-colors duration-200 cursor-none relative py-1 ${
                  isActive 
                    ? 'text-brand-orange' 
                    : 'text-slate-600 hover:text-brand-orange dark:text-slate-300 dark:hover:text-brand-orange'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-orange rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-slate-200 dark:border-brand-darkBorder text-slate-600 dark:text-slate-300 hover:text-brand-orange dark:hover:text-brand-orange transition-colors duration-200 cursor-none"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Admin Indicator */}
          {isAuthenticated && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-brand-orange text-xs font-semibold cursor-none"
            >
              <ShieldAlert size={14} /> Console
            </Link>
          )}

          {/* Standard CTA */}
          <Link
            to="/contact"
            className="group flex items-center gap-1 bg-brand-orange hover:bg-brand-orangeHover text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 orange-glow hover:scale-[1.03] cursor-none"
          >
            Consultation <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* MOBILE ACTIONS HOLDER */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-slate-200 dark:border-brand-darkBorder text-slate-600 dark:text-slate-300 cursor-none"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full border border-slate-200 dark:border-brand-darkBorder text-slate-600 dark:text-slate-300 cursor-none"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[70px] bg-white dark:bg-brand-dark border-b border-slate-200 dark:border-brand-darkBorder z-[998] lg:hidden p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-lg font-semibold cursor-none py-1 border-b border-slate-100 dark:border-brand-darkBorder/40 ${
                    isActive ? 'text-brand-orange' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to="/admin"
                className="text-lg font-semibold text-orange-500 cursor-none py-1 border-b border-slate-100 dark:border-brand-darkBorder/40"
              >
                Admin Control Room
              </Link>
            )}

            <Link
              to="/contact"
              className="flex items-center justify-center gap-1.5 bg-brand-orange hover:bg-brand-orangeHover text-white py-3 rounded-full text-center font-bold cursor-none"
            >
              Get In Touch <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
