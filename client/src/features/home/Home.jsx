import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, Cpu, Layers, Sparkles, CheckCircle2, ShieldCheck, 
  Users, BarChart3, ShoppingBag, Building2, Activity, Key 
} from 'lucide-react';
import HeroCanvas from './HeroCanvas.jsx';
import api from '../../services/api.js';
import confetti from 'canvas-confetti';
import saasEcommerce from '../../assets/saas-ecommerce.png';
import saasErp from '../../assets/saas-erp.png';
import saasPharmacy from '../../assets/saas-pharmacy.png';

gsap.registerPlugin(ScrollTrigger);

function ArchitectureVisualizer() {
  const [activeTab, setActiveTab] = useState('schema'); // 'schema' | 'logs' | 'metrics'
  const [logMessages, setLogMessages] = useState([
    '[SYSTEM] Castack Neural Hub loaded.',
    '[DB] Local MongoDB connection established successfully.',
    '[PORTAL] Admin session initialized: developer_admin',
  ]);
  const [dbIOPS, setDbIOPS] = useState(124);
  const [cpuUsage, setCpuUsage] = useState(4.2);

  // Periodic log simulator
  useEffect(() => {
    const logsPool = [
      '[DB] Synced indexes for collection "inquiries" in 4ms.',
      '[AGENT] Refreshed vector memory store context.',
      '[ATS] Parsed PDF resume: match index calculated at 91.2%.',
      '[API] GET /api/v1/jobs - 200 OK - 15ms',
      '[EMAIL] Sent confirmation mail to inquiry client.',
      '[SYSTEM] Heartbeat broadcasted: Node cluster healthy.',
      '[SANDBOX] Active session registered for trial license key.',
      '[API] POST /api/v1/inquiries - 201 Created - 48ms',
    ];

    const interval = setInterval(() => {
      // Simulate changing logs
      setLogMessages(prev => {
        const nextLog = logsPool[Math.floor(Math.random() * logsPool.length)];
        const timeStr = new Date().toLocaleTimeString();
        return [...prev.slice(-3), `[${timeStr}] ${nextLog}`];
      });

      // Simulate changing telemetry
      setDbIOPS(Math.floor(110 + Math.random() * 40));
      setCpuUsage(parseFloat((3.5 + Math.random() * 2.5).toFixed(1)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const schemaTables = [
    { name: 'Users', fields: ['_id (ObjectId)', 'email (String)', 'role (String)'] },
    { name: 'Inquiries', fields: ['_id (ObjectId)', 'name (String)', 'email (String)', 'message (String)'] },
    { name: 'Jobs', fields: ['_id (ObjectId)', 'title (String)', 'department (String)'] },
    { name: 'Applications', fields: ['_id (ObjectId)', 'jobId (ObjectId)', 'atsScore (Number)'] },
  ];

  return (
    <div className="w-full h-full min-h-[360px] bg-slate-900/95 dark:bg-brand-darkCard/95 border border-slate-200/50 dark:border-brand-darkBorder/80 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden">
      {/* Decorative tech grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ec590f05_1px,transparent_1px),linear-gradient(to_bottom,#ec590f05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      {/* Visualizer header */}
      <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-brand-darkBorder/40 pb-4 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block animate-pulse" />
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-300 dark:text-slate-400 tracking-wider font-mono">
            CASTACK DB CORE v2.6
          </span>
        </div>
        <div className="flex bg-slate-800/80 dark:bg-brand-darkBorder/40 p-1 rounded-xl gap-1">
          {['schema', 'logs', 'metrics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[9px] uppercase font-bold px-2.5 py-1 rounded-lg cursor-none transition-all ${
                activeTab === tab 
                  ? 'bg-brand-orange text-white' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main panel body */}
      <div className="flex-grow relative z-10 min-h-[170px] flex flex-col justify-center">
        {activeTab === 'schema' && (
          <div className="grid grid-cols-2 gap-3 h-full animate-in fade-in duration-300">
            {schemaTables.map((table, i) => (
              <div 
                key={i} 
                className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 hover:border-brand-orange/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-brand-orange group-hover:underline">
                    {table.name}
                  </span>
                  <span className="text-[7px] font-bold text-slate-500 px-1 bg-slate-800 rounded uppercase">
                    collection
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {table.fields.map((field, fIdx) => (
                    <span key={fIdx} className="font-mono text-[8.5px] text-slate-400 text-left">
                      • {field}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-950 rounded-xl p-3.5 h-[170px] overflow-y-auto font-mono text-[9.5px] text-green-400 flex flex-col gap-1.5 border border-slate-800/80 animate-in fade-in duration-300 select-none">
            {logMessages.map((log, idx) => (
              <div key={idx} className="leading-normal break-all text-left">
                <span className="text-brand-orange">&gt;</span> {log}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
            <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                DB WRITE SPEED
              </span>
              <span className="text-2xl font-black font-display text-brand-orange font-mono">
                {dbIOPS} IOPS
              </span>
              <span className="text-[8px] text-green-500 mt-1 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" /> 
                12ms latency check
              </span>
            </div>

            <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                NODE CPU LOAD
              </span>
              <span className="text-2xl font-black font-display text-brand-orange font-mono">
                {cpuUsage}%
              </span>
              <span className="text-[8px] text-slate-400 mt-1 font-mono">
                Autoscaling active
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Visualizer footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center relative z-10">
        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono tracking-wider">
          STATUS: <span className="text-green-500 font-bold">ONLINE</span>
        </span>
        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono tracking-wider text-right">
          AWS INSTANCE: ap-south-1a
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const statsRef = useRef(null);

  // Packaged Software Demo States
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoCompany, setDemoCompany] = useState('');
  const [demoSaaS, setDemoSaaS] = useState('eCommerce Engine');
  const [demoKey, setDemoKey] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const handleRequestDemo = async (e) => {
    e.preventDefault();
    if (!demoName || !demoEmail) return;
    setDemoLoading(true);
    try {
      await api.post('/inquiries', {
        name: demoName,
        email: demoEmail,
        company: demoCompany || 'Independent Sandbox',
        subject: `[1-Week Free Demo Key Request] - ${demoSaaS}`,
        message: `Client requested a free 1-week sandbox demo key for: ${demoSaaS}. Email: ${demoEmail}.`,
        category: 'Development'
      });

      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let key = 'CASTACK-';
      for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
      key += '-TRIAL-';
      for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
      
      setDemoKey(key);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch (err) {
      alert(err.message || 'Failed to request demo keys.');
    } finally {
      setDemoLoading(false);
    }
  };

  // GSAP Entrance reveals & scrolling animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in text lines in Hero
      gsap.fromTo(
        '.hero-title-line',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-desc',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.hero-ctas',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.7, ease: 'power3.out' }
      );

      // Scroll triggered statistics counter animations
      const stats = gsap.utils.toArray('.stat-number');
      stats.forEach((stat) => {
        const val = parseFloat(stat.getAttribute('data-target'));
        gsap.fromTo(
          stat,
          { textContent: 0 },
          {
            textContent: val,
            duration: 2.0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            snap: { textContent: 1 },
            onUpdate: function () {
              stat.innerHTML = Math.ceil(this.targets()[0].textContent) + (stat.getAttribute('data-suffix') || '');
            },
          }
        );
      });

      // Stagger reveal for Services showcase cards
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 75%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const coreServices = [
    {
      icon: <Cpu className="w-8 h-8 text-brand-orange" />,
      title: 'AI & Machine Learning Systems',
      desc: 'Orchestrating agentic models, LLM pipelines, secure multi-agent chains, and RAG systems tailored to corporate datasets.',
      path: '/services'
    },
    {
      icon: <Layers className="w-8 h-8 text-brand-orange" />,
      title: 'Full-Stack Software Engineering',
      desc: 'Developing lightning-fast React MERN platforms featuring fluid layout transitions, optimized databases, and robust schemas.',
      path: '/services'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-brand-orange" />,
      title: 'Enterprise Architecture & Cloud',
      desc: 'Securing cloud deployments with autoscaling Kubernetes configurations, microservices APIs, and robust performance engineering.',
      path: '/services'
    }
  ];

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden bg-brand-light dark:bg-brand-dark">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 px-6 md:px-12">
        {/* WebGL particle background */}
        <HeroCanvas />

        <div className="max-w-5xl mx-auto text-center z-10 select-none">
          {/* Animated decorative tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Sparkles size={12} /> Enterprise Digital Architecture
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-bold font-display text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-8">
            <div className="hero-title-line overflow-hidden">Architecting Next-Gen</div>
            <div className="hero-title-line overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-400 to-amber-500">
              Enterprise Software
            </div>
            <div className="hero-title-line overflow-hidden">And Cognitive Systems</div>
          </h1>

          <p className="hero-desc max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-12">
            Castack engineering designs robust web architectures, scalable cloud infrastructure, and autonomous agentic workflows. We craft custom software that drives corporate momentum.
          </p>

          <div className="hero-ctas flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group flex items-center gap-1 bg-brand-orange hover:bg-brand-orangeHover text-white px-8 py-4 rounded-full text-[15px] font-bold transition-all duration-200 cursor-none shadow-xl shadow-brand-orange/15 hover:scale-[1.03]"
            >
              Partner With Us <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/ats"
              className="px-8 py-4 rounded-full border border-slate-200 dark:border-brand-darkBorder text-[15px] font-bold text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-brand-darkCard/40 hover:bg-slate-100 dark:hover:bg-brand-darkBorder/60 transition-all duration-200 cursor-none hover:scale-[1.03]"
            >
              Analyze Your Resume
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CLIENT LOGOS RUNNING BANNER */}
      <section className="py-12 border-y border-slate-200/40 dark:border-brand-darkBorder/40 bg-slate-50/20 dark:bg-brand-darkCard/10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center font-display text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8 animate-pulse">
            Empowering Modern Technical Ecosystems
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 relative z-10">
            {/* Next.js Logo */}
            <div className="group relative flex flex-col items-center">
              <svg className="h-10 w-auto hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] cursor-none" viewBox="0 0 24 24" aria-label="NextJS">
                <circle cx="12" cy="12" r="12" fill="black" />
                <path d="M17.892 18.069l-5.39-7.734v7.734H10.8V8.718h1.498l5.068 7.29V8.718h1.708v9.351h-1.182z" fill="url(#nextGradient)" />
                <defs>
                  <linearGradient id="nextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#a0a0a0" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute -bottom-6 text-[9px] font-bold tracking-wider font-display text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase pointer-events-none">
                Next.js
              </span>
            </div>

            {/* Node.js Logo */}
            <div className="group relative flex flex-col items-center">
              <svg className="h-10 w-auto hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(51,153,51,0.25)] cursor-none" viewBox="0 0 24 24" aria-label="NodeJS">
                <path d="M12 0L2 5.8v12.4l10 5.8 10-5.8V5.8L12 0zm-1 18.5V13.8L6.4 11.2l4.6-2.7v4.7l4.6 2.7-4.6 2.7zm2-8v-4.7l4.6 2.7-4.6 2.7v-4.7l-4.6-2.7 4.6-2.7zm-1-4.7v4.7L7.4 5.8l4.6-2.7z" fill="#339933" />
              </svg>
              <span className="absolute -bottom-6 text-[9px] font-bold tracking-wider font-display text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase pointer-events-none">
                Node.js
              </span>
            </div>

            {/* Python Logo */}
            <div className="group relative flex flex-col items-center">
              <svg className="h-10 w-auto hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(55,118,171,0.25)] cursor-none" viewBox="0 0 24 24" aria-label="Python">
                <path d="M11.97 0C5.3 0 5.48 2.87 5.48 2.87v2.24h6.63v.96H5.48c-3.1 0-5.3 1.83-5.3 5.2 0 3.37 2.44 5.2 4.8 5.2h2.87v-1.92c0-1.7 1.34-3.1 3-3.1h6.62c1.68 0 3-1.4 3-3.1V5.28c0-3.37-2.73-5.2-5.34-5.2H11.97zm-3.1 1.76a.92.92 0 1 1 0 1.84.92.92 0 0 1 0-1.84z" fill="#3776AB" />
                <path d="M12.03 24c6.67 0 6.49-2.87 6.49-2.87v-2.24h-6.63v-.96h6.63c3.1 0 5.3-1.83 5.3-5.2 0-3.37-2.44-5.2-4.8-5.2h-2.87v1.92c0 1.7-1.34 3.1-3 3.1H6.55c-1.68 0-3 1.4-3 3.1v3.37c0 3.37 2.73 5.2 5.34 5.2h3.14zm3.1-1.76a.92.92 0 1 1 0-1.84.92.92 0 0 1 0 1.84z" fill="#FFE873" />
              </svg>
              <span className="absolute -bottom-6 text-[9px] font-bold tracking-wider font-display text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase pointer-events-none">
                Python
              </span>
            </div>

            {/* Java Logo */}
            <div className="group relative flex flex-col items-center">
              <svg className="h-10 w-auto hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(224,107,35,0.25)] cursor-none" viewBox="0 0 24 24" aria-label="Java">
                <path d="M4 17.5c2.5 1 7.5 1 10 0 .5-.5 1-1.5 1-2.5v-3H3v3c0 1 .5 2 1 2.5z" fill="#0073B7" />
                <path d="M14 12c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5" stroke="#0073B7" strokeWidth="2.5" fill="none" />
                <path d="M6 3c.5.5.5 1.5 0 2s-.5 1.5 0 2 M9 2c.5.5.5 1.5 0 2s-.5 1.5 0 2 M12 3c.5.5.5 1.5 0 2s-.5 1.5 0 2" stroke="#E06B23" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M1 20c3 1 13 1 16 0" stroke="#f89820" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
              <span className="absolute -bottom-6 text-[9px] font-bold tracking-wider font-display text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase pointer-events-none">
                Java
              </span>
            </div>

            {/* Android Logo */}
            <div className="group relative flex flex-col items-center">
              <svg className="h-10 w-auto hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(61,220,132,0.3)] cursor-none" viewBox="0 0 24 24" aria-label="Android">
                <path d="M17.65 9.55l1.63-2.83c.12-.2.05-.47-.15-.59a.434.434 0 0 0-.59.15l-1.66 2.89C15.26 8.42 13.68 8 12 8c-1.68 0-3.26.42-4.88 1.12L5.46 6.23a.44.44 0 0 0-.6-.15c-.2.12-.27.39-.15.59l1.63 2.83C3.69 11.52 2 14.06 2 17h20c0-2.94-1.69-5.48-4.35-7.45zM7 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="#3DDC84" />
              </svg>
              <span className="absolute -bottom-6 text-[9px] font-bold tracking-wider font-display text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase pointer-events-none">
                Android
              </span>
            </div>

            {/* iOS/Apple Logo */}
            <div className="group relative flex flex-col items-center">
              <svg className="h-10 w-auto hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(148,163,184,0.2)] cursor-none" viewBox="0 0 24 24" aria-label="iOS">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.97.12.01.24.02.36.02 1 0 2.2-.62 2.62-1.43z" fill="url(#appleGradient)" />
                <defs>
                  <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute -bottom-6 text-[9px] font-bold tracking-wider font-display text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase pointer-events-none">
                iOS / Swift
              </span>
            </div>

            {/* AI / Neural Network (LLM) Logo */}
            <div className="group relative flex flex-col items-center">
              <svg className="h-10 w-auto hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(16,163,127,0.35)] cursor-none" viewBox="0 0 24 24" aria-label="LLM">
                <path d="M22.508 11.233a5.362 5.362 0 0 0-.775-2.73 5.378 5.378 0 0 0-2.355-1.996 5.337 5.337 0 0 0-1.134-.333 5.378 5.378 0 0 0-2.355.207 5.362 5.362 0 0 0-2.782-1.92A5.378 5.378 0 0 0 10.3 4.706a5.337 5.337 0 0 0-.323 1.134 5.378 5.378 0 0 0 .207 2.355 5.362 5.362 0 0 0-1.92 2.782 5.378 5.378 0 0 0 .248 2.807 5.337 5.337 0 0 0 1.134.323 5.378 5.378 0 0 0 2.355-.207 5.362 5.362 0 0 0 2.782 1.92 5.378 5.378 0 0 0 2.807-.248 5.337 5.337 0 0 0 .323-1.134 5.378 5.378 0 0 0-.207-2.355 5.362 5.362 0 0 0 1.92-2.782 5.378 5.378 0 0 0-.248-2.807zm-7.669 4.382l-2.807 1.62a.72.72 0 0 1-.72 0l-2.807-1.62a.72.72 0 0 1-.36-.624V11.75a.72.72 0 0 1 .36-.624l2.807-1.62a.72.72 0 0 1 .72 0l2.807 1.62a.72.72 0 0 1 .36.624v3.24a.72.72 0 0 1-.36.624zm-.36-4.488l-2.807-1.62v3.24l2.807 1.62v-3.24zm-6.335-1.62v3.24l2.807-1.62-2.807-1.62zm1.403 4.053l2.807 1.62v-3.24l-2.807-1.62v3.24z" fill="#10A37F" />
              </svg>
              <span className="absolute -bottom-6 text-[9px] font-bold tracking-wider font-display text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase pointer-events-none whitespace-nowrap">
                LLM & AI Agents
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. COMPANY INTRODUCTION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">Consulting Engineering Studio</span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white leading-tight mb-8">
              We translate critical technical aspirations into elegant operational realities.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Modern digital infrastructure is crowded with generic boilerplate systems. At Castack, we bypass standard templated models to engineer high-fidelity databases, custom AI agents, and secure, high-concurrency client architectures from the ground up.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              By combining meticulous Express/Mongoose schema logic with fluid, immersive visual motion designs, we give software agencies and SaaS products an unmistakable premium quality.
            </p>
            <Link to="/about" className="group inline-flex items-center gap-1.5 text-brand-orange font-bold text-sm cursor-none">
              Explore Our Core DNA <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl border border-slate-200/40 dark:border-brand-darkBorder/40 overflow-hidden shadow-2xl bg-brand-dark max-w-lg mx-auto lg:max-w-none flex items-center justify-center">
            <ArchitectureVisualizer />
          </div>
        </div>
      </section>

      {/* 4. SERVICES SHOWCASE */}
      <section className="py-24 px-6 md:px-12 bg-slate-50/50 dark:bg-brand-darkCard/10 border-y border-slate-200/40 dark:border-brand-darkBorder/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">Enterprise Capability</span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white">Our Engineering Verticals</h2>
          </div>

          <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <div
                key={index}
                className="service-card group bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder/60 p-10 rounded-2xl transition-all duration-300 hover:border-brand-orange hover:shadow-2xl hover:shadow-brand-orange/5 hover:scale-[1.02]"
              >
                <div className="mb-8 p-3 bg-slate-50 dark:bg-brand-darkBorder/20 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-4 group-hover:text-brand-orange transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                  {service.desc}
                </p>
                <Link
                  to={service.path}
                  className="group inline-flex items-center gap-1 text-slate-400 hover:text-brand-orange dark:text-slate-600 dark:hover:text-brand-orange font-bold text-xs cursor-none"
                >
                  Configure Service <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUCCESS METRICS SECTION */}
      <section ref={statsRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <h3 className="text-5xl md:text-6xl font-black font-display text-slate-900 dark:text-white mb-3">
              <span className="stat-number text-brand-orange" data-target="99.2" data-suffix="%">0</span>
            </h3>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">System Uptime Core</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">High-performance production endpoints</p>
          </div>
          
          <div className="flex flex-col items-center">
            <h3 className="text-5xl md:text-6xl font-black font-display text-slate-900 dark:text-white mb-3">
              <span className="stat-number text-brand-orange" data-target="86" data-suffix="+">0</span>
            </h3>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Corporate Integrations</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Delivered high-fidelity custom MERN applications</p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-5xl md:text-6xl font-black font-display text-slate-900 dark:text-white mb-3">
              <span className="stat-number text-brand-orange" data-target="15" data-suffix="M+">0</span>
            </h3>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 text-sm">Cognitive Requests Processed</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Through multi-agent pipeline systems</p>
          </div>
        </div>
      </section>

      {/* NEW SECTION: PACKAGED ENTERPRISE SaaS SOLUTIONS */}
      <section className="py-24 px-6 md:px-12 bg-slate-50/50 dark:bg-brand-darkCard/25 border-y border-slate-200/40 dark:border-brand-darkBorder/40 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">
              Deploy Instantly
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white leading-tight">
              Ready-to-Deploy Packaged Platforms
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mt-4 font-medium">
              We engineer custom modular SaaS codebases that can be deployed to your private cloud instantly. Skip standard boilerplate cycles and secure high-concurrency sandboxes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. LEFT SIDE: SaaS PLATFORM SELECTION CARDS (Lg: 5 columns) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Product 1: eCommerce */}
              <div 
                onClick={() => setDemoSaaS('eCommerce Engine')}
                className={`p-6 rounded-2xl flex gap-5 border transition-all duration-300 cursor-none select-none hover:scale-[1.01] ${
                  demoSaaS === 'eCommerce Engine'
                    ? 'bg-orange-500/5 border-brand-orange shadow-xl shadow-brand-orange/5'
                    : 'bg-white dark:bg-brand-darkCard border-slate-200/50 dark:border-brand-darkBorder/60 hover:border-brand-orange/60'
                }`}
              >
                <div className={`p-4 rounded-xl shrink-0 self-start transition-colors duration-300 ${
                  demoSaaS === 'eCommerce Engine' ? 'bg-brand-orange text-white' : 'bg-orange-500/10 text-brand-orange'
                }`}>
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-black text-slate-800 dark:text-white text-base md:text-lg">eCommerce Engine</h3>
                    <span className="text-[9px] px-2 py-0.5 bg-green-500/10 text-green-500 rounded font-bold uppercase">Stripe Sync</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 text-[13px] md:text-sm leading-relaxed font-medium">
                    Headless storefront framework, loaded with dynamic product grids, visual dashboards, multi-tenant database architectures, and sub-100ms loading parameters.
                  </p>
                </div>
              </div>

              {/* Product 2: ERP */}
              <div 
                onClick={() => setDemoSaaS('Corporate ERP Core')}
                className={`p-6 rounded-2xl flex gap-5 border transition-all duration-300 cursor-none select-none hover:scale-[1.01] ${
                  demoSaaS === 'Corporate ERP Core'
                    ? 'bg-orange-500/5 border-brand-orange shadow-xl shadow-brand-orange/5'
                    : 'bg-white dark:bg-brand-darkCard border-slate-200/50 dark:border-brand-darkBorder/60 hover:border-brand-orange/60'
                }`}
              >
                <div className={`p-4 rounded-xl shrink-0 self-start transition-colors duration-300 ${
                  demoSaaS === 'Corporate ERP Core' ? 'bg-brand-orange text-white' : 'bg-orange-500/10 text-brand-orange'
                }`}>
                  <Building2 size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-black text-slate-800 dark:text-white text-base md:text-lg">Corporate ERP Core</h3>
                    <span className="text-[9px] px-2 py-0.5 bg-orange-500/10 text-brand-orange rounded font-bold uppercase">Enterprise</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 text-[13px] md:text-sm leading-relaxed font-medium">
                    Operational core tracking internal resources, billing ledgers, staff credentials, automated invoice generation, and custom spreadsheet parsing.
                  </p>
                </div>
              </div>

              {/* Product 3: Pharmacy */}
              <div 
                onClick={() => setDemoSaaS('Pharmacy Management System')}
                className={`p-6 rounded-2xl flex gap-5 border transition-all duration-300 cursor-none select-none hover:scale-[1.01] ${
                  demoSaaS === 'Pharmacy Management System'
                    ? 'bg-orange-500/5 border-brand-orange shadow-xl shadow-brand-orange/5'
                    : 'bg-white dark:bg-brand-darkCard border-slate-200/50 dark:border-brand-darkBorder/60 hover:border-brand-orange/60'
                }`}
              >
                <div className={`p-4 rounded-xl shrink-0 self-start transition-colors duration-300 ${
                  demoSaaS === 'Pharmacy Management System' ? 'bg-brand-orange text-white' : 'bg-orange-500/10 text-brand-orange'
                }`}>
                  <Activity size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-black text-slate-800 dark:text-white text-base md:text-lg">Pharmacy Management System</h3>
                    <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded font-bold uppercase">Regulatory Check</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 text-[13px] md:text-sm leading-relaxed font-medium">
                    Secure inventory systems mapping pharmaceutical compliance records, expiry triggers, client checkout records, and automated replenishment orders.
                  </p>
                </div>
              </div>

            </div>

            {/* 2. MIDDLE COLUMN: INTERACTIVE MOCKUP PREVIEW (Lg: 4 columns) */}
            <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder/80 p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col gap-6">
              
              {/* Browser window frame mockup */}
              <div className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200/40 dark:border-brand-darkBorder/40 rounded-xl overflow-hidden shadow-md">
                
                {/* Browser bar */}
                <div className="bg-slate-200/50 dark:bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-200/20 dark:border-brand-darkBorder/20">
                  <div className="flex gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  
                  {/* Address bar */}
                  <div className="w-[180px] bg-white dark:bg-brand-dark font-mono text-[8px] text-slate-400 dark:text-slate-500 py-1 rounded text-center truncate px-2 select-none border border-slate-200/10">
                    {demoSaaS === 'eCommerce Engine' && 'https://sandbox.castack.com/ecommerce'}
                    {demoSaaS === 'Corporate ERP Core' && 'https://sandbox.castack.com/erp-core'}
                    {demoSaaS === 'Pharmacy Management System' && 'https://sandbox.castack.com/pharmacy-ledger'}
                  </div>
                  
                  <div className="w-6" /> {/* Spacer */}
                </div>

                {/* Animated SaaS platform Mockup Preview Image */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={demoSaaS}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      src={
                        demoSaaS === 'eCommerce Engine' ? saasEcommerce :
                        demoSaaS === 'Corporate ERP Core' ? saasErp :
                        saasPharmacy
                      }
                      alt={demoSaaS}
                      className="w-full h-full object-cover filter brightness-[0.88]"
                    />
                  </AnimatePresence>
                  
                  {/* Glass overlay hover light */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Dynamic checklist highlights */}
              <div>
                <h4 className="font-display font-bold text-slate-800 dark:text-white text-xs mb-3 uppercase tracking-wider text-left">
                  Platform Core Strengths
                </h4>
                <div className="flex flex-col gap-2">
                  {(demoSaaS === 'eCommerce Engine' ? ['Sub-100ms loading speeds', 'Integrated Stripe Payments', 'Elastic catalog scaling', 'Multi-tenant database split'] :
                    demoSaaS === 'Corporate ERP Core' ? ['Resource & staff trackers', 'Automated PDF ledger invoicing', 'Raw Excel parse utilities', 'Role security controls'] :
                    ['Full FDA database sync', 'Expiry auto-replenish alerts', 'Encrypted customer records', 'Regulatory audit compliance']
                  ).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs text-left animate-in slide-in-from-left-2 duration-300">
                      <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 3. RIGHT COLUMN: TRIAL SANDBOX GENERATOR (Lg: 3 columns) */}
            <div className="lg:col-span-3 bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder/80 p-6 rounded-2xl shadow-lg relative overflow-hidden">
              {/* Decorative background glows */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,89,15,0.03),transparent)] pointer-events-none" />

              <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm mb-2 flex items-center gap-2 text-left">
                <Key className="text-brand-orange" size={16} /> Sandbox Trial
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-6 border-b border-slate-100 dark:border-brand-darkBorder/40 pb-4 text-left">
                Generate an active 1-week free demo sandbox license code to launch this platform inside your browser sandbox.
              </p>

              {demoKey ? (
                // SUCCESS LOG FOR KEY
                <div className="flex flex-col gap-5 text-center items-center py-6 animate-in fade-in duration-300 relative z-10">
                  <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full animate-bounce">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-800 dark:text-white text-xs">Trial Key Issued!</h4>
                    <p className="text-[9.5px] text-slate-400 mt-1 max-w-[180px]">
                      Your private cloud sandbox is preparing. Copy this token to launch the platform.
                    </p>
                  </div>
                  
                  {/* Generated license code box */}
                  <div className="w-full bg-slate-50 dark:bg-brand-darkBorder/40 border border-slate-200/40 dark:border-brand-darkBorder/60 p-4 rounded-xl">
                    <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest block mb-1">LICENSE KEY</span>
                    <span className="font-mono text-xs font-black text-brand-orange tracking-wider select-all">{demoKey}</span>
                  </div>

                  <button
                    onClick={() => setDemoKey('')}
                    className="w-full py-2 bg-slate-900 hover:bg-brand-orange text-white text-[10px] font-bold rounded-xl transition-colors cursor-none mt-2"
                  >
                    Request Another Sandbox Key
                  </button>
                </div>
              ) : (
                // KEY REQUEST FORM
                <form onSubmit={handleRequestDemo} className="flex flex-col gap-4 relative z-10">
                  {/* Name */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Your Name *</label>
                    <input
                      type="text" required
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Work Email *</label>
                    <input
                      type="email" required
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                    />
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Organization / Firm</label>
                    <input
                      type="text"
                      value={demoCompany}
                      onChange={(e) => setDemoCompany(e.target.value)}
                      placeholder="e.g. Castack Labs"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                    />
                  </div>

                  {/* SaaS Selector (Synchronized with visual selection) */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Selected Platform *</label>
                    <select
                      value={demoSaaS}
                      onChange={(e) => setDemoSaaS(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                    >
                      <option value="eCommerce Engine">eCommerce Engine (Stripe)</option>
                      <option value="Corporate ERP Core">Corporate ERP Core</option>
                      <option value="Pharmacy Management System">Pharmacy Management System</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={demoLoading || !demoName || !demoEmail}
                    className="w-full flex items-center justify-center gap-1 bg-brand-orange hover:bg-brand-orangeHover text-white py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-none shadow-md disabled:opacity-50 mt-2 hover:scale-[1.02]"
                  >
                    {demoLoading ? 'Requesting Sandbox...' : 'Request Sandbox Key'} <ArrowRight size={12} />
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 6. IMMERSIVE ATS CTA */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-r from-brand-orange to-amber-600 rounded-3xl p-12 relative overflow-hidden shadow-2xl shadow-brand-orange/10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Grid lines decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={12} /> ATS Resume Engine V1
            </span>
            <h3 className="text-2xl md:text-4xl font-bold font-display text-white mb-4 leading-tight">
              Curious how your CV scores against enterprise engineering roles?
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Upload your resume in PDF/DOCX to receive instant parsing analytics, matching scores, missing technology checklists, and structural tips.
            </p>
          </div>
          
          <Link
            to="/ats"
            className="relative z-10 shrink-0 flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-brand-orange px-8 py-4 rounded-full font-bold transition-transform cursor-none duration-200 hover:scale-[1.03] text-sm shadow-xl"
          >
            Launch Free Scan <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
