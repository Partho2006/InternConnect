import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const PricingSection = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: '5 applications per day', included: true },
        { text: '1 job post per day', included: true },
        { text: 'Basic profile', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: false },
        { text: 'Featured listings', included: false },
        { text: 'Analytics dashboard', included: false },
      ],
      cta: 'Current Plan',
      popular: false,
      gradient: 'from-gray-600 to-gray-800'
    },
    {
      name: 'Basic',
      price: '₹499',
      period: 'per month',
      description: 'Great for active job seekers',
      features: [
        { text: '20 applications per day', included: true },
        { text: '5 job posts per day', included: true },
        { text: 'Enhanced profile', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: true },
        { text: 'Featured listings', included: false },
        { text: 'Analytics dashboard', included: false },
      ],
      cta: 'Upgrade to Basic',
      popular: true,
      gradient: 'from-primary-600 to-secondary-600'
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
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const handleUpgrade = (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Integrate with Stripe payment
    navigate(`/${user.role}/dashboard`);
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 px-4 py-2 rounded-full mb-4">
            <SparklesIcon className="h-5 w-5 text-primary-600" />
            <span className="text-primary-600 font-semibold">Pricing Plans</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${plan.popular ? 'ring-4 ring-primary-600 transform md:scale-105' : ''
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.gradient} text-gray-800 px-4 py-1 text-sm font-semibold rounded-bl-lg`}>
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
                      ) : (
                        <XMarkIcon className="h-6 w-6 text-gray-300 flex-shrink-0 mr-3" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.name.toLowerCase())}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-gray-800 hover:shadow-xl`
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Have questions?{' '}
            <a href="#" className="text-primary-600 font-semibold hover:underline">
              Check our FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;