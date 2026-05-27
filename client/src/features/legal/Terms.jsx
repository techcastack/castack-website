import React from 'react';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="p-3 bg-orange-500/10 text-brand-orange border border-orange-500/20 rounded-full mb-4">
            <FileText size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-xs font-mono">Last updated: May 27, 2026</p>
        </div>

        {/* BODY */}
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed flex flex-col gap-6">
          <p>
            Welcome to Castack Technologies! These terms and conditions outline the rules and regulations for the use of Castack's Website and services.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">1. Agreement to Terms</h3>
          <p>
            By accessing this website we assume you accept these terms and conditions in full. Do not continue to use Castack's website if you do not accept all of the terms and conditions stated on this page.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">2. Interactive Systems & ATS Portal</h3>
          <p>
            Our website offers interactive elements including an ATS Resume Parser. You are responsible for ensuring that files uploaded (PDF/DOCX format) do not contain malicious scripts, viruses, or corrupted metadata. 
          </p>
          <p>
            The calculated ATS score is an algorithmic simulation matching text density and keyword patterns against job specifications. It does not represent a guarantee of recruitment.
          </p>

          <h3 className="font-display font-bold text-slate-800 dark:text-white text-base mt-4">3. Intellectual Property</h3>
          <p>
            Unless otherwise stated, Castack Technologies owns the intellectual property rights for all material on Castack. All intellectual property rights are reserved. You must not copy, duplicate, or republish designs or codes from this platform.
          </p>
        </div>

      </div>
    </div>
  );
}
