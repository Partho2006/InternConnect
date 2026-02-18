import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import SubscriptionBanner from '../components/subscription/SubscriptionBanner';
import CompanyAnalytics from '../components/analytics/CompanyAnalytics';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending:  { label: 'Pending',  badge: 'bg-yellow-100 text-yellow-800 border-yellow-300', dot: 'bg-yellow-400', row: 'border-l-yellow-400' },
  accepted: { label: 'Accepted', badge: 'bg-green-100  text-green-800  border-green-300',  dot: 'bg-green-500',  row: 'border-l-green-500'  },
  rejected: { label: 'Rejected', badge: 'bg-red-100    text-red-800    border-red-300',    dot: 'bg-red-500',    row: 'border-l-red-500'    },
};

// ─── Profile Drawer ───────────────────────────────────────────────────────────
const ProfileDrawer = ({ app, onClose, onStatusUpdate }) => {
  if (!app) return null;
  const s = STATUS[app.status] || STATUS.pending;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-left">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-black">
              {app.student?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">{app.student?.name}</h2>
              <p className="text-purple-200 text-sm">{app.student?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Status + date */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${s.badge}`}>
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
            </span>
          </div>

          {/* Internship applied for */}
          {app.internship && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm">
              <p className="text-xs text-purple-500 font-bold uppercase tracking-wide mb-1">Applied For</p>
              <p className="font-bold text-purple-900">{app.internship.title}</p>
            </div>
          )}

          {/* Contact */}
          <section className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</h3>
            <a href={`mailto:${app.student?.email}`} className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition text-sm">
              <EnvelopeIcon className="h-5 w-5 text-purple-400 shrink-0" />{app.student?.email}
            </a>
            {app.student?.phone && (
              <a href={`tel:${app.student.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition text-sm">
                <PhoneIcon className="h-5 w-5 text-purple-400 shrink-0" />{app.student.phone}
              </a>
            )}
            {app.student?.portfolio && (
              <a href={app.student.portfolio} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-600 hover:text-purple-800 font-semibold transition text-sm">
                <GlobeAltIcon className="h-5 w-5 shrink-0" />View Portfolio ↗
              </a>
            )}
          </section>

          {/* Education */}
          {app.student?.education && (
            <section className="bg-blue-50 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Education</h3>
              <p className="text-gray-800 text-sm">{app.student.education}</p>
            </section>
          )}

          {/* Skills */}
          {app.student?.skills?.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {app.student.skills.map((sk, i) => (
                  <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-semibold">{sk}</span>
                ))}
              </div>
            </section>
          )}

          {/* Resume */}
          {app.resumeUrl ? (
            <section className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Resume</p>
                    <p className="text-xs text-gray-500 break-all">{app.resumeOriginalName || 'resume.pdf'}</p>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000${app.resumeUrl}`}
                  target="_blank" rel="noopener noreferrer" download
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />Download
                </a>
              </div>
            </section>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
              ⚠️ No resume uploaded
            </div>
          )}

          {/* Cover Letter */}
          {app.coverLetter && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-400" />Cover Letter
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {app.coverLetter}
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        {app.status === 'pending' ? (
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
            <button
              onClick={() => { onStatusUpdate(app._id, 'accepted'); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black transition shadow-md"
            >
              <CheckCircleIcon className="h-5 w-5" />Accept
            </button>
            <button
              onClick={() => { onStatusUpdate(app._id, 'rejected'); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black transition shadow-md"
            >
              <XCircleIcon className="h-5 w-5" />Reject
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 border-t bg-gray-50">
            <p className={`text-center font-bold text-sm ${app.status === 'accepted' ? 'text-green-700' : 'text-red-700'}`}>
              {app.status === 'accepted' ? '✓ This applicant has been accepted' : '✗ This applicant has been rejected'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Applicants Panel (shown when a company selects an internship) ─────────────
const ApplicantsPanel = ({ internship, onBack, allApps, onStatusUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  const apps = allApps[internship._id] || [];

  const filtered = apps.filter(app => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q ||
      app.student?.name?.toLowerCase().includes(q) ||
      app.student?.email?.toLowerCase().includes(q) ||
      app.student?.skills?.some(s => s.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:    apps.length,
    pending:  apps.filter(a => a.status === 'pending').length,
    accepted: apps.filter(a => a.status === 'accepted').length,
    rejected: apps.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="animate-fade-in">
      {/* Panel Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5">
          <button onClick={onBack} className="flex items-center gap-2 text-purple-200 hover:text-white mb-4 font-semibold transition text-sm">
            <ArrowLeftIcon className="h-4 w-4" />Back to My Postings
          </button>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">{internship.title}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-purple-200 text-sm">📍 {internship.location}</span>
                <span className="text-purple-200 text-sm">💰 ₹{internship.stipend?.toLocaleString()}/mo</span>
                <span className="text-purple-200 text-sm capitalize">🏢 {internship.type}</span>
              </div>
            </div>
            <Link
              to={`/internships/${internship._id}`}
              className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2"
            >
              <EyeIcon className="h-4 w-4" />View Posting
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {[
            { key: 'all',      label: 'Total',    val: stats.total,    color: 'text-gray-900'   },
            { key: 'pending',  label: 'Pending',  val: stats.pending,  color: 'text-yellow-600' },
            { key: 'accepted', label: 'Accepted', val: stats.accepted, color: 'text-green-600'  },
            { key: 'rejected', label: 'Rejected', val: stats.rejected, color: 'text-red-600'    },
          ].map(pill => (
            <button
              key={pill.key}
              onClick={() => setStatusFilter(pill.key)}
              className={`py-4 text-center transition-all ${statusFilter === pill.key ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
            >
              <div className={`text-2xl font-black ${pill.color}`}>{pill.val}</div>
              <div className={`text-xs font-semibold mt-0.5 ${statusFilter === pill.key ? 'text-purple-600' : 'text-gray-500'}`}>{pill.label}</div>
              {statusFilter === pill.key && <div className="h-0.5 bg-purple-600 mt-3 mx-4 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or skill…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm shadow-sm"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Applicant List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
          <UserGroupIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold text-lg">
            {apps.length === 0 ? 'No applications yet' : 'No results match your filters'}
          </p>
          {apps.length > 0 && (
            <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
              className="mt-3 text-sm text-purple-600 hover:underline font-semibold">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 font-medium px-1">
            Showing {filtered.length} of {apps.length} applicant{apps.length !== 1 ? 's' : ''}
          </p>
          {filtered.map((app, i) => {
            const s = STATUS[app.status] || STATUS.pending;
            return (
              <div
                key={app._id}
                className={`bg-white rounded-xl border-2 border-l-4 ${s.row} border-gray-100 p-5 hover:shadow-md transition-all group`}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Avatar */}
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow">
                    {app.student?.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-gray-900">{app.student?.name}</h4>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <EnvelopeIcon className="h-3.5 w-3.5 shrink-0" />{app.student?.email}
                    </p>
                    {app.student?.education && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <AcademicCapIcon className="h-3.5 w-3.5 shrink-0" />{app.student.education}
                      </p>
                    )}
                    {/* Skills */}
                    {app.student?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {app.student.skills.slice(0, 4).map((sk, idx) => (
                          <span key={idx} className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md text-xs font-semibold">{sk}</span>
                        ))}
                        {app.student.skills.length > 4 && (
                          <span className="text-xs text-gray-400">+{app.student.skills.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Applied date */}
                  <div className="text-xs text-gray-400 shrink-0 text-right hidden sm:block">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl font-bold text-sm transition"
                    >
                      <EyeIcon className="h-4 w-4" />View
                    </button>

                    {app.resumeUrl && (
                      <a
                        href={`http://localhost:5000${app.resumeUrl}`}
                        target="_blank" rel="noopener noreferrer" download
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-xl font-bold text-sm transition"
                        title="Download Resume"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />CV
                      </a>
                    )}

                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onStatusUpdate(app._id, 'accepted', internship._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition"
                          title="Accept"
                        >
                          <CheckCircleIcon className="h-4 w-4" />Accept
                        </button>
                        <button
                          onClick={() => onStatusUpdate(app._id, 'rejected', internship._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition"
                          title="Reject"
                        >
                          <XCircleIcon className="h-4 w-4" />Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Drawer */}
      {selectedApp && (
        <ProfileDrawer
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusUpdate={(appId, status) => {
            onStatusUpdate(appId, status, internship._id);
            setSelectedApp(prev => ({ ...prev, status }));
          }}
        />
      )}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const CompanyDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState({});
  const [allApplications, setAllApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingId, setEditingId] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null); // for applicants panel
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '', description: '', skills: '', duration: '',
    stipend: '', location: '', type: 'remote', status: 'active'
  });

  useEffect(() => { fetchMyInternships(); }, []);
  useEffect(() => { if (internships.length > 0) fetchAllApplications(); }, [internships]);

  const fetchMyInternships = async () => {
    try {
      const res = await axios.get('/internships/company/my-internships');
      setInternships(res.data);
      const appsData = {};
      for (const internship of res.data) {
        try {
          const appRes = await axios.get(`/applications/internship/${internship._id}`);
          appsData[internship._id] = appRes.data;
        } catch { appsData[internship._id] = []; }
      }
      setApplications(appsData);
      setLoading(false);
    } catch {
      toast.error('Failed to load internships');
      setLoading(false);
    }
  };

  const fetchAllApplications = async () => {
    try {
      const results = await Promise.all(internships.map(i => axios.get(`/applications/internship/${i._id}`)));
      setAllApplications(results.flatMap(r => r.data));
    } catch (err) { console.error('Failed to fetch applications:', err); }
  };

  // Optimistic status update — no full refetch needed
  const handleStatusUpdate = async (applicationId, status, internshipId) => {
    try {
      await axios.patch(`/applications/${applicationId}`, { status });
      toast.success(`Application ${status}!`);
      // Update the applications map in place
      setApplications(prev => ({
        ...prev,
        [internshipId]: (prev[internshipId] || []).map(a =>
          a._id === applicationId ? { ...a, status } : a
        ),
      }));
      setAllApplications(prev => prev.map(a => a._id === applicationId ? { ...a, status } : a));
    } catch {
      toast.error('Failed to update application');
    }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        stipend: Number(formData.stipend),
      };
      if (editingId) {
        await axios.put(`/internships/${editingId}`, dataToSend);
        toast.success('Internship updated successfully!');
      } else {
        await axios.post('/internships', dataToSend);
        toast.success('Internship posted successfully!');
      }
      setShowForm(false); setEditingId(null);
      setFormData({ title:'', description:'', skills:'', duration:'', stipend:'', location:'', type:'remote', status:'active' });
      fetchMyInternships();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save internship');
    }
  };

  const handleEdit = (internship) => {
    setEditingId(internship._id);
    setFormData({
      title: internship.title, description: internship.description,
      skills: internship.skills.join(', '), duration: internship.duration,
      stipend: internship.stipend.toString(), location: internship.location,
      type: internship.type, status: internship.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    try {
      await axios.delete(`/internships/${id}`);
      toast.success('Internship deleted successfully');
      fetchMyInternships();
    } catch { toast.error('Failed to delete internship'); }
  };

  const stats = {
    total: internships.length,
    active: internships.filter(i => i.status === 'active').length,
    totalApplicants: Object.values(applications).reduce((sum, apps) => sum + apps.length, 0),
    pendingApplicants: Object.values(applications).reduce((sum, apps) =>
      sum + apps.filter(app => app.status === 'pending').length, 0),
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SubscriptionBanner />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-slide-up">
              <div className="flex items-center space-x-3 mb-3">
                <BuildingOfficeIcon className="h-10 w-10" />
                <h1 className="text-4xl font-bold">Company Dashboard</h1>
              </div>
              <p className="text-xl text-gray-600">Manage your internship postings and find talented candidates</p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title:'', description:'', skills:'', duration:'', stipend:'', location:'', type:'remote', status:'active' }); }}
              className="hidden md:flex items-center space-x-2 bg-purple-500 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 border border-purple-800 text-black"
            >
              <PlusIcon className="h-5 w-5" /><span>Post New Internship</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { val: stats.total, label: 'Total Postings' },
              { val: stats.active, label: 'Active' },
              { val: stats.totalApplicants, label: 'Total Applicants' },
              { val: stats.pendingApplicants, label: 'Pending Review' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="text-3xl font-bold">{s.val}</div>
                <div className="text-sm text-gray-700">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Post Button */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6">
        <button onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold shadow-xl">
          <PlusIcon className="h-5 w-5" /><span>Post New Internship</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview',  icon: BriefcaseIcon,  label: 'My Postings'  },
              { key: 'analytics', icon: ChartBarIcon,   label: 'Analytics'    },
            ].map(tab => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedInternship(null); }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <div className="flex items-center space-x-2">
                  <tab.icon className="h-5 w-5" /><span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Post / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-slide-down border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Internship' : 'Post New Internship'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. Frontend Developer Intern" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. 3 months" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="Describe the role, responsibilities, and what the intern will learn..." />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills * (comma-separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. React, JavaScript, HTML, CSS" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Stipend (₹) *</label>
                  <input type="number" name="stipend" value={formData.stipend} onChange={handleChange} required min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="10000" />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. Mumbai, India" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Type *</label>
                  <select name="type" value={formData.type} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition">
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition">
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-black rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                  {editingId ? 'Update Internship' : 'Post Internship'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            {/* Applicants Panel (when a posting is selected) */}
            {selectedInternship ? (
              <ApplicantsPanel
                internship={selectedInternship}
                onBack={() => setSelectedInternship(null)}
                allApps={applications}
                onStatusUpdate={handleStatusUpdate}
              />
            ) : (
              /* Internship Cards Grid */
              internships.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                  <BriefcaseIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No internships posted yet</h3>
                  <p className="text-gray-500 mb-6">Start by posting your first internship opportunity</p>
                  <button onClick={() => setShowForm(true)}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                    <PlusIcon className="h-5 w-5" /><span>Post Your First Internship</span>
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {internships.map((internship, index) => {
                    const internshipApps = applications[internship._id] || [];
                    const pendingCount  = internshipApps.filter(a => a.status === 'pending').length;
                    const acceptedCount = internshipApps.filter(a => a.status === 'accepted').length;

                    return (
                      <div key={internship._id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100 animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}>

                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{internship.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                internship.status === 'active' ? 'bg-green-100 text-green-800' :
                                internship.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                {internship.status}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                                {internship.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(internship)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDelete(internship._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{internship.description}</p>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="text-gray-600">📍 {internship.location}</div>
                          <div className="text-gray-600">💰 ₹{internship.stipend?.toLocaleString()}/mo</div>
                          <div className="text-gray-600 col-span-2">📅 {internship.duration}</div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {internship.skills?.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-lg text-xs">{skill}</span>
                          ))}
                          {internship.skills?.length > 3 && (
                            <span className="text-xs text-gray-600 px-2 py-1">+{internship.skills.length - 3}</span>
                          )}
                        </div>

                        {/* Application Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">{internshipApps.length}</div>
                            <div className="text-xs text-gray-600">Total</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-600">{pendingCount}</div>
                            <div className="text-xs text-gray-600">Pending</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{acceptedCount}</div>
                            <div className="text-xs text-gray-600">Accepted</div>
                          </div>
                        </div>

                        {/* ── REVIEW APPLICANTS BUTTON ── */}
                        <button
                          onClick={() => setSelectedInternship(internship)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-[1.02]"
                        >
                          <UserGroupIcon className="h-5 w-5" />
                          Review Applicants ({internshipApps.length})
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <CompanyAnalytics internships={internships} applications={allApplications} />
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;