import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Code, Cpu, Database, Eye } from 'lucide-react';

export default function Portfolio() {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'ai', name: 'AI Systems' },
    { id: 'web', name: 'Web Applications' },
    { id: 'cloud', name: 'Cloud Infrastructure' }
  ];

  const projects = [
    {
      title: 'Aura AI - Agentic CRM Orchestrator',
      category: 'ai',
      tech: ['Python', 'LlamaIndex', 'VectorDB', 'Node.js', 'React'],
      desc: 'Autonomous corporate agent platform executing parallel query tasks, auto-generating reports, and forecasting sales trends.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Veloce - High-Concurrency Client Hub',
      category: 'web',
      tech: ['React', 'Express', 'Mongoose', 'Tailwind', 'Zustand'],
      desc: 'MERN stack software partner portal designed with detailed caching layers, sub-100ms APIs, and custom PDF generation.',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Nebula - Kubernetes Scale Engine',
      category: 'cloud',
      tech: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
      desc: 'Infrastructure as Code cloud networks hosting multi-tenant platforms with automated load balancers and zero downtime rollouts.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Chronos - Predictive Analytics Engine',
      category: 'ai',
      tech: ['Python', 'PyTorch', 'FastAPI', 'MongoDB', 'React'],
      desc: 'Advanced database scanning pipelines feeding customized regression networks to isolate supply-chain risks.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">Case Studies</span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
            Elite Portfolios
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            A meticulous showcase of digital architecture, agentic AI loops, and highly responsive MERN platforms delivered to global clients.
          </p>
        </div>

        {/* CATEGORIES FILTERS */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 cursor-none ${
                filter === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-brand-dark'
                  : 'bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-brand-darkBorder/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* PROJECTS GRID */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={project.title}
                className="group relative bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                
                {/* Project Image Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-brand-darkBorder/20">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <span className="flex items-center gap-1.5 bg-brand-orange text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      <Eye size={14} /> Case Analysis
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-wider text-brand-orange/90 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/10">
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-3 group-hover:text-brand-orange transition-colors flex items-center justify-between">
                    {project.title}
                    <ArrowUpRight size={18} className="text-slate-400 group-hover:text-brand-orange transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                    {project.desc}
                  </p>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
