import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <BriefcaseIcon className="h-6 w-6 text-gray-800" />
              </div>
              <span className="text-xl font-bold text-gray-800">InternConnect</span>
            </div>
            <p className="text-sm text-gray-400">
              Connecting talented students with amazing opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-gray-800 transition">Sign Up</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-gray-800 transition">Browse Internships</Link></li>
              <li><a href="#" className="hover:text-gray-800 transition">Resources</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">For Companies</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-gray-800 transition">Post Internship</Link></li>
              <li><a href="#" className="hover:text-gray-800 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-800 transition">Success Stories</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gray-800 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-800 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-800 transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} InternConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;