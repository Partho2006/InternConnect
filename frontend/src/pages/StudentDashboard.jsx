import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import InternshipCard from '../components/internships/InternshipCard';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import SubscriptionBanner from '../components/subscription/SubscriptionBanner';
import StudentAnalytics from '../components/analytics/StudentAnalytics';

const StudentDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchInternships();
    fetchApplications();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await axios.get('/internships');
      setInternships(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load internships');
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/applications/my-applications');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterType === 'all' || internship.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SubscriptionBanner />
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-slide-up">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-xl text-gray-600">
                Ready to find your dream internship?
              </p>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-700">Applications</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
                <div className="text-3xl font-bold">{stats.accepted}</div>
                <div className="text-sm text-gray-700">Accepted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white px-4 py-3 rounded-xl shadow-lg text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="bg-white px-4 py-3 rounded-xl shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${activeTab === 'browse'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center space-x-2">
                <BriefcaseIcon className="h-5 w-5" />
                <span>Browse Internships</span>
                <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {filteredInternships.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'applications'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span>My Applications</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {stats.total}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'analytics'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-5 w-5" />
                <span>Analytics</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div className="animate-fade-in">
            {/* Search & Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search internships, skills, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative sm:w-48">
                  <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || filterType !== 'all') && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Search: {searchTerm}
                      <button onClick={() => setSearchTerm('')} className="ml-2">×</button>
                    </span>
                  )}
                  {filterType !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 capitalize">
                      Type: {filterType}
                      <button onClick={() => setFilterType('all')} className="ml-2">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Internship Grid */}
            {filteredInternships.length === 0 ? (
              <div className="text-center py-16">
                <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterType !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Check back later for new opportunities'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships.map((internship, index) => (
                  <div
                    key={internship._id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <InternshipCard
                      internship={internship}
                      onApplySuccess={fetchApplications}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="animate-fade-in">
            {/* Application Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <ClockIcon className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                  <ClockIcon className="h-12 w-12 text-yellow-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Accepted</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.accepted}</p>
                  </div>
                  <CheckCircleIcon className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
                  </div>
                  <XCircleIcon className="h-12 w-12 text-red-500 opacity-50" />
                </div>
              </div>
            </div>

            {/* Applications List */}
            {applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-6">Start applying to internships to see them here</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Browse Internships
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app, index) => (
                  <div
                    key={app._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {app.internship?.title}
                          </h3>
                          <span className={`ml-4 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${app.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3">
                          {app.internship?.company?.companyName || app.internship?.company?.name}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                          <span>📍 {app.internship?.location}</span>
                          <span>💰 ₹{app.internship?.stipend}/month</span>
                        </div>

                        {app.internship?.skills && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {app.internship.skills.slice(0, 4).map((skill, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Link
                          to={`/internships/${app.internship?._id}`}
                          className="text-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab - FIXED */}
        {activeTab === 'analytics' && (
          <StudentAnalytics applications={applications} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;