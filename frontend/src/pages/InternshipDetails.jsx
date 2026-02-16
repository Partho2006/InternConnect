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
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  const applicationsRef = useRef(null);

  useEffect(() => {
    fetchInternshipDetails();
  }, [id]);

  useEffect(() => {
    if (user?.role === 'company') {
      fetchApplications();
    }
  }, [user, id]);

  const fetchInternshipDetails = async () => {
    try {
      const res = await axios.get(`/internships/${id}`);
      setInternship(res.data);

      if (user?.role === 'student') {
        const myApps = await axios.get('/applications/my-applications');
        const applied = myApps.data.some(app => app.internship?._id === id);
        setHasApplied(applied);
      }

      setLoading(false);
    } catch (err) {
      toast.error('Failed to load internship details');
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`/applications/internship/${id}`);
      console.log('📋 Applications received:', res.data);
      setApplications(res.data);
    } catch (err) {
      console.error('❌ Failed to load applications:', err);
    }
  };

  const scrollToApplications = () => {
    applicationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApplyClick = () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('internshipId', id);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume);

      await axios.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setHasApplied(true);
      setShowModal(false);
      setResume(null);
      setCoverLetter('');
      toast.success('Application submitted successfully!');
      
      if (user?.role === 'company') {
        fetchApplications();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to apply';
      toast.error(errorMsg);
      
      if (err.response?.data?.limitReached) {
        toast.error('Daily limit reached! Upgrade your plan.', { duration: 5000 });
      }
    }
    setApplying(false);
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.patch(`/applications/${applicationId}`, { status });
      toast.success(`Application ${status}!`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Internship not found</h2>
          <Link to="/" className="text-purple-600 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const isCompanyOwner = user?.role === 'company' && user?.id === internship.company?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
                  <BriefcaseIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {internship.title}
                  </h1>
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <BuildingOfficeIcon className="h-5 w-5" />
                    <span className="text-lg font-medium">
                      {internship.company?.companyName || internship.company?.name}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      internship.type === 'remote'
                        ? 'bg-green-100 text-green-800'
                        : internship.type === 'onsite'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {internship.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      internship.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {internship.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STUDENT: Apply Button */}
            {user?.role === 'student' && !isCompanyOwner && (
              <div className="flex-shrink-0">
                <button
                  onClick={handleApplyClick}
                  disabled={applying || hasApplied || internship.status !== 'active'}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasApplied ? (
                    <span className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-6 w-6" />
                      <span>Applied</span>
                    </span>
                  ) : internship.status !== 'active' ? (
                    'Applications Closed'
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            )}

            {/* COMPANY: View Applications Button - BIG AND OBVIOUS */}
            {isCompanyOwner && (
              <div className="flex-shrink-0">
                <button
                  onClick={scrollToApplications}
                  className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                >
                  <UserGroupIcon className="h-7 w-7" />
                  <span>View {applications.length} Application{applications.length !== 1 ? 's' : ''}</span>
                  <ArrowDownIcon className="h-5 w-5 animate-bounce" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Internship */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Internship</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {internship.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Company Information */}
            {internship.company && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Company</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-semibold text-gray-900">
                        {internship.company.companyName || internship.company.name}
                      </p>
                    </div>
                  </div>

                  {internship.company.companyWebsite && (
                    <div className="flex items-center space-x-3">
                      <GlobeAltIcon className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <a
                          href={internship.company.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-purple-600 hover:underline"
                        >
                          {internship.company.companyWebsite}
                        </a>
                      </div>
                    </div>
                  )}

                  {internship.company.companyDescription && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">About</p>
                      <p className="text-gray-700 leading-relaxed">
                        {internship.company.companyDescription}
                      </p>
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

            {/* ========== APPLICATIONS SECTION ========== */}
            {isCompanyOwner && (
              <div 
                ref={applicationsRef} 
                className="bg-white rounded-2xl shadow-lg p-8 scroll-mt-20 border-2 border-purple-200"
              >
                <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-purple-100">
                  <h2 className="text-4xl font-black text-gray-900 flex items-center gap-4">
                    <div className="bg-purple-600 p-3 rounded-xl">
                      <UserGroupIcon className="h-10 w-10 text-white" />
                    </div>
                    All Applications
                  </h2>
                  <div className="bg-purple-600 text-white px-8 py-4 rounded-2xl shadow-lg">
                    <span className="text-4xl font-black">{applications.length}</span>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <UserGroupIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                    <p className="text-gray-500 text-2xl font-bold mb-2">No applications yet</p>
                    <p className="text-gray-400 text-lg">Candidates will appear here when they apply</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {applications.map((app, index) => (
                      <div
                        key={app._id}
                        className="border-4 border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all hover:border-purple-300 bg-gradient-to-br from-white to-purple-50"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-purple-100">
                          <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-lg font-black">
                            Applicant #{index + 1}
                          </span>
                          <span className={`px-6 py-3 rounded-full text-lg font-black ${
                            app.status === 'accepted'
                              ? 'bg-green-500 text-white'
                              : app.status === 'rejected'
                              ? 'bg-red-500 text-white'
                              : 'bg-yellow-400 text-gray-900'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Student Info */}
                        <div className="flex items-start space-x-6 mb-8">
                          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-5 rounded-2xl shadow-xl">
                            <AcademicCapIcon className="h-10 w-10 text-white" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2">{app.student?.name}</h3>
                            <p className="text-gray-600 flex items-center space-x-3 text-lg">
                              <EnvelopeIcon className="h-5 w-5" />
                              <span>{app.student?.email}</span>
                            </p>
                            {app.student?.phone && (
                              <p className="text-gray-600 flex items-center space-x-3 mt-2 text-lg">
                                <PhoneIcon className="h-5 w-5" />
                                <span>{app.student.phone}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* ========== RESUME DOWNLOAD - SUPER PROMINENT ========== */}
                        {app.resumeUrl ? (
                          <div className="mb-8 p-8 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-3xl border-4 border-purple-400 shadow-2xl">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="bg-purple-600 p-6 rounded-2xl shadow-2xl">
                                  <DocumentTextIcon className="h-12 w-12 text-white" />
                                </div>
                                <div>
                                  <p className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                                    📄 Resume Submitted
                                  </p>
                                  <p className="text-lg text-gray-700 font-bold break-all">
                                    {app.resumeOriginalName || 'resume.pdf'}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-2">
                                    Submitted on {new Date(app.appliedAt).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                </div>
                              </div>
                              <a
                                href={`http://localhost:5000${app.resumeUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 whitespace-nowrap"
                              >
                                <DocumentArrowDownIcon className="h-8 w-8" />
                                <span>DOWNLOAD RESUME</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-8 p-6 bg-red-50 border-2 border-red-300 rounded-2xl">
                            <p className="text-red-800 font-bold text-lg">⚠️ No resume uploaded</p>
                          </div>
                        )}

                        {/* Cover Letter */}
                        {app.coverLetter && (
                          <div className="mb-8 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                            <div className="flex items-start gap-4 mb-4">
                              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mt-1" />
                              <p className="text-lg font-black text-gray-900">Cover Letter</p>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg pl-10">
                              {app.coverLetter}
                            </p>
                          </div>
                        )}

                        {/* Student Skills */}
                        {app.student?.skills && app.student.skills.length > 0 && (
                          <div className="mb-6">
                            <p className="text-lg font-black text-gray-900 mb-4">Skills:</p>
                            <div className="flex flex-wrap gap-3">
                              {app.student.skills.map((skill, idx) => (
                                <span key={idx} className="bg-purple-200 text-purple-900 px-4 py-2 rounded-xl text-base font-bold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {app.student?.education && (
                          <div className="mb-6">
                            <p className="text-lg font-black text-gray-900 mb-2">Education:</p>
                            <p className="text-gray-700 text-lg">{app.student.education}</p>
                          </div>
                        )}

                        {/* Portfolio Link */}
                        {app.student?.portfolio && (
                          <div className="mb-6">
                            <a
                              href={app.student.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 text-lg text-purple-600 hover:text-purple-700 font-bold hover:underline"
                            >
                              <GlobeAltIcon className="h-5 w-5" />
                              <span>View Portfolio</span>
                            </a>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {app.status === 'pending' && (
                          <div className="flex gap-6 pt-8 border-t-2 border-purple-100">
                            <button
                              onClick={() => handleUpdateApplicationStatus(app._id, 'accepted')}
                              className="flex-1 flex items-center justify-center space-x-3 px-8 py-5 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-black text-xl shadow-lg hover:shadow-2xl transform hover:scale-105"
                            >
                              <CheckCircleIcon className="h-8 w-8" />
                              <span>ACCEPT</span>
                            </button>
                            <button
                              onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                              className="flex-1 flex items-center justify-center space-x-3 px-8 py-5 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black text-xl shadow-lg hover:shadow-2xl transform hover:scale-105"
                            >
                              <XCircleIcon className="h-8 w-8" />
                              <span>REJECT</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Internship Details</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{internship.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CurrencyRupeeIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Stipend</p>
                    <p className="font-semibold text-gray-900">₹{internship.stipend?.toLocaleString()}/month</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">{internship.duration}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Posted</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(internship.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Company: Applicants Counter with Scroll Button */}
                {isCompanyOwner && (
                  <button
                    onClick={scrollToApplications}
                    className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl hover:from-purple-100 hover:to-pink-100 transition cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <UserGroupIcon className="h-8 w-8 text-purple-600" />
                      <div className="text-left">
                        <p className="text-sm text-purple-600 font-bold">Total Applicants</p>
                        <p className="font-black text-purple-900 text-3xl">{applications.length}</p>
                      </div>
                    </div>
                    <ArrowDownIcon className="h-6 w-6 text-purple-600 animate-bounce" />
                  </button>
                )}
              </div>

              {/* Student: Apply Button */}
              {user?.role === 'student' && !hasApplied && internship.status === 'active' && (
                <button
                  onClick={handleApplyClick}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-3xl font-black text-gray-900">Apply for {internship.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <XMarkIcon className="h-7 w-7 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-8">
              <div className="mb-8">
                <label className="block text-lg font-black text-gray-900 mb-4">
                  Upload Resume * (PDF, DOC, DOCX - Max 5MB)
                </label>
                <div className="border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-purple-500 transition bg-gray-50">
                  <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                    required
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer inline-block bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg"
                  >
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
                <label className="block text-lg font-black text-gray-900 mb-4">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="6"
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-base"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>

              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-8 py-5 border-4 border-gray-300 text-gray-700 rounded-2xl font-black text-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying || !resume}
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-4 border-white"></div>
                      Submitting...
                    </span>
                  ) : (
                    'SUBMIT APPLICATION'
                  )}
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