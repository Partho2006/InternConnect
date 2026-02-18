import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending:  { label: 'Pending',  card: 'bg-yellow-50 border-yellow-300', badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  accepted: { label: 'Accepted', card: 'bg-green-50  border-green-300',  badge: 'bg-green-100  text-green-800',  dot: 'bg-green-500'  },
  rejected: { label: 'Rejected', card: 'bg-red-50    border-red-300',    badge: 'bg-red-100    text-red-800',    dot: 'bg-red-500'    },
};

// ─── Profile Drawer ───────────────────────────────────────────────────────────
const ProfileDrawer = ({ app, onClose, onStatusUpdate }) => {
  if (!app) return null;
  const s = STATUS[app.status] || STATUS.pending;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* backdrop */}
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* panel */}
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* header */}
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

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* status + applied date */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${s.badge}`}>
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              Applied {new Date(app.appliedAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
            </span>
          </div>

          {/* contact */}
          <section className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</h3>
            <a href={`mailto:${app.student?.email}`} className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition text-sm">
              <EnvelopeIcon className="h-5 w-5 text-purple-400 shrink-0" />
              {app.student?.email}
            </a>
            {app.student?.phone && (
              <a href={`tel:${app.student.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition text-sm">
                <PhoneIcon className="h-5 w-5 text-purple-400 shrink-0" />
                {app.student.phone}
              </a>
            )}
            {app.student?.portfolio && (
              <a href={app.student.portfolio} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-purple-600 hover:text-purple-800 font-semibold transition text-sm">
                <GlobeAltIcon className="h-5 w-5 shrink-0" />
                View Portfolio ↗
              </a>
            )}
          </section>

          {/* education */}
          {app.student?.education && (
            <section className="bg-blue-50 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Education</h3>
              <p className="text-gray-800 text-sm">{app.student.education}</p>
            </section>
          )}

          {/* skills */}
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

          {/* resume */}
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
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Download
                </a>
              </div>
            </section>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
              ⚠️ No resume uploaded
            </div>
          )}

          {/* cover letter */}
          {app.coverLetter && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-400" /> Cover Letter
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {app.coverLetter}
              </div>
            </section>
          )}
        </div>

        {/* footer actions */}
        {app.status === 'pending' && (
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
            <button
              onClick={() => { onStatusUpdate(app._id, 'accepted'); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black transition shadow-md"
            >
              <CheckCircleIcon className="h-5 w-5" /> Accept
            </button>
            <button
              onClick={() => { onStatusUpdate(app._id, 'rejected'); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black transition shadow-md"
            >
              <XCircleIcon className="h-5 w-5" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Applicant Row Card ───────────────────────────────────────────────────────
const ApplicantCard = ({ app, index, onView, onStatusUpdate }) => {
  const s = STATUS[app.status] || STATUS.pending;
  return (
    <div className={`rounded-2xl border-2 p-5 transition-all hover:shadow-md ${s.card}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">

        {/* avatar + info */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow">
            {app.student?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-gray-900 truncate">{app.student?.name}</h4>
            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
              <EnvelopeIcon className="h-3.5 w-3.5 shrink-0" />
              {app.student?.email}
            </p>
            {app.student?.education && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <AcademicCapIcon className="h-3.5 w-3.5 shrink-0" />
                {app.student.education}
              </p>
            )}
          </div>
        </div>

        {/* status badge + date */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <span className="text-xs text-gray-400">{new Date(app.appliedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* skills */}
      {app.student?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {app.student.skills.slice(0, 5).map((sk, i) => (
            <span key={i} className="bg-white/70 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md text-xs font-semibold">{sk}</span>
          ))}
          {app.student.skills.length > 5 && (
            <span className="text-xs text-gray-400 px-1 py-0.5">+{app.student.skills.length - 5}</span>
          )}
        </div>
      )}

      {/* actions row */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/60">
        <button
          onClick={() => onView(app)}
          className="flex-1 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold text-sm transition"
        >
          View Profile
        </button>

        {app.resumeUrl && (
          <a
            href={`http://localhost:5000${app.resumeUrl}`}
            target="_blank" rel="noopener noreferrer" download
            className="py-2 px-3 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-sm font-semibold transition flex items-center gap-1"
            title="Download Resume"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            CV
          </a>
        )}

        {app.status === 'pending' && (
          <>
            <button
              onClick={() => onStatusUpdate(app._id, 'accepted')}
              className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-1"
              title="Accept"
            >
              <CheckCircleIcon className="h-4 w-4" /> Accept
            </button>
            <button
              onClick={() => onStatusUpdate(app._id, 'rejected')}
              className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-1"
              title="Reject"
            >
              <XCircleIcon className="h-4 w-4" /> Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [internship, setInternship]   = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [applying, setApplying]       = useState(false);
  const [hasApplied, setHasApplied]   = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [resume, setResume]           = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  // applicant section state
  const [selectedApp, setSelectedApp]     = useState(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');

  const applicationsRef = useRef(null);

  useEffect(() => { fetchInternshipDetails(); }, [id]);
  useEffect(() => { if (user?.role === 'company') fetchApplications(); }, [user, id]);

  const fetchInternshipDetails = async () => {
    try {
      const res = await axios.get(`/internships/${id}`);
      setInternship(res.data);
      if (user?.role === 'student') {
        const myApps = await axios.get('/applications/my-applications');
        setHasApplied(myApps.data.some(app => app.internship?._id === id));
      }
      setLoading(false);
    } catch {
      toast.error('Failed to load internship details');
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`/applications/internship/${id}`);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await axios.patch(`/applications/${applicationId}`, { status });
      toast.success(`Application ${status}!`);
      // optimistic update
      setApplications(prev => prev.map(a => a._id === applicationId ? { ...a, status } : a));
    } catch {
      toast.error('Failed to update application');
    }
  };

  const scrollToApplications = () =>
    applicationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleApplyClick = () => {
    if (!user) { toast.error('Please login to apply'); navigate('/login'); return; }
    setShowModal(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) { toast.error('Please upload your resume'); return; }
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('internshipId', id);
      fd.append('coverLetter', coverLetter);
      fd.append('resume', resume);
      await axios.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setHasApplied(true);
      setShowModal(false);
      setResume(null);
      setCoverLetter('');
      toast.success('Application submitted successfully!');
      if (user?.role === 'company') fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
      if (err.response?.data?.limitReached)
        toast.error('Daily limit reached! Upgrade your plan.', { duration: 5000 });
    }
    setApplying(false);
  };

  // ── derived ─────────────────────────────────────────────────────────────
  const isCompanyOwner = user?.role === 'company' && user?.id === internship?.company?._id;

  const filteredApps = applications.filter(app => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      app.student?.name?.toLowerCase().includes(q) ||
      app.student?.email?.toLowerCase().includes(q) ||
      app.student?.skills?.some(s => s.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const appStats = {
    total:    applications.length,
    pending:  applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  // ── loading / not found ──────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading details...</p>
      </div>
    </div>
  );

  if (!internship) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Internship not found</h2>
        <Link to="/" className="text-purple-600 hover:underline">Go back home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition font-semibold">
            <ArrowLeftIcon className="h-5 w-5" /><span>Back</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
                  <BriefcaseIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <BuildingOfficeIcon className="h-5 w-5" />
                    <span className="text-lg font-medium">
                      {internship.company?.companyName || internship.company?.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      internship.type === 'remote' ? 'bg-green-100 text-green-800' :
                      internship.type === 'onsite' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'}`}>
                      {internship.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      internship.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {internship.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student: Apply */}
            {user?.role === 'student' && !isCompanyOwner && (
              <div className="flex-shrink-0">
                <button onClick={handleApplyClick}
                  disabled={applying || hasApplied || internship.status !== 'active'}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                  {hasApplied ? (
                    <span className="flex items-center space-x-2"><CheckCircleIcon className="h-6 w-6" /><span>Applied</span></span>
                  ) : internship.status !== 'active' ? 'Applications Closed' : 'Apply Now'}
                </button>
              </div>
            )}

            {/* Company: scroll to applications */}
            {isCompanyOwner && (
              <div className="flex-shrink-0">
                <button onClick={scrollToApplications}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg">
                  <UserGroupIcon className="h-7 w-7" />
                  <span>View {applications.length} Application{applications.length !== 1 ? 's' : ''}</span>
                  <ArrowDownIcon className="h-5 w-5 animate-bounce" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Internship</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{internship.description}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {internship.skills?.map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium">{skill}</span>
                ))}
              </div>
            </div>

            {/* Company info */}
            {internship.company && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Company</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-semibold text-gray-900">{internship.company.companyName || internship.company.name}</p>
                    </div>
                  </div>
                  <Link to={`/company/${internship.company?._id}/reviews`}
                    className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 text-sm hover:underline transition">
                    ⭐ View &amp; Write Anonymous Reviews
                  </Link>
                  {internship.company.companyWebsite && (
                    <div className="flex items-center space-x-3">
                      <GlobeAltIcon className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a href={internship.company.companyWebsite} target="_blank" rel="noopener noreferrer"
                          className="font-semibold text-purple-600 hover:underline">
                          {internship.company.companyWebsite}
                        </a>
                      </div>
                    </div>
                  )}
                  {internship.company.companyDescription && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">About</p>
                      <p className="text-gray-700 leading-relaxed">{internship.company.companyDescription}</p>
                    </div>
                  )}
                  {(internship.company.companySize || internship.company.industry) && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      {internship.company.companySize && (
                        <div>
                          <p className="text-sm text-gray-500">Company Size</p>
                          <p className="font-semibold text-gray-900">{internship.company.companySize} employees</p>
                        </div>
                      )}
                      {internship.company.industry && (
                        <div>
                          <p className="text-sm text-gray-500">Industry</p>
                          <p className="font-semibold text-gray-900">{internship.company.industry}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                APPLICANTS SECTION  (company owner only)
            ══════════════════════════════════════════════════════════════ */}
            {isCompanyOwner && (
              <div ref={applicationsRef} className="bg-white rounded-2xl shadow-sm scroll-mt-20">

                {/* Section header */}
                <div className="px-6 md:px-8 pt-8 pb-6 border-b">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <div className="bg-purple-600 p-2.5 rounded-xl">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      Applications
                      <span className="bg-purple-100 text-purple-700 text-base px-3 py-0.5 rounded-full font-bold">
                        {applications.length}
                      </span>
                    </h2>
                  </div>

                  {/* Stats pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      { key: 'all',      label: 'Total',    val: appStats.total,    color: 'bg-gray-100 text-gray-700'   },
                      { key: 'pending',  label: 'Pending',  val: appStats.pending,  color: 'bg-yellow-100 text-yellow-800' },
                      { key: 'accepted', label: 'Accepted', val: appStats.accepted, color: 'bg-green-100 text-green-800'  },
                      { key: 'rejected', label: 'Rejected', val: appStats.rejected, color: 'bg-red-100 text-red-800'     },
                    ].map(pill => (
                      <button key={pill.key}
                        onClick={() => setStatusFilter(pill.key)}
                        className={`rounded-xl px-4 py-3 text-center transition-all border-2 ${
                          statusFilter === pill.key
                            ? `${pill.color} border-current shadow-sm scale-105`
                            : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'
                        }`}>
                        <div className="text-2xl font-black">{pill.val}</div>
                        <div className="text-xs font-semibold">{pill.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Search bar */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email or skill…"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm"
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Results */}
                <div className="px-6 md:px-8 py-6">
                  {filteredApps.length === 0 ? (
                    <div className="text-center py-16">
                      <UserGroupIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500 font-semibold text-lg">
                        {applications.length === 0 ? 'No applications yet' : 'No results match your filters'}
                      </p>
                      {applications.length > 0 && (
                        <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                          className="mt-3 text-sm text-purple-600 hover:underline font-semibold">
                          Clear filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-400 font-medium mb-2">
                        Showing {filteredApps.length} of {applications.length}
                      </p>
                      {filteredApps.map((app, i) => (
                        <ApplicantCard
                          key={app._id}
                          app={app}
                          index={i}
                          onView={setSelectedApp}
                          onStatusUpdate={handleStatusUpdate}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Internship Details</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div><p className="text-sm text-gray-500">Location</p><p className="font-semibold text-gray-900">{internship.location}</p></div>
                </div>
                <div className="flex items-start space-x-3">
                  <CurrencyRupeeIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div><p className="text-sm text-gray-500">Stipend</p><p className="font-semibold text-gray-900">₹{internship.stipend?.toLocaleString()}/month</p></div>
                </div>
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div><p className="text-sm text-gray-500">Duration</p><p className="font-semibold text-gray-900">{internship.duration}</p></div>
                </div>
                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div><p className="text-sm text-gray-500">Posted</p><p className="font-semibold text-gray-900">{new Date(internship.createdAt).toLocaleDateString()}</p></div>
                </div>

                {/* Company: applicant counter */}
                {isCompanyOwner && (
                  <button onClick={scrollToApplications}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <UserGroupIcon className="h-7 w-7 text-purple-600" />
                      <div className="text-left">
                        <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">Applicants</p>
                        <p className="font-black text-purple-900 text-2xl leading-tight">{applications.length}</p>
                      </div>
                    </div>
                    <ArrowDownIcon className="h-5 w-5 text-purple-500 animate-bounce" />
                  </button>
                )}
              </div>

              {/* Student: sidebar apply */}
              {user?.role === 'student' && !hasApplied && internship.status === 'active' && (
                <button onClick={handleApplyClick}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile Drawer ── */}
      {selectedApp && (
        <ProfileDrawer
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusUpdate={(appId, status) => {
            handleStatusUpdate(appId, status);
            setSelectedApp(prev => ({ ...prev, status }));
          }}
        />
      )}

      {/* ── Apply Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-3xl font-black text-gray-900">Apply for {internship.title}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <XMarkIcon className="h-7 w-7 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-8">
              <div className="mb-8">
                <label className="block text-lg font-black text-gray-900 mb-4">
                  Upload Resume * (PDF, DOC, DOCX – Max 5 MB)
                </label>
                <div className="border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-purple-500 transition bg-gray-50">
                  <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <input type="file" accept=".pdf,.doc,.docx"
                    onChange={e => setResume(e.target.files[0])}
                    className="hidden" id="resume-upload" required />
                  <label htmlFor="resume-upload"
                    className="cursor-pointer inline-block bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg">
                    Choose File
                  </label>
                  {resume && (
                    <p className="mt-6 text-base text-gray-700 font-bold bg-green-50 p-4 rounded-lg">
                      ✓ {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-lg font-black text-gray-900 mb-4">Cover Letter (Optional)</label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                  rows="6"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-base"
                  placeholder="Tell us why you're a great fit for this role…" />
              </div>

              <div className="flex gap-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-5 border-4 border-gray-300 text-gray-700 rounded-2xl font-black text-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={applying || !resume}
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {applying ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-4 border-white" />
                      Submitting…
                    </span>
                  ) : 'SUBMIT APPLICATION'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipDetails;