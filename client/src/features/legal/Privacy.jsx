import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="p-3 bg-orange-500/10 text-brand-orange border border-orange-500/20 rounded-full mb-4">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-xs font-mono">Last updated: May 27, 2026</p>
        </div>

        {/* BODY */}
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed flex flex-col gap-6">
          <p>
            At Castack Technologies, accessible from Castack websites, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Castack and how we use it.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">1. Information We Collect</h3>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            When you apply for a job or scan a resume via our ATS portal, we capture candidate details (name, email, phone) and extract plain text CV descriptors to compute relevance scores against corporate requisites. Raw documents are stored securely in local database systems and are only accessible by authenticated administrators.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">2. How We Use Your Information</h3>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-5 flex flex-col gap-2">
            <li>Provide, operate, and maintain our enterprise website services.</li>
            <li>Analyze candidate suitability for open career vacancies via automated ATS parsing tools.</li>
            <li>Send application confirmation receipts and client inquiry alerts using secure SMTP servers.</li>
            <li>Improve and expand the design micro-interactions of our products.</li>
          </ul>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">3. Security</h3>
          <p>
            We enforce robust, production-ready security parameters including Helmet HTTP headers, JWT authentication guards, and API rate-limiting to prevent unauthorized access and data compromises.
          </p>
        </div>

      </div>
    </div>
  );
}
