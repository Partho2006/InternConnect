import React, { useState, useEffect, useContext } from 'react';
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
  DocumentTextIcon
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
  const [showApplicants, setShowApplicants] = useState(false);

  useEffect(() => {
    fetchInternshipDetails();
    if (user?.role === 'company') {
      fetchApplications();
    }
  }, [id]);

  const fetchInternshipDetails = async () => {
    try {
      const res = await axios.get(`/internships/${id}`);
      setInternship(res.data);
      
      // Check if student has already applied
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
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to load applications');
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await axios.post('/applications', {
        internshipId: id,
        coverLetter: 'I am interested in this position'
      });
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
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
          <Link to="/" className="text-primary-600 hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const isCompanyOwner = user?.role === 'company' && user?.id === internship.company?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-4 rounded-2xl">
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

            {/* Apply Button for Students */}
            {user?.role === 'student' && !isCompanyOwner && (
              <div className="flex-shrink-0">
                <button
                  onClick={handleApply}
                  disabled={applying || hasApplied || internship.status !== 'active'}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {applying ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Applying...</span>
                    </span>
                  ) : hasApplied ? (
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

            {/* View Applicants Button for Company */}
            {isCompanyOwner && (
              <button
                onClick={() => setShowApplicants(!showApplicants)}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {showApplicants ? 'Hide' : 'View'} Applicants ({applications.length})
              </button>
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
                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium"
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
                          className="font-semibold text-primary-600 hover:underline"
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
                </div>
              </div>
            )}

            {/* Applicants Section (Company View) */}
            {isCompanyOwner && showApplicants && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Applications ({applications.length})
                </h2>

                {applications.length === 0 ? (
                  <div className="text-center py-12">
                    <UserGroupIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div 
                        key={app._id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-3 rounded-xl">
                              <AcademicCapIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{app.student?.name}</h3>
                              <p className="text-gray-600 flex items-center space-x-2">
                                <EnvelopeIcon className="h-4 w-4" />
                                <span>{app.student?.email}</span>
                              </p>
                              {app.student?.phone && (
                                <p className="text-gray-600 flex items-center space-x-2 mt-1">
                                  <PhoneIcon className="h-4 w-4" />
                                  <span>{app.student.phone}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            app.status === 'accepted' 
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>

                        {/* Student Info */}
                        {app.student?.skills && app.student.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {app.student.skills.map((skill, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {app.student?.education && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700">Education:</p>
                            <p className="text-gray-600">{app.student.education}</p>
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {app.student?.resume && (
                            <a
                              href={app.student.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:underline"
                            >
                              <DocumentTextIcon className="h-4 w-4" />
                              <span>Resume</span>
                            </a>
                          )}
                          {app.student?.portfolio && (
                            <a
                              href={app.student.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:underline"
                            >
                              <GlobeAltIcon className="h-4 w-4" />
                              <span>Portfolio</span>
                            </a>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </p>

                        {/* Action Buttons */}
                        {app.status === 'pending' && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleUpdateApplicationStatus(app._id, 'accepted')}
                              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                              <XCircleIcon className="h-5 w-5" />
                              <span>Reject</span>
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

                {isCompanyOwner && (
                  <div className="flex items-start space-x-3">
                    <UserGroupIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Applicants</p>
                      <p className="font-semibold text-gray-900">{applications.length}</p>
                    </div>
                  </div>
                )}
              </div>

              {user?.role === 'student' && !hasApplied && internship.status === 'active' && (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;