import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Building2, Clock, Globe } from 'lucide-react';
import api from '../../services/api.js';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    category: 'Development'
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const categories = [
    'Development',
    'Consulting',
    'AI Solutions',
    'Careers',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');
    try {
      const response = await api.post('/inquiries', formData);
      setIsSuccess(true);
      setStatusMsg(response.message || 'Inquiry sent successfully!');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        category: 'Development'
      });
    } catch (err) {
      setIsSuccess(false);
      setStatusMsg(err.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">Partner With Us</span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
            Initiate Conversation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Ready to scale your digital architecture, launch domain-specific AI models, or integrate custom engineering pipelines? Reach out to our design and consulting divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: INQUIRY FORM (Lg: 7 columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-8 md:p-10 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-8">
              Inquiry Submission
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your organization"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Inquiry Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Message Content *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Provide details about your project scope, timeline goals, or inquiry details..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white py-4 rounded-xl font-bold transition-all duration-200 cursor-none shadow-lg shadow-brand-orange/15 hover:scale-[1.02] disabled:opacity-50 mt-2"
              >
                {loading ? 'Sending Request...' : 'Send Inquiry Message'} <Send size={15} />
              </button>

              {statusMsg && (
                <div className={`p-4 rounded-xl border text-sm mt-2 text-center font-semibold ${
                  isSuccess 
                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                  {statusMsg}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: MAP & HEADQUARTERS DETAILS (Lg: 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Direct Contact Cards */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-8 rounded-2xl flex flex-col gap-6">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-brand-darkBorder pb-3">
                Castack Headquarters
              </h3>

              <div className="flex gap-4 items-start">
                <MapPin className="text-brand-orange w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-1">Corporate Office</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Castack Towers, Sector 4, Outer Ring Road, Bengaluru, Karnataka 560103, India.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Clock className="text-brand-orange w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-1">Office Hours</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    Monday – Friday: 09:00 AM – 06:00 PM IST (GMT+5:30)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Mail className="text-brand-orange w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-1">Electronic Inquiries</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold hover:text-brand-orange transition-colors">
                    consulting@castack.com
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Mock Map Grid */}
            <div className="relative aspect-[4/3] rounded-2xl border border-slate-200/50 dark:border-brand-darkBorder/60 bg-slate-900 overflow-hidden shadow-sm flex items-center justify-center p-6 text-center select-none">
              {/* Radial gradient background imitating coordinates */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,89,15,0.1),transparent)] z-0" />
              {/* Dot mapping system */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              <div className="z-10 flex flex-col items-center">
                <Building2 className="text-brand-orange w-12 h-12 mb-4 animate-pulse-slow" />
                <h4 className="font-display font-bold text-white text-base mb-1">Bengaluru Tech Hub Coordinate</h4>
                <p className="text-slate-500 text-[11px] font-mono tracking-widest mb-3">12.9716° N, 77.5946° E</p>
                <span className="px-3 py-1 bg-brand-orange text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Active Lab
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
