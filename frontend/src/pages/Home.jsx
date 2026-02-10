import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  BuildingOfficeIcon, 
  RocketLaunchIcon,
  CheckCircleIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

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

  const stats = [
    { label: 'Active Internships', value: '500+' },
    { label: 'Registered Students', value: '10,000+' },
    { label: 'Partner Companies', value: '200+' },
    { label: 'Success Stories', value: '5,000+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <SparklesIcon className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-medium">India's #1 Internship Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-slide-up">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Internship
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-100 animate-slide-up">
              Connect with top companies, gain real-world experience, and kickstart your dream career
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link 
                to="/register" 
                className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-300" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose InternConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find, apply, and manage internships in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform is designed to make finding and managing internships effortless
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link 
                to="/register"
                className="inline-block mt-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Your Journey
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="h-32 w-32 text-primary-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-900">Real-Time Analytics</p>
                  <p className="text-gray-600 mt-2">Track your progress and success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <UserGroupIcon className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of students and companies already using InternConnect
          </p>
          <Link 
            to="/register"
            className="inline-block bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;