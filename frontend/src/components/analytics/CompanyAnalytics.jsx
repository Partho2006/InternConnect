import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BriefcaseIcon,
  TrophyIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

// ── Progress Ring ─────────────────────────────────────────────
const ProgressRing = ({ value, max, size = 120, strokeWidth = 12, color = '#3b82f6', label, sublabel }) => {
  const [animated, setAnimated] = useState(false);
  const percent = max > 0 ? (value / max) * 100 : 0;

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = animated ? circumference - (percent / 100) * circumference : circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className="text-3xl font-black text-gray-900">{value}</div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</div>
        {sublabel && <div className="text-xs text-gray-400">{sublabel}</div>}
      </div>
    </div>
  );
};

// ── Stacked Bar ───────────────────────────────────────────────
const StackedBar = ({ accepted, pending, rejected, total, title, delay = 0 }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), delay);
  }, [delay]);

  const acceptedPercent = total > 0 ? (accepted / total) * 100 : 0;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
  const rejectedPercent = total > 0 ? (rejected / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-gray-700">{title}</span>
        <span className="text-2xl font-black text-gray-900">{total}</span>
      </div>
      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className="bg-green-500 transition-all duration-1000 ease-out"
          style={{ width: animated ? `${acceptedPercent}%` : '0%' }}
        />
        <div
          className="bg-yellow-400 transition-all duration-1000 ease-out"
          style={{ width: animated ? `${pendingPercent}%` : '0%' }}
        />
        <div
          className="bg-red-500 transition-all duration-1000 ease-out"
          style={{ width: animated ? `${rejectedPercent}%` : '0%' }}
        />
      </div>
      <div className="flex items-center gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {accepted} Accepted
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          {pending} Pending
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          {rejected} Rejected
        </span>
      </div>
    </div>
  );
};

// ── Internship Card ───────────────────────────────────────────
const InternshipCard = ({ internship, rank }) => {
  const total = internship.applicantStats?.total || 0;
  const accepted = internship.applicantStats?.accepted || 0;
  const pending = internship.applicantStats?.pending || 0;

  const getMedalEmoji = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:shadow-lg transition-all hover:border-blue-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getMedalEmoji()}</span>
            <h4 className="font-black text-gray-900 text-lg">{internship.title}</h4>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className={`px-2 py-1 rounded-full font-bold ${
              internship.type === 'remote' ? 'bg-green-100 text-green-700'
              : internship.type === 'hybrid' ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
            }`}>
              {internship.type}
            </span>
            <span className={`px-2 py-1 rounded-full font-bold ${
              internship.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {internship.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-gray-900">{total}</div>
          <div className="text-xs text-gray-500 font-bold">applicants</div>
        </div>
      </div>

      <StackedBar
        accepted={accepted}
        pending={pending}
        rejected={total - accepted - pending}
        total={total}
        title=""
      />
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────
const CompanyAnalytics = ({ internships = [], applications = [] }) => {
  const [view, setView] = useState('overview'); // overview | internships

  // Calculate overall stats
  const totalApplicants = applications.length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  
  const acceptanceRate = totalApplicants > 0 ? ((accepted / totalApplicants) * 100).toFixed(1) : 0;
  const activeInternships = internships.filter(i => i.status === 'active').length;

  // Get internships with their applicant stats
  const internshipsWithStats = internships.map(internship => {
    const internshipApps = applications.filter(app => app.internship?._id === internship._id || app.internship === internship._id);
    return {
      ...internship,
      applicantStats: {
        total: internshipApps.length,
        accepted: internshipApps.filter(a => a.status === 'accepted').length,
        pending: internshipApps.filter(a => a.status === 'pending').length,
        rejected: internshipApps.filter(a => a.status === 'rejected').length
      }
    };
  }).sort((a, b) => b.applicantStats.total - a.applicantStats.total);

  const topPerformer = internshipsWithStats[0];

  if (internships.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChartBarIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">No Analytics Yet</h3>
        <p className="text-gray-500 mb-6">Post internships to see your stats here</p>
        <div className="inline-block px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm">
          Post Internship →
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-3 bg-white rounded-2xl p-2 w-fit border border-gray-200">
        <button
          onClick={() => setView('overview')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            view === 'overview'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setView('internships')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            view === 'internships'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🏆 Top Internships
        </button>
      </div>

      {/* Overview Tab */}
      {view === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stat Cards */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <UserGroupIcon className="h-7 w-7 text-white/80" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Total Applicants</span>
            </div>
            <div className="text-6xl font-black mb-1">{totalApplicants}</div>
            <div className="text-white/70 text-sm">across all postings</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <ArrowTrendingUpIcon className="h-7 w-7 text-white/80" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Acceptance Rate</span>
            </div>
            <div className="text-6xl font-black mb-1">{acceptanceRate}%</div>
            <div className="text-white/70 text-sm">{accepted} hired so far</div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <BriefcaseIcon className="h-7 w-7 text-white/80" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Active Postings</span>
            </div>
            <div className="text-6xl font-black mb-1">{activeInternships}</div>
            <div className="text-white/70 text-sm">of {internships.length} total</div>
          </div>

          {/* Progress Rings */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8">Application Breakdown</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <ProgressRing
                  value={accepted}
                  max={totalApplicants}
                  color="#22c55e"
                  label="Accepted"
                  sublabel={`${((accepted / totalApplicants) * 100).toFixed(0)}%`}
                  size={140}
                  strokeWidth={14}
                />
                <p className="text-sm text-gray-500 mt-4">Hired for internships</p>
              </div>
              <div className="text-center">
                <ProgressRing
                  value={pending}
                  max={totalApplicants}
                  color="#eab308"
                  label="Pending"
                  sublabel={`${((pending / totalApplicants) * 100).toFixed(0)}%`}
                  size={140}
                  strokeWidth={14}
                />
                <p className="text-sm text-gray-500 mt-4">Awaiting your review</p>
              </div>
              <div className="text-center">
                <ProgressRing
                  value={rejected}
                  max={totalApplicants}
                  color="#ef4444"
                  label="Rejected"
                  sublabel={`${((rejected / totalApplicants) * 100).toFixed(0)}%`}
                  size={140}
                  strokeWidth={14}
                />
                <p className="text-sm text-gray-500 mt-4">Not a fit this time</p>
              </div>
            </div>
          </div>

          {/* Top Performer */}
          {topPerformer && topPerformer.applicantStats.total > 0 && (
            <div className="lg:col-span-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border-2 border-amber-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500 rounded-2xl">
                  <TrophyIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Top Performing Internship</h3>
                  <p className="text-sm text-gray-600">Most popular posting this month</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-black text-gray-900 mb-2">{topPerformer.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        📍 {topPerformer.location}
                      </span>
                      <span className="flex items-center gap-1">
                        💰 ₹{topPerformer.stipend?.toLocaleString()}/mo
                      </span>
                      <span className="flex items-center gap-1">
                        ⏱️ {topPerformer.duration}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-gray-900">{topPerformer.applicantStats.total}</div>
                    <div className="text-sm text-gray-500 font-bold">total applicants</div>
                  </div>
                </div>
                <StackedBar
                  accepted={topPerformer.applicantStats.accepted}
                  pending={topPerformer.applicantStats.pending}
                  rejected={topPerformer.applicantStats.rejected}
                  total={topPerformer.applicantStats.total}
                  title="Application Status"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Internships Tab */}
      {view === 'internships' && (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-2xl">
              <TrophyIcon className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Internship Performance</h3>
              <p className="text-sm text-gray-500">Ranked by total applicants received</p>
            </div>
          </div>

          {internshipsWithStats.length === 0 ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No internships posted yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {internshipsWithStats.map((internship, i) => (
                <InternshipCard
                  key={internship._id}
                  internship={internship}
                  rank={i + 1}
                />
              ))}
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 text-center">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Avg Applicants</p>
              <p className="text-3xl font-black text-gray-900">
                {internships.length > 0
                  ? (totalApplicants / internships.length).toFixed(1)
                  : 0
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">per internship</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200 text-center">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Most Popular Type</p>
              <p className="text-3xl font-black text-gray-900">
                {(() => {
                  const types = internships.map(i => i.type);
                  const counts = { remote: 0, onsite: 0, hybrid: 0 };
                  types.forEach(t => counts[t]++);
                  const max = Math.max(...Object.values(counts));
                  return Object.keys(counts).find(k => counts[k] === max) || 'N/A';
                })()}
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200 text-center">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Active Postings</p>
              <p className="text-3xl font-black text-gray-900">
                {activeInternships}
              </p>
              <p className="text-xs text-gray-500 mt-1">currently open</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAnalytics;