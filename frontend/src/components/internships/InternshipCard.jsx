import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  DocumentArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const InternshipCard = ({ internship, onApplySuccess }) => {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const { user } = useContext(AuthContext);

  const handleApplyClick = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to apply');
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
      formData.append('internshipId', internship._id);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume);

      await axios.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setApplied(true);
      setShowModal(false);
      toast.success('Application submitted successfully!');
      if (onApplySuccess) onApplySuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to apply';
      toast.error(errorMsg);

      // If limit reached, show upgrade prompt
      if (err.response?.data?.limitReached) {
        toast.error('Upgrade to apply more!', { duration: 5000 });
      }
    }
    setApplying(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
        {/* Card content remains the same */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition line-clamp-2">
              {internship.title}
            </h3>
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${internship.type === 'remote'
                ? 'bg-green-100 text-green-800'
                : internship.type === 'onsite'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
              {internship.type}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {internship.company?.companyName || internship.company?.name}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {internship.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {internship.skills?.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {internship.skills?.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{internship.skills.length - 3} more
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{internship.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CurrencyRupeeIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>₹{internship.stipend?.toLocaleString()}/mo</span>
            </div>
            <div className="flex items-center text-gray-600 col-span-2">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{internship.duration}</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Link
            to={`/internships/${internship._id}`}
            className="flex-1 text-center px-4 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-00 transition font-medium text-sm flex items-center justify-center group"
          >
            <span>Details</span>
            <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
         
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Apply for {internship.title}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleApply} className="p-8">
              {/* Resume Upload */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Upload Resume * (PDF, DOC, DOCX - Max 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition">
                  <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                    className="cursor-pointer inline-block bg-purple-100 text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-200 transition"
                  >
                    Choose File
                  </label>
                  {resume && (
                    <p className="mt-4 text-sm text-gray-600 font-medium">
                      ✓ {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying || !resume}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default InternshipCard;