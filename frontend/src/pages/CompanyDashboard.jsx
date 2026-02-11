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
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import SubscriptionBanner from '../components/subscription/SubscriptionBanner';

const CompanyDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    duration: '',
    stipend: '',
    location: '',
    type: 'remote',
    status: 'active'
  });

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    try {
      const res = await axios.get('/internships/company/my-internships');
      setInternships(res.data);
      
      // Fetch applications for each internship
      const appsData = {};
      for (const internship of res.data) {
        try {
          const appRes = await axios.get(`/applications/internship/${internship._id}`);
          appsData[internship._id] = appRes.data;
        } catch (err) {
          appsData[internship._id] = [];
        }
      }
      setApplications(appsData);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load internships');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        stipend: Number(formData.stipend)
      };

      if (editingId) {
        await axios.put(`/internships/${editingId}`, dataToSend);
        toast.success('Internship updated successfully!');
      } else {
        await axios.post('/internships', dataToSend);
        toast.success('Internship posted successfully!');
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        skills: '',
        duration: '',
        stipend: '',
        location: '',
        type: 'remote',
        status: 'active'
      });
      fetchMyInternships();
    } catch (err) {
      toast.error('Failed to save internship');
    }
  };

  const handleEdit = (internship) => {
    setEditingId(internship._id);
    setFormData({
      title: internship.title,
      description: internship.description,
      skills: internship.skills.join(', '),
      duration: internship.duration,
      stipend: internship.stipend.toString(),
      location: internship.location,
      type: internship.type,
      status: internship.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    
    try {
      await axios.delete(`/internships/${id}`);
      toast.success('Internship deleted successfully');
      fetchMyInternships();
    } catch (err) {
      toast.error('Failed to delete internship');
    }
  };

  const stats = {
    total: internships.length,
    active: internships.filter(i => i.status === 'active').length,
    totalApplicants: Object.values(applications).reduce((sum, apps) => sum + apps.length, 0),
    pendingApplicants: Object.values(applications).reduce((sum, apps) => 
      sum + apps.filter(app => app.status === 'pending').length, 0
    )
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
      <div className=" text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-slide-up">
              <div className="flex items-center space-x-3 mb-3">
                <BuildingOfficeIcon className="h-10 w-10" />
                <h1 className="text-4xl font-bold">Company Dashboard</h1>
              </div>
              <p className="text-xl text-gray-600">
                Manage your internship postings and find talented candidates
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  title: '',
                  description: '',
                  skills: '',
                  duration: '',
                  stipend: '',
                  location: '',
                  type: 'remote',
                  status: 'active'
                });
              }}
              className="hidden md:flex items-center space-x-2 bg-gray-100 text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-xl"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Post New Internship</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Postings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-3xl font-bold">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-3xl font-bold">{stats.totalApplicants}</div>
              <div className="text-sm text-gray-600">Total Applicants</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="text-3xl font-bold">{stats.pendingApplicants}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Post Button */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full flex items-center justify-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold shadow-xl"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Post New Internship</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BriefcaseIcon className="h-5 w-5" />
                <span>My Postings</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post/Edit Internship Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-slide-down border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Internship' : 'Post New Internship'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. Frontend Developer Intern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. 3 months"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="Describe the role, responsibilities, and what the intern will learn..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills * (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. React, JavaScript, HTML, CSS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Stipend (₹) *
                  </label>
                  <input
                    type="number"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    placeholder="e.g. Mumbai, India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  >
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-3 border border-gray-500 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 text-gray-800 rounded-xl font-semibold hover:shadow-lg border border-gray-500 transition-all transform hover:scale-105"
                >
                  {editingId ? 'Update Internship' : 'Post Internship'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            {internships.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                <BriefcaseIcon className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No internships posted yet</h3>
                <p className="text-gray-500 mb-6">Start by posting your first internship opportunity</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center space-x-2 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Post Your First Internship</span>
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {internships.map((internship, index) => {
                  const internshipApps = applications[internship._id] || [];
                  const pendingCount = internshipApps.filter(app => app.status === 'pending').length;
                  const acceptedCount = internshipApps.filter(app => app.status === 'accepted').length;

                  return (
                    <div 
                      key={internship._id} 
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {internship.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              internship.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : internship.status === 'closed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {internship.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                              {internship.type}
                            </span>
                          </div>
                        </div>

                        {/* Actions Dropdown */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(internship)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(internship._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {internship.description}
                      </p>

                      {/* Info */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="text-gray-600">
                          📍 {internship.location}
                        </div>
                        <div className="text-gray-600">
                          💰 ₹{internship.stipend?.toLocaleString()}/mo
                        </div>
                        <div className="text-gray-600 col-span-2">
                          📅 {internship.duration}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {internship.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-lg text-xs">
                            {skill}
                          </span>
                        ))}
                        {internship.skills?.length > 3 && (
                          <span className="text-xs text-gray-600 px-2 py-1">
                            +{internship.skills.length - 3}
                          </span>
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

                      {/* Actions */}
                      <Link
                        to={`/internships/${internship._id}`}
                        className="block w-full text-center px-4 py-2.5 bg-primary-600 text-gray-800 rounded-lg hover:bg-primary-700 transition font-medium"
                      >
                        View Applications ({internshipApps.length})
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <ChartBarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-500">
                Track application trends, candidate quality, time-to-hire, and more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;