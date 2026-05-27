import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import { Search, Briefcase, MapPin, Layers, Clock, ArrowRight, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function Careers() {
  const { jobs, jobsLoading, jobsError, fetchJobs } = useStore();
  
  // Filtering states
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [type, setType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  // Initial jobs query
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJobs({
      search,
      department,
      workplace,
      type,
      experienceLevel
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('');
    setWorkplace('');
    setType('');
    setExperienceLevel('');
    fetchJobs(); // Trigger reset
  };

  const departments = ['AI & Intelligence Systems', 'SaaS Products & Agency Core', 'Product Experience Design'];
  const workplaces = ['Remote', 'Hybrid', 'Onsite'];
  const types = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const levels = ['Junior', 'Mid', 'Senior', 'Lead'];

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3 animate-pulse">
            Join the Consulting Lab
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
            Career Openings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Collaborate on agentic AI workflows, high-fidelity MERN systems, and premium software consulting ventures. Find your next milestone below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FILTER MATRIX (Lg: 4 columns) */}
          <div className="lg:col-span-4 bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-brand-darkBorder pb-3 mb-6">
              <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                <SlidersHorizontal size={15} className="text-brand-orange" /> Filter Openings
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-1 cursor-none"
              >
                <RefreshCw size={10} /> Reset
              </button>
            </div>

            <form onSubmit={handleFilterSubmit} className="flex flex-col gap-5">
              {/* Search text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Keyword Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. React, Engineer"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                  />
                  <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* Department filter */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Division / Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                >
                  <option value="">All Divisions</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Workplace model */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Workplace Setting
                </label>
                <select
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                >
                  <option value="">All Settings</option>
                  {workplaces.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Job type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Employment Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                >
                  <option value="">All Types</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Experience level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  Seniority Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                >
                  <option value="">All Seniorities</option>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <button
                type="submit"
                disabled={jobsLoading}
                className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-bold transition-transform cursor-none duration-200 hover:scale-[1.02] mt-2 shadow-md shadow-brand-orange/10"
              >
                {jobsLoading ? 'Filtering catalog...' : 'Apply Filters'}
              </button>
            </form>
          </div>

          {/* RIGHT: JOBS GRID/LIST (Lg: 8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {jobsLoading && (
              // Loading skeletons
              <div className="flex flex-col gap-6">
                {[1, 2].map(n => (
                  <div key={n} className="bg-white dark:bg-brand-darkCard p-8 rounded-2xl border border-slate-200/50 dark:border-brand-darkBorder/40 animate-pulse flex flex-col gap-4">
                    <div className="h-6 w-1/3 bg-slate-200 dark:bg-brand-darkBorder rounded" />
                    <div className="h-4 w-1/2 bg-slate-100 dark:bg-brand-darkBorder rounded" />
                    <div className="h-10 w-full bg-slate-50 dark:bg-brand-darkBorder rounded" />
                  </div>
                ))}
              </div>
            )}

            {jobsError && (
              <div className="p-8 border border-red-500/20 bg-red-500/10 text-red-500 rounded-2xl text-center font-bold text-sm">
                Error loading job opportunities: {jobsError}
              </div>
            )}

            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <div className="p-16 border border-slate-200/50 dark:border-brand-darkBorder rounded-2xl text-center bg-white dark:bg-brand-darkCard">
                <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h4 className="font-bold text-slate-800 dark:text-white text-base mb-1">No matching open roles found</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Try resetting or modifying your filter metrics.</p>
              </div>
            )}

            {!jobsLoading && !jobsError && jobs.length > 0 && (
              <div className="flex flex-col gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="group bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder/60 p-8 rounded-2xl transition-all duration-300 hover:border-brand-orange hover:shadow-xl hover:shadow-brand-orange/5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div>
                        <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block mb-1">
                          {job.department}
                        </span>
                        <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white group-hover:text-brand-orange transition-colors">
                          {job.title}
                        </h3>
                      </div>
                      
                      <span className="self-start px-3 py-1 bg-slate-100 dark:bg-brand-darkBorder text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-slate-200/20">
                        {job.salaryRange || 'Competitive Pay'}
                      </span>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-4 items-center mb-8 text-xs text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-brand-darkBorder/40 pb-6">
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-brand-orange" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={14} className="text-brand-orange" /> {job.type}</span>
                      <span className="flex items-center gap-1"><Briefcase size={14} className="text-brand-orange" /> {job.workplace}</span>
                      <span className="flex items-center gap-1"><Layers size={14} className="text-brand-orange" /> {job.experienceLevel} Level</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      {/* First 3 skills required preview */}
                      <div className="flex flex-wrap gap-1.5">
                        {job.skillsRequired.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-brand-darkBorder/30 text-[10px] text-slate-600 dark:text-slate-400 font-semibold uppercase">
                            {skill}
                          </span>
                        ))}
                        {job.skillsRequired.length > 3 && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                            +{job.skillsRequired.length - 3} more
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/careers/${job._id}`}
                        className="group/btn flex items-center gap-1 bg-slate-900 dark:bg-brand-darkBorder text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-brand-orange dark:hover:bg-brand-orange transition-all duration-200 hover:scale-[1.03] cursor-none"
                      >
                        Inspect Position <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
