import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore.js';
import api from '../../services/api.js';
import { 
  ShieldAlert, LayoutDashboard, Briefcase, FileText, MessageSquare, BookOpen, 
  Plus, LogOut, Trash2, Edit3, Eye, FileDown, CheckCircle2, XCircle, AlertCircle, Sparkles, Send
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, token, logout, isAuthenticated } = useStore();
  const navigate = useNavigate();

  // Tab state: 'overview' | 'jobs' | 'applicants' | 'blogs' | 'inquiries'
  const [activeTab, setActiveTab] = useState('overview');

  // Unified list states
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dynamic popup modals
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '', department: 'AI & Intelligence Systems', location: 'Bengaluru, India',
    type: 'Full-time', workplace: 'Hybrid', experienceLevel: 'Mid',
    salaryRange: '', skillsRequired: '', requirements: '', responsibilities: '',
    description: '', status: 'Published'
  });

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '', summary: '', content: '', coverImage: '', tags: '', author: 'Admin Developer', status: 'Published'
  });

  // Candidate detail visualizer modal
  const [activeCandidate, setActiveCandidate] = useState(null);

  // Redirect if not authorized
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Pull all indices concurrently
      const [jobsRes, appsRes, blogsRes, inqRes] = await Promise.all([
        api.get('/jobs?isAdminFlow=true'),
        api.get('/applications'),
        api.get('/blogs?isAdminFlow=true'),
        api.get('/inquiries')
      ]);
      setJobs(jobsRes.jobs || []);
      setApplicants(appsRes.applications || []);
      setBlogs(blogsRes.blogs || []);
      setInquiries(inqRes.inquiries || []);
    } catch (err) {
      console.error('Error fetching dashboard indices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/admin');
  };

  // --- JOBS CRUD ACTIONS ---
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const skillsRequiredArray = jobForm.skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
    const requirementsArray = jobForm.requirements.split('\n').map(s => s.trim()).filter(Boolean);
    const responsibilitiesArray = jobForm.responsibilities.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...jobForm,
      skillsRequired: skillsRequiredArray,
      requirements: requirementsArray,
      responsibilities: responsibilitiesArray
    };

    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      setJobModalOpen(false);
      fetchDashboardData();
      resetJobForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const editJob = (job) => {
    setEditingJobId(job._id);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      workplace: job.workplace,
      experienceLevel: job.experienceLevel,
      salaryRange: job.salaryRange || '',
      skillsRequired: job.skillsRequired.join(', '),
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
      description: job.description,
      status: job.status
    });
    setJobModalOpen(true);
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Remove this career opening? This will permanently delete the post.')) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetJobForm = () => {
    setEditingJobId(null);
    setJobForm({
      title: '', department: 'AI & Intelligence Systems', location: 'Bengaluru, India',
      type: 'Full-time', workplace: 'Hybrid', experienceLevel: 'Mid',
      salaryRange: '', skillsRequired: '', requirements: '', responsibilities: '',
      description: '', status: 'Published'
    });
  };

  // --- BLOGS CRUD ACTIONS ---
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlogId) {
        await api.put(`/blogs/${editingBlogId}`, blogForm);
      } else {
        await api.post('/blogs', blogForm);
      }
      setBlogModalOpen(false);
      fetchDashboardData();
      resetBlogForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const editBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      coverImage: blog.coverImage || '',
      tags: blog.tags.join(', '),
      author: blog.author,
      status: blog.status
    });
    setBlogModalOpen(true);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this article from backend database?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: '', summary: '', content: '', coverImage: '', tags: '', author: 'Admin Developer', status: 'Published'
    });
  };

  // --- CANDIDATE APPLICATIONS ACTIONS ---
  const updateCandidateStage = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      fetchDashboardData();
      if (activeCandidate && activeCandidate._id === id) {
        setActiveCandidate({ ...activeCandidate, status });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // --- CONTACT INQUIRY ACTIONS ---
  const updateInquiryStatus = async (id, status) => {
    try {
      await api.patch(`/inquiries/${id}`, { status });
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Dashboard calculations for Overview
  const avgATS = applicants.length > 0
    ? Math.round(applicants.reduce((sum, a) => sum + a.atsScore, 0) / applicants.length)
    : 0;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-brand-dark flex flex-col lg:flex-row select-none">
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className="w-full lg:w-64 bg-white dark:bg-brand-darkCard border-r border-slate-200 dark:border-brand-darkBorder p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 pb-6 border-b border-slate-100 dark:border-brand-darkBorder mb-8">
            <div className="p-2 bg-orange-500/10 text-brand-orange border border-orange-500/20 rounded-lg">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="font-display font-black text-slate-800 dark:text-white text-sm">Castack Hub</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Console V1.0</span>
            </div>
          </div>

          {/* Tab buttons */}
          <nav className="flex flex-col gap-2">
            {[
              { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={16} /> },
              { id: 'jobs', name: 'Careers CRUD', icon: <Briefcase size={16} /> },
              { id: 'applicants', name: 'Applicants & ATS', icon: <FileText size={16} /> },
              { id: 'blogs', name: 'Blogs Editor', icon: <BookOpen size={16} /> },
              { id: 'inquiries', name: 'Client Inquiries', icon: <MessageSquare size={16} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold cursor-none transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-orange text-white'
                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-brand-darkBorder/40'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 dark:border-brand-darkBorder pt-6 mt-8">
          <div className="text-xs mb-4">
            <p className="font-bold text-slate-700 dark:text-slate-300 font-mono truncate">{user?.username}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors text-xs font-bold cursor-none"
          >
            <LogOut size={14} /> Exit Console
          </button>
        </div>
      </aside>

      {/* 2. MAIN HUB WORKSPACE */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            {/* Widget grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Careers */}
              <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-slate-200/50 dark:border-brand-darkBorder/60 shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Open Positions</span>
                <h3 className="text-3xl font-black font-display text-slate-800 dark:text-white mb-2">{jobs.length}</h3>
                <span className="text-[10px] font-bold text-brand-orange bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Catalog active</span>
              </div>

              {/* Card 2: Applicants */}
              <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-slate-200/50 dark:border-brand-darkBorder/60 shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Applicants</span>
                <h3 className="text-3xl font-black font-display text-slate-800 dark:text-white mb-2">{applicants.length}</h3>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Resume parser live</span>
              </div>

              {/* Card 3: Average ATS */}
              <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-slate-200/50 dark:border-brand-darkBorder/60 shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Avg ATS Grade</span>
                <h3 className="text-3xl font-black font-display text-slate-800 dark:text-white mb-2">{avgATS}%</h3>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-semibold">Match score benchmark</span>
              </div>

              {/* Card 4: Inquiries */}
              <div className="bg-white dark:bg-brand-darkCard p-6 rounded-2xl border border-slate-200/50 dark:border-brand-darkBorder/60 shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Client Requests</span>
                <h3 className="text-3xl font-black font-display text-slate-800 dark:text-white mb-2">{inquiries.length}</h3>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Tickets tracked</span>
              </div>

            </div>

            {/* Quick table views */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Applicants */}
              <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-6 rounded-2xl shadow-sm">
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-brand-darkBorder/40 pb-3">Recent Candidate Submissions</h3>
                <div className="flex flex-col gap-4">
                  {applicants.slice(0, 4).map(app => (
                    <div key={app._id} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{app.candidateName}</p>
                        <p className="text-slate-400 font-mono text-[10px]">{app.jobId?.title || 'Unknown Job'}</p>
                      </div>
                      <span className="font-bold font-display text-brand-orange bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                        {app.atsScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder p-6 rounded-2xl shadow-sm">
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-brand-darkBorder/40 pb-3">Unresolved Inquiries</h3>
                <div className="flex flex-col gap-4">
                  {inquiries.filter(i => i.status !== 'Resolved').slice(0, 4).map(inq => (
                    <div key={inq._id} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{inq.name} - <span className="font-semibold text-slate-400">[{inq.category}]</span></p>
                        <p className="text-slate-400 truncate max-w-[200px]">{inq.subject}</p>
                      </div>
                      <span className="font-bold text-xs uppercase px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded">
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: JOBS CRUD MANAGER */}
        {activeTab === 'jobs' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-brand-darkBorder pb-4">
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">Careers Catalog Manager</h2>
              <button
                onClick={() => { resetJobForm(); setJobModalOpen(true); }}
                className="flex items-center gap-1 bg-brand-orange hover:bg-brand-orangeHover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-transform cursor-none duration-200 hover:scale-[1.03]"
              >
                <Plus size={14} /> Add Role Posting
              </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-brand-darkBorder/40 border-b border-slate-100 dark:border-brand-darkBorder text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4">Division</th>
                    <th className="p-4">Setting</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} className="border-b border-slate-100 dark:border-brand-darkBorder/40 text-slate-600 dark:text-slate-300">
                      <td className="p-4 font-bold">{job.title}</td>
                      <td className="p-4">{job.department}</td>
                      <td className="p-4">{job.workplace}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          job.status === 'Published' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-300/10 text-slate-400 border border-slate-300/20'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 flex items-center justify-center gap-3">
                        <button onClick={() => editJob(job)} className="p-1.5 hover:text-brand-orange cursor-none" aria-label="Edit"><Edit3 size={14} /></button>
                        <button onClick={() => deleteJob(job._id)} className="p-1.5 hover:text-red-500 cursor-none" aria-label="Delete"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICANTS & ATS INSIGHTS */}
        {activeTab === 'applicants' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-200 dark:border-brand-darkBorder pb-4">
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">Applicants & Resumes Ledger</h2>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-brand-darkBorder/40 border-b border-slate-100 dark:border-brand-darkBorder text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Job Role</th>
                    <th className="p-4">ATS Grade</th>
                    <th className="p-4">Hiring Stage</th>
                    <th className="p-4 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(app => (
                    <tr key={app._id} className="border-b border-slate-100 dark:border-brand-darkBorder/40 text-slate-600 dark:text-slate-300">
                      <td className="p-4">
                        <p className="font-bold">{app.candidateName}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{app.candidateEmail}</p>
                      </td>
                      <td className="p-4 font-semibold">{app.jobId?.title || 'Inactive Role'}</td>
                      <td className="p-4">
                        <span className="font-bold text-xs text-brand-orange bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                          {app.atsScore}% Match
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => updateCandidateStage(app._id, e.target.value)}
                          className="px-2 py-1 border border-slate-200 dark:border-brand-darkBorder/80 rounded-lg bg-slate-50 dark:bg-brand-dark focus:outline-none text-[11px] font-semibold cursor-none"
                        >
                          {['Applied', 'Reviewing', 'Shortlisted', 'Rejected'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setActiveCandidate(app)}
                          className="flex items-center gap-1 mx-auto bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-700 dark:bg-brand-darkBorder/40 dark:text-slate-300 px-3.5 py-1.5 rounded-full text-[10px] font-bold cursor-none"
                        >
                          <Eye size={12} /> Diagnostic Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BLOGS EDITOR */}
        {activeTab === 'blogs' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-brand-darkBorder pb-4">
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">Insights Blog Editor</h2>
              <button
                onClick={() => { resetBlogForm(); setBlogModalOpen(true); }}
                className="flex items-center gap-1 bg-brand-orange hover:bg-brand-orangeHover text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-transform cursor-none duration-200 hover:scale-[1.03]"
              >
                <Plus size={14} /> Draft Article
              </button>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-brand-darkBorder/40 border-b border-slate-100 dark:border-brand-darkBorder text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Read Time</th>
                    <th className="p-4">State</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(blog => (
                    <tr key={blog._id} className="border-b border-slate-100 dark:border-brand-darkBorder/40 text-slate-600 dark:text-slate-300">
                      <td className="p-4 font-bold">{blog.title}</td>
                      <td className="p-4">{blog.author}</td>
                      <td className="p-4 font-mono">{blog.readTime || 'Autocalc...'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          blog.status === 'Published' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-300/10 text-slate-400 border border-slate-300/20'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-4 flex items-center justify-center gap-3">
                        <button onClick={() => editBlog(blog)} className="p-1.5 hover:text-brand-orange cursor-none" aria-label="Edit"><Edit3 size={14} /></button>
                        <button onClick={() => deleteBlog(blog._id)} className="p-1.5 hover:text-red-500 cursor-none" aria-label="Delete"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CLIENT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="border-b border-slate-200 dark:border-brand-darkBorder pb-4">
              <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">Client Inquiry Inbox</h2>
            </div>

            {/* List */}
            <div className="flex flex-col gap-6">
              {inquiries.map(inq => (
                <div
                  key={inq._id}
                  className="bg-white dark:bg-brand-darkCard border border-slate-200/50 dark:border-brand-darkBorder/60 p-6 rounded-2xl flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">
                        {inq.subject}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Client: <strong className="text-slate-600 dark:text-slate-300">{inq.name}</strong> ({inq.email}) {inq.company ? `at ${inq.company}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-brand-orange uppercase px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded">
                        {inq.category}
                      </span>
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq._id, e.target.value)}
                        className="px-2 py-1 border border-slate-200 dark:border-brand-darkBorder/80 rounded-lg bg-slate-50 dark:bg-brand-dark focus:outline-none text-[11px] font-semibold cursor-none"
                      >
                        {['New', 'In-Progress', 'Resolved'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-brand-darkBorder/20 p-4 rounded-xl border border-slate-100 dark:border-brand-darkBorder/30">
                    {inq.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* --- DYNAMIC DIAGNOSTIC REPORT MODAL (APPLICANTS) --- */}
      {activeCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-3xl bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setActiveCandidate(null)}
              className="absolute right-6 top-6 p-2 rounded-full border border-slate-100 dark:border-brand-darkBorder text-slate-400 hover:text-brand-orange cursor-none"
            >
              <X size={16} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider block mb-1">Candidate Profile</span>
              <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-white">
                {activeCandidate.candidateName}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">{activeCandidate.candidateEmail} {activeCandidate.candidatePhone ? `| ${activeCandidate.candidatePhone}` : ''}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start mb-6 border-b border-slate-100 dark:border-brand-darkBorder pb-6">
              {/* Circular matches */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-brand-darkBorder/20 p-5 rounded-2xl border border-slate-100 dark:border-brand-darkBorder/30">
                <span className="text-4xl font-black font-display text-brand-orange leading-none">{activeCandidate.atsScore}%</span>
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs">ATS Relevance Match</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-0.5">Calculated relative to target skills required.</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex flex-col gap-1.5 p-5 border border-slate-100 dark:border-brand-darkBorder rounded-2xl bg-white dark:bg-brand-darkCard justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Hiring Stage</span>
                <select
                  value={activeCandidate.status}
                  onChange={(e) => updateCandidateStage(activeCandidate._id, e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-brand-darkBorder/80 rounded-xl bg-slate-50 dark:bg-brand-dark focus:outline-none text-xs font-bold cursor-none mt-1"
                >
                  {['Applied', 'Reviewing', 'Shortlisted', 'Rejected'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ATS Diagnostics Detailed Grid */}
            <div className="flex flex-col gap-6">
              
              {/* Recommendations Suggestions */}
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-3">Diagnostic Recommendations</h4>
                <div className="flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  {activeCandidate.atsReport?.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-2 items-start p-3 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                      <Sparkles size={12} className="text-brand-orange shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaps segment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 dark:border-brand-darkBorder/40 pt-6">
                
                {/* Missing Skills */}
                <div>
                  <h4 className="font-bold text-red-500 text-xs uppercase tracking-wider mb-3">Missing Target Keywords</h4>
                  {activeCandidate.atsReport?.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {activeCandidate.atsReport.missingKeywords.map(k => (
                        <span key={k} className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded text-[10px] font-bold">{k}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic">All required skills were successfully parsed.</p>
                  )}
                </div>

                {/* Cover letter */}
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider mb-2">Candidate Cover Letter</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap bg-slate-50 dark:bg-brand-darkBorder/20 p-3 rounded-xl">
                    {activeCandidate.coverLetter || 'No cover letter provided.'}
                  </p>
                </div>

              </div>

              {/* Download File trigger */}
              <a
                href={`http://localhost:5000/api/applications/${activeCandidate._id}/resume`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-brand-orange text-white py-3.5 rounded-xl font-bold transition-all duration-200 cursor-none mt-4 text-xs"
              >
                <FileDown size={14} /> Download Original Candidate Resume
              </a>

            </div>
          </div>
        </div>
      )}

      {/* --- DYNAMIC CREATE JOB DIALOG --- */}
      {jobModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setJobModalOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-full border border-slate-100 dark:border-brand-darkBorder text-slate-400 hover:text-brand-orange cursor-none"
            >
              <X size={16} />
            </button>

            <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-6">
              {editingJobId ? 'Edit Job Posting' : 'Draft New Career Posting'}
            </h2>

            <form onSubmit={handleJobSubmit} className="flex flex-col gap-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Role Title *</label>
                  <input
                    type="text" required
                    placeholder="e.g. Lead AI Systems Engineer"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  />
                </div>

                {/* Division */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Division *</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  >
                    <option value="AI & Intelligence Systems">AI & Intelligence Systems</option>
                    <option value="SaaS Products & Agency Core">SaaS Products & Agency Core</option>
                    <option value="Product Experience Design">Product Experience Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Location *</label>
                  <input
                    type="text" required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  />
                </div>

                {/* Setting */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Workplace Model *</label>
                  <select
                    value={jobForm.workplace}
                    onChange={(e) => setJobForm({ ...jobForm, workplace: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Employment Type *</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Level */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Seniority Level *</label>
                  <select
                    value={jobForm.experienceLevel}
                    onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>

                {/* Salary */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹20L - ₹30L per annum"
                    value={jobForm.salaryRange}
                    onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Status *</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide flex justify-between">Skills Required <span className="text-[10px] text-slate-400 capitalize">(comma separated)</span></label>
                <input
                  type="text" required
                  placeholder="e.g. React.js, Express, MongoDB, Node.js"
                  value={jobForm.skillsRequired}
                  onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                />
              </div>

              {/* Minimum qualifications */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide flex justify-between">Requirements Checklist <span className="text-[10px] text-slate-400 capitalize">(one per line)</span></label>
                <textarea
                  rows={3} required
                  placeholder="e.g. 5+ years of software engineering experience."
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs resize-none"
                />
              </div>

              {/* Responsibilities */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide flex justify-between">Key Responsibilities <span className="text-[10px] text-slate-400 capitalize">(one per line)</span></label>
                <textarea
                  rows={3} required
                  placeholder="e.g. Architect and deploy high-fidelity backend servers."
                  value={jobForm.responsibilities}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs resize-none"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Main Job Description (Supports Markdown) *</label>
                <textarea
                  rows={5} required
                  placeholder="### Overview\n..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-bold transition-transform cursor-none duration-200 hover:scale-[1.02] mt-2 shadow-lg"
              >
                {editingJobId ? 'Save Role Updates' : 'Publish Open Role'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DYNAMIC CREATE BLOG DIALOG --- */}
      {blogModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-brand-darkCard border border-slate-200 dark:border-brand-darkBorder rounded-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setBlogModalOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-full border border-slate-100 dark:border-brand-darkBorder text-slate-400 hover:text-brand-orange cursor-none"
            >
              <X size={16} />
            </button>

            <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white mb-6">
              {editingBlogId ? 'Edit Blog Article' : 'Draft New Blog Article'}
            </h2>

            <form onSubmit={handleBlogSubmit} className="flex flex-col gap-5 text-xs">
              
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Article Title *</label>
                <input
                  type="text" required
                  placeholder="e.g. The Future of MERN Apps"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Author */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Author Name *</label>
                  <input
                    type="text" required
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wide">Status *</label>
                  <select
                    value={blogForm.status}
                    onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={blogForm.coverImage}
                  onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide flex justify-between">Tags <span className="text-[10px] text-slate-400 capitalize">(comma separated)</span></label>
                <input
                  type="text"
                  placeholder="e.g. AI, Web Design, SaaS"
                  value={blogForm.tags}
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs"
                />
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Summary (Fewer than 150 words) *</label>
                <textarea
                  rows={2} required
                  placeholder="Brief summary sentence..."
                  value={blogForm.summary}
                  onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs resize-none"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-wide">Main Article Content (Supports Markdown) *</label>
                <textarea
                  rows={8} required
                  placeholder="### Heading..."
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-brand-darkBorder bg-slate-50/50 dark:bg-brand-dark focus:outline-none focus:border-brand-orange transition-colors cursor-none text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-bold transition-transform cursor-none duration-200 hover:scale-[1.02] mt-2 shadow-lg"
              >
                {editingBlogId ? 'Save Article Updates' : 'Publish Article'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
