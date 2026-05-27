import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Target, Heart, Globe, Users, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const timelineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Connect vertical timeline indicator scroll triggers
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 30%',
            end: 'bottom 80%',
            scrub: true,
          },
        }
      );

      // Stagger animate timeline cards on entrance
      gsap.fromTo(
        '.timeline-node',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 50%',
          },
        }
      );
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  const timelineMilestones = [
    {
      year: '2022',
      title: 'Inception in Bengaluru',
      desc: 'Founded as a bespoke software agency, building lightweight high-concurrency client databases and API architectures.'
    },
    {
      year: '2023',
      title: 'MERN Stack Standardisation',
      desc: 'Pioneered custom Express middleware pipelines, standardizing design tokens, schema indexings, and performant state systems.'
    },
    {
      year: '2024',
      title: 'AI Intelligence Division Launch',
      desc: 'Formed a research team dedicated to fine-tuning LLMs, scaling Pinecone/vector caches, and orchestrating LangChain agent architectures.'
    },
    {
      year: '2026',
      title: 'Enterprise Architecture & Cloud Leaders',
      desc: 'Recognized as an elite software consulting hub delivering premium corporate portals, complex analytics panels, and standalone ATS systems.'
    }
  ];

  const leadership = [
    {
      name: 'Aarav Mehta',
      role: 'Chief AI Officer',
      bio: 'Alumnus of IISc. Ex-Principal Researcher at OpenAI. Designs domain-specific cognitive agents and robust semantic memory modules.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'
    },
    {
      name: 'Elena Rostova',
      role: 'Principal Animator & UI Architect',
      bio: '10+ years of digital agency experience in Prague and Bengaluru. Translates complex data matrices into elegant micro-interactions.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
    }
  ];

  return (
    <div ref={timelineRef} className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">Our Identity</span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
            Our DNA & Momentum
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            We bypass traditional templated models to engineer high-fidelity databases, custom AI agents, and secure, high-concurrency client architectures.
          </p>
        </div>

        {/* 2. MISSION & VISION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-28">
          <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-10 rounded-2xl flex gap-6 items-start">
            <div className="p-3 rounded-xl bg-orange-500/10 text-brand-orange shrink-0">
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Our Mission</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                To equip progressive tech enterprises with custom backend structures and immersive visual interfaces. We make digital infrastructure exceptionally fast, secure, and delightful to interact with.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-10 rounded-2xl flex gap-6 items-start">
            <div className="p-3 rounded-xl bg-orange-500/10 text-brand-orange shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-3">Our Core Philosophy</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                No placeholders, no compromises. We enforce detailed rate-limiting, Helmet security policies, strict MongoDB schemas, and optimal layout performance to ensure your software is fully production-ready.
              </p>
            </div>
          </div>
        </section>

        {/* 3. STORY TIMELINE */}
        <section className="timeline-container relative max-w-4xl mx-auto mb-32">
          <h2 className="text-center font-display text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16">
            The Trajectory Timeline
          </h2>
          
          {/* Vertical scroll-tied line (Desktop only) */}
          <div className="absolute left-1/2 top-10 bottom-10 w-[2px] bg-slate-200 dark:bg-brand-darkBorder -translate-x-1/2 hidden md:block">
            <div className="timeline-line w-full h-full bg-brand-orange origin-top scale-y-0" />
          </div>

          <div className="flex flex-col gap-12 relative">
            {timelineMilestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={milestone.year}
                  className={`timeline-node flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline block card */}
                  <div className="w-full md:w-[42%] bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-8 rounded-2xl hover:border-brand-orange transition-all duration-300 relative z-10">
                    <span className="font-display font-black text-brand-orange text-3xl md:text-4xl block mb-2">
                      {milestone.year}
                    </span>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base md:text-lg mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                      {milestone.desc}
                    </p>
                  </div>

                  {/* Bullet Node (Center) */}
                  <div className="absolute left-1/2 w-4 h-4 bg-brand-orange rounded-full -translate-x-1/2 hidden md:block border border-white dark:border-brand-dark z-20" />

                  {/* Blank space holder */}
                  <div className="w-full md:w-[42%] hidden md:block" />
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. LEADERSHIP CARDS */}
        <section className="mb-24">
          <h2 className="text-center font-display text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16">
            Founders & Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {leadership.map((member, index) => (
              <div
                key={member.name}
                className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-8 rounded-2xl flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left transition-transform duration-300 hover:scale-[1.02]"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border border-brand-orange/40 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{member.name}</h3>
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block mb-3">{member.role}</span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
