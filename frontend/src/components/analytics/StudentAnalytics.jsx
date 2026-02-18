import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

// ── Animated Donut Chart ──────────────────────────────────────
const DonutChart = ({ total, accepted, pending, rejected }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const acceptedPercent = total > 0 ? (accepted / total) * 100 : 0;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
  const rejectedPercent = total > 0 ? (rejected / total) * 100 : 0;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  const acceptedOffset = animated ? circumference - (acceptedPercent / 100) * circumference : circumference;
  const pendingOffset = animated ? circumference - (pendingPercent / 100) * circumference : circumference;
  const rejectedOffset = animated ? circumference - (rejectedPercent / 100) * circumference : circumference;

  const acceptedStart = 0;
  const pendingStart = acceptedPercent;
  const rejectedStart = acceptedPercent + pendingPercent;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="transform -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="32"
        />

        {/* Accepted (green) */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="32"
          strokeDasharray={circumference}
          strokeDashoffset={acceptedOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            transformOrigin: 'center',
            transform: `rotate(${acceptedStart * 3.6}deg)`
          }}
        />

        {/* Pending (yellow) */}
        {pending > 0 && (
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="#eab308"
            strokeWidth="32"
            strokeDasharray={circumference}
            strokeDashoffset={pendingOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              transformOrigin: 'center',
              transform: `rotate(${pendingStart * 3.6}deg)`
            }}
          />
        )}

        {/* Rejected (red) */}
        {rejected > 0 && (
          <circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="32"
            strokeDasharray={circumference}
            strokeDashoffset={rejectedOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              transformOrigin: 'center',
              transform: `rotate(${rejectedStart * 3.6}deg)`
            }}
          />
        )}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-black text-gray-900">{total}</div>
        <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total</div>
      </div>
    </div>
  );
};

// ── Bar Chart Row ─────────────────────────────────────────────
const BarRow = ({ label, value, max, color, icon: Icon, delay = 0 }) => {
  const [animated, setAnimated] = useState(false);
  const percent = max > 0 ? (value / max) * 100 : 0;

  useEffect(() => {
    setTimeout(() => setAnimated(true), delay);
  }, [delay]);

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
            <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
          </div>
          <span className="font-bold text-gray-700">{label}</span>
        </div>
        <span className="text-2xl font-black text-gray-900">{value}</span>
      </div>
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: animated ? `${percent}%` : '0%' }}
        />
      </div>
    </div>
  );
};

// ── Timeline ──────────────────────────────────────────────────
const TimelineItem = ({ month, count, color, delay = 0 }) => {
  const [animated, setAnimated] = useState(false);
  const maxHeight = 120;
  const height = Math.min((count / 10) * maxHeight, maxHeight);

  useEffect(() => {
    setTimeout(() => setAnimated(true), delay);
  }, [delay]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-32 w-12 bg-gray-100 rounded-t-2xl overflow-hidden flex flex-col justify-end">
        <div
          className={`${color} rounded-t-2xl transition-all duration-700 ease-out`}
          style={{ height: animated ? `${height}px` : '0px' }}
        />
      </div>
      <div className="text-xs font-black text-gray-400 uppercase">{month}</div>
      <div className="text-lg font-black text-gray-900">{count}</div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────
const StudentAnalytics = ({ applications = [] }) => {
  const [view, setView] = useState('overview'); // overview | timeline

  // Calculate stats
  const total = applications.length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const pending = applications.filter(a => a.status === 'pending').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  
  const acceptedRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0;

  // Timeline data (last 6 months)
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      const monthApps = applications.filter(app => {
        const appDate = new Date(app.appliedAt);
        return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
      });
      data.push({ month: monthName, count: monthApps.length });
    }
    return data;
  };

  const monthlyData = getMonthlyData();

  if (total === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChartBarIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">No Analytics Yet</h3>
        <p className="text-gray-500 mb-6">Apply to internships to see your stats here</p>
        <div className="inline-block px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm">
          Start Applying →
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
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setView('timeline')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            view === 'timeline'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📈 Timeline
        </button>
      </div>

      {/* Overview Tab */}
      {view === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Donut Chart */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Application Status</h3>
                <p className="text-sm text-gray-500">Breakdown of your applications</p>
              </div>
            </div>

            <DonutChart
              total={total}
              accepted={accepted}
              pending={pending}
              rejected={rejected}
            />

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Accepted</span>
                </div>
                <div className="text-3xl font-black text-green-600">{accepted}</div>
                <div className="text-xs text-gray-500 mt-1">{((accepted / total) * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Pending</span>
                </div>
                <div className="text-3xl font-black text-yellow-600">{pending}</div>
                <div className="text-xs text-gray-500 mt-1">{((pending / total) * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Rejected</span>
                </div>
                <div className="text-3xl font-black text-red-600">{rejected}</div>
                <div className="text-xs text-gray-500 mt-1">{((rejected / total) * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>

          {/* Right: Bars + Stats */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-white/80" />
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Success Rate</span>
                </div>
                <div className="text-5xl font-black">{acceptedRate}%</div>
                <div className="text-white/70 text-sm mt-1">{accepted} out of {total} accepted</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarDaysIcon className="h-6 w-6 text-white/80" />
                  <span className="text-white/80 text-xs font-bold uppercase tracking-wider">This Month</span>
                </div>
                <div className="text-5xl font-black">{monthlyData[monthlyData.length - 1]?.count || 0}</div>
                <div className="text-white/70 text-sm mt-1">applications sent</div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-gray-900 mb-6">Detailed Breakdown</h3>
              <BarRow
                label="Accepted"
                value={accepted}
                max={total}
                color="bg-green-500"
                icon={CheckCircleIcon}
                delay={100}
              />
              <BarRow
                label="Pending"
                value={pending}
                max={total}
                color="bg-yellow-500"
                icon={ClockIcon}
                delay={300}
              />
              <BarRow
                label="Rejected"
                value={rejected}
                max={total}
                color="bg-red-500"
                icon={XCircleIcon}
                delay={500}
              />
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {view === 'timeline' && (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Application Timeline</h3>
              <p className="text-sm text-gray-500">Your activity over the last 6 months</p>
            </div>
          </div>

          <div className="flex items-end justify-around gap-6 py-8">
            {monthlyData.map((data, i) => (
              <TimelineItem
                key={i}
                month={data.month}
                count={data.count}
                color="bg-gradient-to-t from-blue-500 to-cyan-400"
                delay={i * 100}
              />
            ))}
          </div>

          {/* Insights */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Most Active Month</p>
              <p className="text-2xl font-black text-gray-900">
                {monthlyData.reduce((max, m) => m.count > max.count ? m : max, monthlyData[0])?.month}
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Total in 6 Months</p>
              <p className="text-2xl font-black text-gray-900">
                {monthlyData.reduce((sum, m) => sum + m.count, 0)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Avg per Month</p>
              <p className="text-2xl font-black text-gray-900">
                {(monthlyData.reduce((sum, m) => sum + m.count, 0) / 6).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnalytics;