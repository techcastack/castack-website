import React, { useState } from 'react';
import { useStore } from '../../store/useStore.js';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Layers, BrainCircuit, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ATSChecker() {
  const { runStandaloneATSCheck, atsReport, atsLoading, atsError, clearATSState } = useStore();
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [activeResultTab, setActiveResultTab] = useState('summary');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobTitle('');
    setJobDescription('');
    setSkillsRequired('');
    clearATSState();
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    try {
      const response = await runStandaloneATSCheck(
        file,
        jobTitle || 'Custom Role',
        jobDescription,
        skillsRequired
      );
      
      // If score is high, play some confetti!
      const finalScore = response?.atsReport?.matchPercentage || 0;
      if (finalScore >= 75) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to color-code score values
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500 stroke-green-500';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">
            Algorithmic Grading Engine
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
            ATS Resume Checker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Test your CV against proprietary semantic parsers. Uncover keyword matches, technical voids, and formatting grades in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: SCAN UPLOAD ZONE (Lg: 5 columns if results, 12 if no results) */}
          <div className={`${atsReport ? 'lg:col-span-5' : 'lg:col-span-7 lg:col-start-3'} bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-8 rounded-2xl shadow-sm transition-all duration-500`}>
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-brand-darkBorder pb-4 mb-6">
              <h2 className="text-lg font-bold font-display text-slate-800 dark:text-white flex items-center gap-2">
                <BrainCircuit className="text-brand-orange w-5 h-5" /> Parser Parameters
              </h2>
              {atsReport && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-orange transition-colors cursor-none font-semibold"
                >
                  <RefreshCw size={12} /> Clear Scan
                </button>
              )}
            </div>

            <form onSubmit={handleScan} className="flex flex-col gap-6">
              
              {/* FILE UPLOAD DRAG ZONE */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Resume File (PDF, DOCX) *
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-none transition-colors ${
                    file
                      ? 'border-brand-orange bg-orange-500/5'
                      : 'border-slate-200 dark:border-brand-darkBorder hover:border-brand-orange/60'
                  }`}
                >
                  <Upload className={`w-10 h-10 mb-4 ${file ? 'text-brand-orange' : 'text-slate-300 dark:text-slate-600'}`} />
                  
                  {file ? (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FileText size={16} className="text-brand-orange" />
                      <span className="text-sm font-bold truncate max-w-[200px]">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Drag and drop your resume file here
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Supports PDF and DOCX up to 5MB
                      </p>
                    </>
                  )}
                  
                  <input
                    type="file"
                    id="resume-file-input"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-file-input"
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBorder/40 dark:hover:bg-brand-darkBorder/80 text-[11px] text-slate-600 dark:text-slate-300 rounded-full font-bold cursor-none"
                  >
                    Select File
                  </label>
                </div>
              </div>

              {/* Job Title */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Target Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full-Stack Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                />
              </div>

              {/* Skills Required */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  Required Technologies <span className="text-[10px] text-slate-400 capitalize">(comma separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Express, MongoDB, AWS"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                />
              </div>

              {/* Job Description */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Target Job Description *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste details of the target job description to match against your resume profile..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={atsLoading || !file || !jobDescription}
                className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white py-4 rounded-xl font-bold transition-all duration-200 cursor-none shadow-lg shadow-brand-orange/10 hover:scale-[1.02] disabled:opacity-50 mt-2"
              >
                {atsLoading ? 'Parsing Resume Structures...' : 'Run ATS Calibration'} <Sparkles size={15} />
              </button>

              {atsError && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-sm text-center font-semibold mt-2">
                  {atsError}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: GRAPHICAL ATS RESULTS (Lg: 7 columns, visible only after grading) */}
          {atsReport && (
            <div className="lg:col-span-7 bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-8 rounded-2xl shadow-sm transition-all duration-500 flex flex-col gap-8">
              
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-brand-darkBorder pb-4">
                <h2 className="text-lg font-bold font-display text-slate-800 dark:text-white">
                  ATS Matching Diagnostics
                </h2>
              </div>

              {/* Progress Ring & High-level Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center border-b border-slate-100 dark:border-brand-darkBorder pb-8">
                
                {/* SVG Progress Circle */}
                <div className="sm:col-span-4 flex items-center justify-center">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-slate-100 dark:stroke-brand-darkBorder"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className={getScoreColor(atsReport.matchPercentage)}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={376.8}
                        strokeDashoffset={376.8 - (376.8 * atsReport.matchPercentage) / 100}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-display text-slate-900 dark:text-white">
                        {atsReport.matchPercentage}%
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
                        Match Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdowns */}
                <div className="sm:col-span-8 flex flex-col gap-4">
                  {/* Skills Score Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Technical Skills Coverage</span>
                      <span className="text-slate-800 dark:text-slate-200">{(atsReport.skillsScore / 40) * 100}%</span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-100 dark:bg-brand-darkBorder overflow-hidden">
                      <div className="h-full bg-brand-orange" style={{ width: `${(atsReport.skillsScore / 40) * 100}%` }} />
                    </div>
                  </div>

                  {/* Experience Score Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Experience Alignment</span>
                      <span className="text-slate-800 dark:text-slate-200">{(atsReport.experienceScore / 30) * 100}%</span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-100 dark:bg-brand-darkBorder overflow-hidden">
                      <div className="h-full bg-brand-orange" style={{ width: `${(atsReport.experienceScore / 30) * 100}%` }} />
                    </div>
                  </div>

                  {/* Readability Score Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Document Structure & Layout</span>
                      <span className="text-slate-800 dark:text-slate-200">{(atsReport.readabilityScore / 30) * 100}%</span>
                    </div>
                    <div className="w-full h-2 rounded bg-slate-100 dark:bg-brand-darkBorder overflow-hidden">
                      <div className="h-full bg-brand-orange" style={{ width: `${(atsReport.readabilityScore / 30) * 100}%` }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* TABS FOR RESULTS ARCHIVES */}
              <div className="flex border-b border-slate-100 dark:border-brand-darkBorder">
                <button
                  onClick={() => setActiveResultTab('summary')}
                  className={`flex-grow py-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-none transition-colors ${
                    activeResultTab === 'summary'
                      ? 'border-brand-orange text-brand-orange'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5"><BookOpen size={14} /> Suggestions</span>
                </button>
                
                <button
                  onClick={() => setActiveResultTab('skills')}
                  className={`flex-grow py-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-none transition-colors ${
                    activeResultTab === 'skills'
                      ? 'border-brand-orange text-brand-orange'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5"><Layers size={14} /> Skills Check</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('density')}
                  className={`flex-grow py-3 text-xs font-bold uppercase tracking-wider border-b-2 cursor-none transition-colors ${
                    activeResultTab === 'density'
                      ? 'border-brand-orange text-brand-orange'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5"><BrainCircuit size={14} /> Density</span>
                </button>
              </div>

              {/* TAB CONTENT HOUSING */}
              <div>
                {/* 1. SUGGESTIONS */}
                {activeResultTab === 'summary' && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                      Actionable Recommendations
                    </h3>
                    {atsReport.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-4 bg-slate-50 dark:bg-brand-darkBorder/20 border border-slate-200/40 dark:border-brand-darkBorder/40 rounded-xl items-start"
                      >
                        <AlertCircle className="text-brand-orange w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {rec}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. SKILLS CHECK */}
                {activeResultTab === 'skills' && (
                  <div className="flex flex-col gap-5 animate-in fade-in duration-300">
                    {/* Missing Skills */}
                    <div>
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                        <AlertCircle size={14} /> Missing Required Keywords
                      </h3>
                      {atsReport.missingKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {atsReport.missingKeywords.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-600 rounded-full text-xs font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 dark:text-slate-500 text-xs italic">
                          None! All target skill terms were matched inside your resume document.
                        </p>
                      )}
                    </div>

                    {/* Matched Skills */}
                    <div>
                      <h3 className="text-xs font-bold text-green-500 uppercase tracking-wide mb-3 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Matched Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {/* Compute matched by comparing required with missing */}
                        {atsReport.missingKeywords.length === 0 ? (
                          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-600 rounded-full text-xs font-semibold">
                            Full Alignment
                          </span>
                        ) : (
                          // Mock matched showcase
                          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-600 rounded-full text-xs font-semibold">
                            Multiple Matches Found
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. KEYWORD DENSITY */}
                {activeResultTab === 'density' && (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                      Keyword Frequency Analysis
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {atsReport.keywordDensity.map((kw, i) => (
                        <div
                          key={kw.word}
                          className="flex justify-between items-center p-3.5 bg-slate-50 dark:bg-brand-darkBorder/20 border border-slate-200/40 dark:border-brand-darkBorder/40 rounded-xl"
                        >
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono capitalize">
                            {kw.word}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-brand-darkBorder text-slate-600 dark:text-slate-400 font-bold">
                              {kw.count}x
                            </span>
                            <span className="text-xs text-brand-orange font-bold">
                              {kw.density}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
