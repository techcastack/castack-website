import { create } from 'zustand';
import api from '../services/api.js';

export const useStore = create((set, get) => ({
  // --- AUTH STATE ---
  user: JSON.parse(localStorage.getItem('castack_user')) || null,
  token: localStorage.getItem('castack_token') || null,
  isAuthenticated: !!localStorage.getItem('castack_token'),
  authLoading: false,
  authError: null,

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response;
      
      localStorage.setItem('castack_token', token);
      localStorage.setItem('castack_user', JSON.stringify(user));
      
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        authLoading: false 
      });
      return user;
    } catch (error) {
      set({ authError: error.message, authLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('castack_token');
    localStorage.removeItem('castack_user');
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false, 
      authError: null 
    });
  },

  checkAuth: async () => {
    if (!get().token) return;
    set({ authLoading: true });
    try {
      const response = await api.get('/auth/profile');
      set({ user: response.user, isAuthenticated: true, authLoading: false });
    } catch (error) {
      // Token probably expired or invalid, wipe local storage
      get().logout();
      set({ authLoading: false });
    }
  },

  // --- THEME STATE ---
  darkMode: localStorage.getItem('castack_theme') !== 'light', // Default to Dark mode for luxury premium look!
  
  toggleDarkMode: () => {
    const isDark = !get().darkMode;
    localStorage.setItem('castack_theme', isDark ? 'dark' : 'light');
    set({ darkMode: isDark });
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  initTheme: () => {
    const isDark = get().darkMode;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // --- JOBS STATE ---
  jobs: [],
  currentJob: null,
  jobsLoading: false,
  jobsError: null,

  fetchJobs: async (filters = {}) => {
    set({ jobsLoading: true, jobsError: null });
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) queryParams.append(key, val);
      });
      const response = await api.get(`/jobs?${queryParams.toString()}`);
      set({ jobs: response.jobs, jobsLoading: false });
    } catch (error) {
      set({ jobsError: error.message, jobsLoading: false });
    }
  },

  fetchJobDetails: async (id) => {
    set({ jobsLoading: true, jobsError: null });
    try {
      const response = await api.get(`/jobs/${id}`);
      set({ currentJob: response.job, jobsLoading: false });
      return response.job;
    } catch (error) {
      set({ jobsError: error.message, jobsLoading: false });
      throw error;
    }
  },

  // --- BLOGS STATE ---
  blogs: [],
  currentBlog: null,
  blogsLoading: false,
  blogsError: null,

  fetchBlogs: async (filters = {}) => {
    set({ blogsLoading: true, blogsError: null });
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) queryParams.append(key, val);
      });
      const response = await api.get(`/blogs?${queryParams.toString()}`);
      set({ blogs: response.blogs, blogsLoading: false });
    } catch (error) {
      set({ blogsError: error.message, blogsLoading: false });
    }
  },

  fetchBlogDetails: async (slug) => {
    set({ blogsLoading: true, blogsError: null });
    try {
      const response = await api.get(`/blogs/${slug}`);
      set({ currentBlog: response.blog, blogsLoading: false });
      return response.blog;
    } catch (error) {
      set({ blogsError: error.message, blogsLoading: false });
      throw error;
    }
  },

  // --- ATS RESUME CHECKER STATE ---
  atsReport: null,
  atsLoading: false,
  atsError: null,

  runStandaloneATSCheck: async (resumeFile, jobTitle, jobDescription, skillsRequired) => {
    set({ atsLoading: true, atsError: null, atsReport: null });
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);
      formData.append('skillsRequired', skillsRequired);

      const response = await api.post('/applications/ats-check-standalone', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ atsReport: response.atsReport, atsLoading: false });
      return response;
    } catch (error) {
      set({ atsError: error.message, atsLoading: false });
      throw error;
    }
  },

  submitJobApplication: async (resumeFile, candidateName, candidateEmail, candidatePhone, coverLetter, jobId) => {
    set({ atsLoading: true, atsError: null });
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('candidateName', candidateName);
      formData.append('candidateEmail', candidateEmail);
      formData.append('candidatePhone', candidatePhone);
      formData.append('coverLetter', coverLetter);
      formData.append('jobId', jobId);

      const response = await api.post('/applications/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ atsReport: response.atsReport, atsLoading: false });
      return response;
    } catch (error) {
      set({ atsError: error.message, atsLoading: false });
      throw error;
    }
  },

  clearATSState: () => {
    set({ atsReport: null, atsError: null });
  }
}));
