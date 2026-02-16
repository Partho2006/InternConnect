import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import PricingSection from '../components/subscription/Pricing';

const Home = () => {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'For Students',
      description: 'Discover internships that match your skills, build your portfolio, and launch your career.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'For Companies',
      description: 'Find talented interns quickly, manage applications efficiently, and build your talent pipeline.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Smart Matching',
      description: 'Our AI-powered system connects the right students with the right opportunities.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    'Profile with portfolio showcase',
    'One-click application process',
    'Real-time application tracking',
    'Secure payment management',
    'Progress tracking & feedback',
    'Certificate generation'
  ];

  return (
    <div>
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

        {/* Soft Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-16">
          <div className="text-center max-w-4xl mx-auto">

            {/* Badge */}
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2 rounded-full text-sm font-semibold border border-white/30 shadow-md">
                <SparklesIcon className="w-5 h-5" />
                India’s #1 Internship Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Internship
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Connect with top companies, gain real-world experience, and kickstart your dream career today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">

              <Link
                to="/register"
                className="group bg-white text-purple-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 rounded-xl font-semibold text-lg border border-white/40 hover:bg-white/20 transition-all duration-300"
              >
                Sign In
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-8">

          {/* Section Title */}
          <div className="text-center mb-8">
            <span className="inline-block bg-purple-100 text-purple-700 px-6 py-3 rounded-full text-sm font-bold mb-8 uppercase tracking-wide">
              Features
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8">
              Why Choose InternConnect?
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to find, apply, and manage internships in one place
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 border-2 border-gray-100"
                >
                  <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${feature.color} mb-8`}>
                    <Icon className="w-12 h-12 text-gray-800" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== BENEFITS SECTION ========== */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div>
              <span className="inline-block bg-green-100 text-green-700 px-6 py-3 rounded-full text-sm font-bold mb-8 uppercase tracking-wide">
                Benefits
              </span>

              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                Everything You Need to Succeed
              </h2>

              <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
                Our platform is designed to make finding and managing internships effortless
              </p>

              {/* Benefits List */}
              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-xl text-gray-800 pt-1">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-800 px-8 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start Your Journey
                <ArrowRightIcon className="w-6 h-6" />
              </Link>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 min-h-[600px] flex flex-col items-center justify-center shadow-2xl">
                <ChartBarIcon className="w-48 h-48 text-purple-600 mb-8" />
                <h3 className="text-4xl font-bold text-gray-900 mb-4">Real-Time Analytics</h3>
                <p className="text-gray-600 text-xl text-center">Track your progress and success</p>
              </div>

              {/* Floating decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-purple-300 rounded-full opacity-40 blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-pink-300 rounded-full opacity-40 blur-3xl"></div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-32">
        <div className="max-w-7xl mx-auto px-8">

          <div className="text-center mb-16">
            <span className="inline-block bg-white/10 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 uppercase tracking-wide">
              How It Works
            </span>
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile in minutes' },
              { step: '02', title: 'Browse & Apply', desc: 'Find perfect internships and apply with one click' },
              { step: '03', title: 'Get Hired', desc: 'Connect with companies and start your career journey' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-8xl font-black text-white mb-6">{item.step}</div>
                <h3 className="text-3xl font-bold mb-6">{item.title}</h3>
                <p className="text-xl text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========== PRICING SECTION ========== */}
      <PricingSection />

      {/* ========== FINAL CTA SECTION ========== */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-8 text-center">

          <div className="mb-8">
            <UserGroupIcon className="w-24 h-24 mx-auto opacity-90" />
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8">
            Ready to Get Started?
          </h2>

          <p className="text-2xl md:text-3xl mb-16 text-white max-w-3xl mx-auto leading-relaxed">
            Join thousands of students and companies already using InternConnect
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-4 bg-white text-gray-800 px-8 py-8 rounded-2xl font-black text-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-110 shadow-2xl"
          >
            Create Free Account
            <ArrowRightIcon className="w-8 h-8" />
          </Link>

          {/* Trust Signals */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-12 text-lg text-white">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6" />
              <span>Cancel anytime</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-6 h-6" />
              <span>24/7 support</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;