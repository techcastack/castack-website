import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Globe, Cloud, Layout, Check, Shield, HelpCircle, Layers, Smartphone, Users } from 'lucide-react';

export default function Services() {
  const [activeTab, setActiveTab] = useState('web');

  const servicesCatalog = {
    web: {
      id: 'web',
      icon: <Globe className="w-6 h-6" />,
      title: 'Web Development',
      badge: 'MERN & Next.js Core',
      desc: 'Engineered for high performance, luxury visual presentations, responsive layouts, and sub-100ms API endpoints. We build premium portals, web agency cores, and corporate catalogs.',
      techStack: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'React Query'],
      benefits: [
        'Responsive grids tested across 12 mobile/tablet presets.',
        'Lighthouse audit benchmarks target 95%+ out of the box.',
        'Scalable Mongoose indices avoiding slow query locks.',
        'Clean modular standard architecture following best styling guidelines.'
      ],
      process: [
        { step: '01', name: 'Scaffolding & Architecture', duration: '1-2 Weeks' },
        { step: '02', name: 'Core APIs & DB Modelling', duration: '2 Weeks' },
        { step: '03', name: 'UI & Smooth Motion Integrations', duration: '2 Weeks' },
        { step: '04', name: 'Audit, Security Seals & Go-Live', duration: '1 Week' }
      ],
      timeline: '6 Weeks Production Cycle',
      faq: [
        { q: 'Do you offer SEO-friendly React architectures?', a: 'Yes, we implement optimized React routing frameworks and integrate metadata indices directly during the build phase.' },
        { q: 'Is the backend completely customized?', a: 'Completely. We bypass standardized CMS frameworks to write custom Express microservices with full DB control.' }
      ]
    },
    ai: {
      id: 'ai',
      icon: <Cpu className="w-6 h-6" />,
      title: 'AI & Cognitive Engineering',
      badge: 'Agentic Workflows V2',
      desc: 'Move beyond basic chatbots to design autonomous agent systems, custom LLM fine-tuning pipelines, private embedding archives, and semantic search tools.',
      techStack: ['Python', 'LangChain', 'LlamaIndex', 'Vector Databases', 'Hugging Face', 'AWS SageMaker', 'Express'],
      benefits: [
        'Secure sandboxed environment execution.',
        'Drastic reductions in corporate search pipelines via vector indexing.',
        'Autonomous task planning, verification, and retry systems.',
        'Optimized token caching lowering API expenses by up to 40%.'
      ],
      process: [
        { step: '01', name: 'Dataset Auditing & Scopes', duration: '2 Weeks' },
        { step: '02', name: 'Model Evaluation & Embeddings', duration: '3 Weeks' },
        { step: '03', name: 'Agent Pipeline Orchestration', duration: '3 Weeks' },
        { step: '04', name: 'Security Review & Fine Tuning', duration: '2 Weeks' }
      ],
      timeline: '10 Weeks Production Cycle',
      faq: [
        { q: 'How do you safeguard client confidential data?', a: 'We construct sandboxed execution networks and utilize private vector databases. Data is processed locally without external leakage.' },
        { q: 'Can the agents connect to legacy corporate SQL networks?', a: 'Yes, we build secure schema brokers that translate natural speech inquiries into clean, secure SQL transactions.' }
      ]
    },
    cloud: {
      id: 'cloud',
      icon: <Cloud className="w-6 h-6" />,
      title: 'Cloud & Infrastructure',
      badge: 'Autoscaling Architecture',
      desc: 'Orchestrating robust cloud networks. We deploy systems on AWS and GCP using containerized microservices pipelines capable of supporting millions of transactions.',
      techStack: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Nginx', 'Redis', 'GitHub Actions', 'Prometheus'],
      benefits: [
        '99.99% Uptime SLA configurations.',
        'Zero-downtime rolling updates using CI/CD pathways.',
        'Automated load balancing resolving traffic spikes.',
        'Comprehensive Winston backend logging configurations.'
      ],
      process: [
        { step: '01', name: 'Traffic Profiling & Auditing', duration: '1 Week' },
        { step: '02', name: 'Terraform Scripting & Scaffolding', duration: '2 Weeks' },
        { step: '03', name: 'Containerization & Syncing', duration: '2 Weeks' },
        { step: '04', name: 'Simulated Load Audits & Tweaks', duration: '1 Week' }
      ],
      timeline: '6 Weeks Production Cycle',
      faq: [
        { q: 'Do you configure automated databases backups?', a: 'Always. We build daily automated encrypted snapshot procedures with quick restoration fallbacks.' },
        { q: 'Is Terraform always mandatory?', a: 'For enterprise solutions, we enforce Infrastructure as Code (IaC) to ensure replicable environments.' }
      ]
    },
    uiux: {
      id: 'uiux',
      icon: <Layout className="w-6 h-6" />,
      title: 'UI/UX Product Design',
      badge: 'Luxury Visual Aesthetic',
      desc: 'Creating visually stunning, minimal, and premium digital products. We establish deep design system tokens, typography structures, and fluid micro-interactions.',
      techStack: ['Figma', 'Adobe Creative Suite', 'Principle', 'Spline 3D', 'Proto.io', 'Style Guidelines'],
      benefits: [
        'Pixel-perfect dark and light contrast systems.',
        'Deep Figma auto-layouts allowing painless developer handoffs.',
        'Sleek motion guides and micro-interaction documentation.',
        'User research mapping reducing onboarding friction by 35%.'
      ],
      process: [
        { step: '01', name: 'Competitive Review & Moodboards', duration: '2 Weeks' },
        { step: '02', name: 'Low-Fidelity Architecture Layouts', duration: '2 Weeks' },
        { step: '03', name: 'High-Fidelity Premium Aesthetics', duration: '3 Weeks' },
        { step: '04', name: 'Interaction Prototyping & Demos', duration: '1 Week' }
      ],
      timeline: '8 Weeks Production Cycle',
      faq: [
        { q: 'Do we receive the original design source files?', a: 'Yes, we hand over fully organized Figma team files loaded with custom component structures and color tokens.' },
        { q: 'Do you help code the visual animations?', a: 'Our UI designers work side-by-side with animation engineers to provide pre-calculated coordinate metrics for GSAP/CSS curves.' }
      ]
    }
  };

  const current = servicesCatalog[activeTab];

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3 animate-pulse">
            Premium Competencies
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
            Enterprise Solutions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            From modern Web application development to advanced, autonomous cognitive agents, we engineer solutions following the absolute highest industry standards.
          </p>
        </div>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-16">
          {Object.values(servicesCatalog).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 rounded-full text-sm font-semibold transition-all duration-300 cursor-none hover:scale-[1.03] ${
                activeTab === tab.id
                  ? 'bg-brand-orange text-white orange-glow'
                  : 'bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-brand-darkBorder/40'
              }`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE SERVICE DETAILS (ANIMATED TRANSITION) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            
            {/* LEFT DETAIL LOGS (Lg: 7 columns) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div>
                <span className="text-brand-orange font-bold text-xs uppercase tracking-widest px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 inline-block mb-4">
                  {current.badge}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 dark:text-white mb-6">
                  {current.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  {current.desc}
                </p>
              </div>

              {/* Technologies Grid */}
              <div>
                <h3 className="text-[13px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-4">
                  Technical Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {current.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-brand-darkBorder/40 border border-slate-200/40 dark:border-brand-darkBorder/60 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Benefits Checklist */}
              <div>
                <h3 className="text-[13px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-4">
                  Vertical Advantages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {current.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2.5 items-start">
                      <div className="shrink-0 p-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-brand-orange mt-0.5">
                        <Check size={12} />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PROCESS TIMELINE LOGS (Lg: 5 columns) */}
            <div className="lg:col-span-5 bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-brand-darkBorder p-8 rounded-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-brand-darkBorder pb-4 mb-6">
                <span className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Production Pipeline</span>
                <span className="text-[11px] font-bold text-brand-orange tracking-wide uppercase px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                  {current.timeline}
                </span>
              </div>

              {/* Delivery Steps */}
              <div className="flex flex-col gap-6 mb-8">
                {current.process.map((step) => (
                  <div key={step.step} className="flex gap-4 items-start relative">
                    <span className="font-display font-black text-brand-orange text-lg tracking-tight select-none">
                      {step.step}
                    </span>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-[14px]">
                        {step.name}
                      </h4>
                      <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium uppercase mt-0.5">
                        Duration: {step.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Service FAQs */}
              <div className="border-t border-slate-100 dark:border-brand-darkBorder pt-6">
                <h4 className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-bold text-sm mb-4">
                  <HelpCircle size={15} className="text-brand-orange" /> Vertical FAQs
                </h4>
                <div className="flex flex-col gap-4">
                  {current.faq.map((f, i) => (
                    <div key={i} className="text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-300 mb-1">
                        {f.q}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
