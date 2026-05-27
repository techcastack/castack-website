import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import { ArrowLeft, User, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function BlogDetails() {
  const { slug } = useParams();
  const { currentBlog, blogsLoading, blogsError, fetchBlogDetails } = useStore();

  useEffect(() => {
    fetchBlogDetails(slug);
  }, [slug, fetchBlogDetails]);

  if (blogsLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-brand-light dark:bg-brand-dark">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-brand-orange rounded-full animate-spin" />
      </div>
    );
  }

  if (blogsError || !currentBlog) {
    return (
      <div className="w-full bg-brand-light dark:bg-brand-dark py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-2">Article failed to load</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{blogsError || 'The requested blog article was not found.'}</p>
        <Link to="/blog" className="px-6 py-2.5 rounded-full bg-brand-orange text-white text-sm font-bold cursor-none">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-orange transition-colors cursor-none mb-10"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {/* COVER HEADER */}
        <header className="mb-12">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-brand-orange mb-4">
            <span className="flex items-center gap-1"><User size={13} /> {currentBlog.author}</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {currentBlog.readTime || '3 min read'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-display text-slate-900 dark:text-white leading-tight mb-6">
            {currentBlog.title}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed mb-8 border-l-4 border-brand-orange pl-4 italic">
            {currentBlog.summary}
          </p>

          {/* Cover image */}
          <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-slate-200/50 dark:border-brand-darkBorder">
            <img
              src={currentBlog.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1024&auto=format&fit=crop'}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <article className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed whitespace-pre-line border-b border-slate-100 dark:border-brand-darkBorder/40 pb-12 mb-10">
          {currentBlog.content}
        </article>

        {/* TAGS FOOTER */}
        <footer className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mr-2">Tags:</span>
          {currentBlog.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-100 dark:bg-brand-darkBorder/40 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </footer>

      </div>
    </div>
  );
}
