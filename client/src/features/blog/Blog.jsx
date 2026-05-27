import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import { Calendar, User, Clock, ArrowRight, BookOpen, Search } from 'lucide-react';

export default function Blog() {
  const { blogs, blogsLoading, blogsError, fetchBlogs } = useStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs({ search });
  };

  return (
    <div className="w-full bg-brand-light dark:bg-brand-dark py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs block mb-3">Castack Insights</span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-6">
            Insights & Guides
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Technical research and engineering guidelines on agentic AI, database modular structures, and high-fidelity frontends.
          </p>
        </div>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-16 flex gap-2">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-4 py-3 rounded-xl border border-slate-200 dark:border-brand-darkBorder text-sm bg-white dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none"
          />
          <button
            type="submit"
            className="bg-brand-orange hover:bg-brand-orangeHover text-white px-5 rounded-xl font-bold text-xs cursor-none transition-transform hover:scale-[1.02]"
          >
            Search
          </button>
        </form>

        {/* ARTICLES GRID */}
        {blogsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(n => (
              <div key={n} className="bg-white dark:bg-brand-darkCard rounded-2xl border border-slate-200/50 dark:border-brand-darkBorder animate-pulse p-6">
                <div className="aspect-video w-full bg-slate-200 dark:bg-brand-darkBorder rounded-xl mb-4" />
                <div className="h-6 w-3/4 bg-slate-100 dark:bg-brand-darkBorder rounded mb-2" />
                <div className="h-4 w-full bg-slate-50 dark:bg-brand-darkBorder rounded" />
              </div>
            ))}
          </div>
        ) : blogsError ? (
          <div className="p-8 border border-red-500/20 bg-red-500/10 text-red-500 rounded-2xl text-center font-bold">
            Error loading articles: {blogsError}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-brand-darkCard rounded-2xl border border-slate-200/50">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h4 className="font-bold text-slate-800 dark:text-white text-base">No articles found</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Try resetting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="group bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                
                <div>
                  {/* Cover Frame */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-brand-darkBorder/20">
                    <img
                      src={blog.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>

                  {/* Metadata and Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-4">
                      <span className="flex items-center gap-1"><User size={12} /> {blog.author.split(',')[0]}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime || '3 min read'}</span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="group/btn inline-flex items-center gap-1 bg-slate-900 hover:bg-brand-orange text-white dark:bg-brand-darkBorder dark:hover:bg-brand-orange px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-none"
                  >
                    Read Article <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
