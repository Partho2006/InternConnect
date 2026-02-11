import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from './../../utils/axios.jsx';
import { AuthContext } from '../../context/AuthContext';

const InternshipCard = ({ internship }) => {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { user } = useContext(AuthContext);

  const handleApply = async () => {
    if (!user) {
      alert('Please login to apply');
      return;
    }

    setApplying(true);
    try {
      await axios.post('/applications', {
        internshipId: internship._id,
        coverLetter: 'I am interested in this position' // Simple for now
      });
      setApplied(true);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{internship.title}</h3>
        <span className="bg-primary text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
          {internship.type}
        </span>
      </div>

      <p className="text-gray-600 mb-2">
        {internship.company?.companyName || internship.company?.name}
      </p>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {internship.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {internship.skills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {internship.location}
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ₹{internship.stipend}/month
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/internships/${internship._id}`}
          className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          View Details
        </Link>
        <button
          onClick={handleApply}
          disabled={applying || applied}
          className="flex-1 text-gray-800 px-4 py-2 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50 hover:bg-gray-400"
        >
          {applying ? 'Applying...' : applied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;