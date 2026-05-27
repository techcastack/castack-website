import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import { ArrowLeft, Briefcase, MapPin, Layers, Clock, Upload, Send, Sparkles, Check, ChevronRight, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function JobDetails() {
  const { id } = useParams();
  const { currentJob, jobsLoading, jobsError, fetchJobDetails, submitJobApplication, atsReport, atsLoading, atsError, clearATSState } = useStore();
  
  // Application form states
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  
  // Dynamic application step: 'form' -> 'loading' -> 'result'
  const [applyStep, setApplyStep] = useState('form');

  useEffect(() => {
    fetchJobDetails(id);
    clearATSState();
  }, [id, fetchJobDetails, clearATSState]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setApplyStep('loading');
    try {
      const response = await submitJobApplication(
        resumeFile,
        name,
        email,
        phone,
        coverLetter,
        id
      );
      
      setApplyStep('result');
      
      // Celebrate high score candidates!
      const score = response?.atsScore || 0;
      if (score >= 70) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setApplyStep('form');
    }
  };

  const closeApplyModal = () => {
    setModalOpen(false);
    setApplyStep('form');
    setName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
    setResumeFile(null);
    clearATSState();
  };

  if (jobsLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (jobsError || !currentJob) {
    return (
      <div className="w-full bg-brand-light dark:bg-brand-dark py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-2">Role specifications failed to load</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{jobsError || 'The requested job posting was not found.'}</p>
        <Link to="/careers" className="px-6 py-2.5 rounded-full bg-brand-orange text-white text-sm font-bold cursor-none">
          Return to Openings
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <Link
          to="/careers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-orange transition-colors cursor-none mb-10"
        >
          <ArrowLeft size={14} /> Back to Openings
        </Link>

        {/* ROLE METRICS CARD */}
        <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-8 rounded-3xl shadow-sm mb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block mb-1">
                {currentJob.department}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-800 dark:text-white">
                {currentJob.title}
              </h1>
            </div>
            
            <button
              onClick={() => setModalOpen(true)}
              className="bg-brand-orange hover:bg-brand-orangeHover text-white px-8 py-4 rounded-full text-sm font-bold transition-all duration-200 orange-glow hover:scale-[1.03] cursor-none shrink-0"
            >
              Apply For This Position
            </button>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-500 dark:text-slate-400 text-xs font-semibold border-t border-slate-100 dark:border-brand-darkBorder/40 pt-6">
            <div>
              <h4 className="text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">Location</h4>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{currentJob.location}</p>
            </div>
            <div>
              <h4 className="text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">Setting</h4>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{currentJob.workplace}</p>
            </div>
            <div>
              <h4 className="text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">Role Type</h4>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{currentJob.type}</p>
            </div>
            <div>
              <h4 className="text-[10px] text-slate-400 dark:text-slate-500 uppercase mb-1">Target Package</h4>
              <p className="text-slate-800 dark:text-slate-200 font-bold">{currentJob.salaryRange || 'Competitive Pay'}</p>
            </div>
          </div>
        </div>

        {/* ROLE BLUEPRINTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: JOB BRIEFING (Lg: 8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Description */}
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-brand-darkBorder/40 pb-2">
                Overview & Description
              </h3>
              
              {/* Parse rudimentary markdown descriptors directly */}
              <div className="whitespace-pre-line">
                {currentJob.description}
              </div>
            </div>

            {/* Responsibilities list */}
            <div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-brand-darkBorder/40 pb-2">
                Operational Responsibilities
              </h3>
              <ul className="flex flex-col gap-3">
                {currentJob.responsibilities.map((resp, i) => (
                  <li key={i} className="flex gap-2.5 items-start text-xs md:text-sm text-slate-500 dark:text-slate-400">
                    <ChevronRight size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: CORE CAPABILITIES (Lg: 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Core Technologies Box */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-6 rounded-2xl">
              <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-brand-darkBorder pb-3 mb-4">
                Core Technologies Required
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentJob.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs font-semibold text-brand-orange uppercase"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* General Requirements */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-6 rounded-2xl">
              <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-brand-darkBorder pb-3 mb-4">
                Minimum Qualifications
              </h3>
              <div className="flex flex-col gap-3.5">
                {currentJob.requirements.map((req, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-500 dark:text-slate-400">
                    <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* --- DYNAMIC APPLY DRAWER OVERLAY MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            
            {/* Close trigger */}
            <button
              onClick={closeApplyModal}
              disabled={atsLoading}
              className="absolute right-6 top-6 p-2 rounded-full border border-slate-100 dark:border-brand-darkBorder text-slate-400 hover:text-brand-orange cursor-none"
            >
              <X size={16} />
            </button>

            {/* STEP 1: FORM INPUT */}
            {applyStep === 'form' && (
              <>
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block mb-1">
                    Application Form
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-slate-800 dark:text-white">
                    Apply for {currentJob.title}
                  </h2>
                </div>

                <form onSubmit={handleApplySubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                    />
                  </div>

                  {/* Resume Upload Drag Zone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Resume File (PDF, DOCX) *
                    </label>
                    <div className={`border border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center cursor-none ${
                      resumeFile ? 'border-brand-orange bg-orange-500/5' : 'border-slate-200 dark:border-brand-darkBorder'
                    }`}>
                      <Upload className={`w-8 h-8 mb-2 ${resumeFile ? 'text-brand-orange' : 'text-slate-300'}`} />
                      {resumeFile ? (
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{resumeFile.name}</span>
                      ) : (
                        <p className="text-xs font-semibold text-slate-500">PDF or DOCX resumes under 5MB</p>
                      )}
                      <input
                        type="file"
                        id="modal-resume-file"
                        accept=".pdf,.docx"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="modal-resume-file"
                        className="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-brand-darkBorder/40 text-[10px] text-slate-600 dark:text-slate-300 rounded-full font-bold cursor-none"
                      >
                        Select Resume
                      </label>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                      Cover Letter or Brief Intro
                    </label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why do you want to join Castack?"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-xs bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!resumeFile}
                    className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white py-3.5 rounded-xl font-bold transition-all duration-200 cursor-none shadow-lg disabled:opacity-50 mt-2 text-sm"
                  >
                    Submit Application & Scan Resume <Send size={14} />
                  </button>

                  {atsError && (
                    <div className="p-3 border border-red-500/20 bg-red-500/10 text-red-500 text-xs rounded-xl text-center font-bold">
                      {atsError}
                    </div>
                  )}
                </form>
              </>
            )}

            {/* STEP 2: PARSING LOADER */}
            {applyStep === 'loading' && (
              <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 border-2 border-slate-100 border-t-brand-orange rounded-full animate-spin mb-2" />
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg">Calibrating Resume Metrics</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs max-w-sm">
                  Our system is tokenizing your resume document, checking keywords coverage, and executing ATS score matching. Please wait...
                </p>
              </div>
            )}

            {/* STEP 3: ATS GRADING SCORE DISPLAY */}
            {applyStep === 'result' && atsReport && (
              <div className="flex flex-col gap-6 text-center items-center py-4 animate-in fade-in duration-500">
                <div className="p-3 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 inline-block">
                  <CheckCircle2 size={32} />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold font-display text-slate-800 dark:text-white mb-2">Application Submitted!</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto">
                    We have successfully archived your application details and sent a confirmation alert to <strong>{email}</strong>.
                  </p>
                </div>

                {/* Score badge */}
                <div className="my-4 p-6 bg-slate-50 dark:bg-brand-darkBorder/20 border border-slate-200/40 dark:border-brand-darkBorder/40 rounded-2xl w-full max-w-sm">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    ATS Resume Score
                  </span>
                  <span className="text-4xl font-black font-display text-brand-orange block mb-2">
                    {atsReport.matchPercentage}% Match
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    This represents how well your structural experience and technology keywords match the <strong>{currentJob.title}</strong> requirements.
                  </p>
                </div>

                {/* Micro recommendations highlights */}
                <div className="text-left w-full border-t border-slate-100 dark:border-brand-darkBorder pt-6">
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-3">
                    Talent suggestions feedback
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                    {atsReport.recommendations.slice(0, 2).map((rec, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <Sparkles size={12} className="text-brand-orange shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={closeApplyModal}
                  className="bg-slate-900 dark:bg-brand-darkBorder text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-brand-orange transition-colors cursor-none mt-4 shadow-sm w-full max-w-sm"
                >
                  Close & Finish
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
