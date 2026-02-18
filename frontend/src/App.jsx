import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import InternshipDetails from './pages/InternshipDetails';
import PrivateRoute from './components/auth/PrivateRoute';
import PricingSection from './components/subscription/PricingSection';
import CompanyReviews from './pages/CompanyReviews';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<PricingSection />} />
              <Route path="/company/:companyId/reviews" element={<CompanyReviews />} />
              
              <Route 
                path="/student/dashboard" 
                element={
                  <PrivateRoute role="student">
                    <StudentDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/company/dashboard" 
                element={
                  <PrivateRoute role="company">
                    <CompanyDashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* This route should work for both students and companies */}
              <Route path="/internships/:id" element={<InternshipDetails />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;