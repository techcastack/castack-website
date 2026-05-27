import React from 'react';
import { Briefcase } from 'lucide-react';

export default function Policy() {
  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="p-3 bg-orange-500/10 text-brand-orange border border-orange-500/20 rounded-full mb-4">
            <Briefcase size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
            Careers & Hiring Policy
          </h1>
          <p className="text-slate-400 text-xs font-mono">Last updated: May 27, 2026</p>
        </div>

        {/* BODY */}
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed flex flex-col gap-6">
          <p>
            At Castack Technologies, we are committed to providing a transparent, fair, and highly professional hiring experience for all applicants. This Careers & Hiring Policy outlines how candidate profiles are parsed, analyzed, and processed.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">1. Equal Opportunity Employer</h3>
          <p>
            Castack is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees. All hiring decisions are based on business needs, job requirements, and individual qualifications, without regard to race, color, religion, sex, sexual orientation, gender identity, or national origin.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">2. ATS Automated Review Disclaimer</h3>
          <p>
            Our ATS Resume Checker uses static regex tokenizers and noun matching algorithms to evaluate skill coverage, keyword density, and formatting readability relative to open role parameters. 
          </p>
          <p>
            While this scores applications to provide structured analytical summaries for our recruiters, it acts as a screening guide. **Every application is ultimately reviewed manually by a human member of our talent acquisition division.** We do not reject candidates solely based on automated scoring.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">3. Data Retention</h3>
          <p>
            By uploading a resume and submitting an application, you consent to Castack retaining your CV and candidate profile for a period of up to 2 years for the purposes of evaluating your suitability for future career openings. You may request immediate removal of your records by emailing us at <strong className="text-brand-orange font-mono">careers@castack.com</strong>.
          </p>
        </div>

      </div>
    </div>
  );
}
