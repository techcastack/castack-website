import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore.js';

// Common structures
import SmoothScroll from './components/common/SmoothScroll.jsx';
import CustomCursor from './components/common/CustomCursor.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import PageTransition from './components/common/PageTransition.jsx';

// Lazy loading feature pages to satisfy performance metrics (Lighthouse 90+)
const Home = React.lazy(() => import('./features/home/Home.jsx'));
const About = React.lazy(() => import('./features/about/About.jsx'));
const Services = React.lazy(() => import('./features/services/Services.jsx'));
const Portfolio = React.lazy(() => import('./features/portfolio/Portfolio.jsx'));
const Blog = React.lazy(() => import('./features/blog/Blog.jsx'));
const BlogDetails = React.lazy(() => import('./features/blog/BlogDetails.jsx'));
const Careers = React.lazy(() => import('./features/careers/Careers.jsx'));
const JobDetails = React.lazy(() => import('./features/careers/JobDetails.jsx'));
const ATSChecker = React.lazy(() => import('./features/ats/ATSChecker.jsx'));
const Contact = React.lazy(() => import('./features/contact/Contact.jsx'));
const Privacy = React.lazy(() => import('./features/legal/Privacy.jsx'));
const Terms = React.lazy(() => import('./features/legal/Terms.jsx'));
const Policy = React.lazy(() => import('./features/legal/Policy.jsx'));
const AdminLogin = React.lazy(() => import('./features/dashboard/AdminLogin.jsx'));
const AdminDashboard = React.lazy(() => import('./features/dashboard/AdminDashboard.jsx'));

// Glowing premium Loader
function SuspenseLoader() {
  return (
    <div className="w-full min-h-screen bg-brand-dark flex flex-col items-center justify-center gap-4 relative overflow-hidden">
      {/* Glow decorative blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Animated spinner */}
      <div className="w-12 h-12 border-2 border-brand-darkBorder border-t-brand-orange rounded-full animate-spin" />
      
      {/* Fading luxury text */}
      <div className="font-display font-medium text-[13px] tracking-widest text-slate-400 uppercase animate-pulse">
        Castack Technologies
      </div>
    </div>
  );
}

// ScrollToTop on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper for transition triggers
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Core Pages */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogDetails /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/careers/:id" element={<PageTransition><JobDetails /></PageTransition>} />
        <Route path="/ats" element={<PageTransition><ATSChecker /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        
        {/* Legal Pages */}
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/policy" element={<PageTransition><Policy /></PageTransition>} />
        
        {/* Admin Portals */}
        <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { initTheme, checkAuth } = useStore();

  useEffect(() => {
    initTheme();
    checkAuth(); // Check JWT validity on load
  }, [initTheme, checkAuth]);

  return (
    <Router>
      <ScrollToTop />
      <SmoothScroll>
        <div className="relative flex flex-col min-h-screen">
          {/* Custom Mouse Cursor */}
          <CustomCursor />
          
          {/* Sticky Navigation */}
          <Navbar />
          
          {/* Main workspace */}
          <main className="flex-grow pt-[74px] md:pt-[80px]">
            <Suspense fallback={<SuspenseLoader />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </SmoothScroll>
    </Router>
  );
}
