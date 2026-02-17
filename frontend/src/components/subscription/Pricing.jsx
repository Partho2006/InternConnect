import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  XMarkIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const Pricing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (plan === 'free') {
      toast.success('You are already on the free plan!');
      return;
    }

    setLoading(plan);
    try {
      navigate('/pricing');
      return;
    } catch (err) {
      toast.error('Failed to start checkout');
      setLoading(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: '10 applications per day', included: true },
        { text: '5 job posts per day', included: true },
        { text: 'Basic profile', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: false },
        { text: 'Featured listings', included: false },
        { text: 'Analytics dashboard', included: false },
      ],
      cta: 'Current Plan',
      popular: false,
      gradient: 'from-gray-600 to-gray-800',
      plan: 'free'
    },
    {
      name: 'Basic',
      price: '₹499',
      period: 'per month',
      description: 'Great for active job seekers',
      features: [
        { text: '20 applications per day', included: true },
        { text: '10 job posts per day', included: true },
        { text: 'Enhanced profile', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: true },
        { text: 'Featured listings', included: false },
        { text: 'Analytics dashboard', included: false },
      ],
      cta: 'Upgrade to Basic',
      popular: true,
      gradient: 'from-purple-600 to-pink-600',
      plan: 'basic'
    },
    {
      name: 'Premium',
      price: '₹999',
      period: 'per month',
      description: 'For serious professionals',
      features: [
        { text: 'Unlimited applications', included: true },
        { text: 'Unlimited job posts', included: true },
        { text: 'Premium profile badge', included: true },
        { text: '24/7 Priority support', included: true },
        { text: 'Featured listings', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Early access to features', included: true },
      ],
      cta: 'Upgrade to Premium',
      popular: false,
      gradient: 'from-purple-600 to-pink-600',
      plan: 'premium'
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center space-x-2 bg-purple-100 px-6 py-3 rounded-full mb-8">
            <SparklesIcon className="h-5 w-5 text-purple-600" />
            <span className="text-purple-600 font-bold uppercase tracking-wide text-sm">Pricing Plans</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                plan.popular ? 'border-purple-600 transform md:scale-105' : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 text-sm font-bold rounded-bl-2xl`}>
                  Most Popular
                </div>
              )}

              <div className="p-10">
                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-gray-900 mb-3">{plan.name}</h3>
                  <p className="text-gray-600 text-lg">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-lg">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-5 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XMarkIcon className="h-6 w-6 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-lg ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.plan)}
                  disabled={loading === plan.plan}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-2xl`
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {loading === plan.plan ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg">
            Have questions?{' '}
            <a href="#" className="text-purple-600 font-bold hover:underline">
              Check our FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;