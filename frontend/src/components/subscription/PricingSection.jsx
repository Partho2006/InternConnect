import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  BoltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// ─── Checkout Modal (WIDE HORIZONTAL LAYOUT) ──────────────────
const CheckoutModal = ({ plan, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    cardNumber: '', expiry: '', cvv: '', cardName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length >= 2) return clean.slice(0, 2) + '/' + clean.slice(2, 4);
    return clean;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') value = formatCardNumber(value);
    if (name === 'expiry') value = formatExpiry(value);
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3);
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.cardName.trim()) errs.cardName = 'Required';
    if (form.cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Invalid card number';
    if (form.expiry.length < 5) errs.expiry = 'Invalid';
    if (form.cvv.length < 3) errs.cvv = 'Invalid';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handlePay = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setStep(3);
    setTimeout(() => onSuccess(plan), 2500);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border-2 rounded-xl text-sm font-medium focus:outline-none focus:border-violet-500 transition-all ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      {/* WIDE MODAL */}
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>

        {step < 3 ? (
          <div className="flex flex-row">

            {/* ── LEFT PANEL ── */}
            <div className="w-72 flex-shrink-0 bg-gradient-to-b from-violet-700 to-fuchsia-700 text-white p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    {plan.icon}
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Upgrading to</p>
                    <h3 className="text-2xl font-black">{plan.name}</h3>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-white/20">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-white/60 mb-1 text-sm">/{plan.period}</span>
                  </div>
                  <p className="text-white/50 text-xs mt-1">Billed monthly</p>
                </div>

                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Included</p>
                  <ul className="space-y-2">
                    {plan.features.filter(f => f.included).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircleIcon className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-xs text-white/80 font-medium">{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3 mt-4">
                <LockClosedIcon className="h-4 w-4 text-white/60 flex-shrink-0" />
                <p className="text-xs text-white/60">Secure & encrypted</p>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 p-8">
              {/* Step Tabs */}
              <div className="flex items-center gap-3 mb-6">
                {['Your Details', 'Payment Info'].map((s, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                      step === i + 1 ? 'bg-violet-100 text-violet-700'
                      : step > i + 1 ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        step > i + 1 ? 'bg-green-500 text-white'
                        : step === i + 1 ? 'bg-violet-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step > i + 1 ? '✓' : i + 1}
                      </div>
                      {s}
                    </div>
                    {i < 1 && <ArrowRightIcon className={`h-4 w-4 ${step > 1 ? 'text-green-400' : 'text-gray-300'}`} />}
                  </React.Fragment>
                ))}
              </div>

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-5">Tell us about yourself</h2>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={`${inputClass('name')} pl-10`} />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={`${inputClass('email')} pl-10`} />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className={`${inputClass('phone')} pl-10`} />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>}
                    </div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-black text-base hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-5">Payment Details</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Card Holder Name</label>
                      <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Name on card" className={inputClass('cardName')} />
                      {errors.cardName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.cardName}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
                      <div className="relative">
                        <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} className={`${inputClass('cardNumber')} pl-10 font-mono tracking-widest`} />
                      </div>
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Expiry</label>
                      <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" maxLength={5} className={`${inputClass('expiry')} font-mono text-center`} />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">CVV</label>
                      <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="•••" maxLength={3} type="password" className={`${inputClass('cvv')} font-mono text-center`} />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-2xl px-5 py-3 mb-4">
                    <span className="text-sm font-bold text-gray-700">Total due today</span>
                    <span className="text-2xl font-black text-violet-700">{plan.price}</span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-5 py-3.5 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition text-sm">
                      ← Back
                    </button>
                    <button
                      onClick={handlePay}
                      disabled={loading}
                      className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-black text-sm hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Processing...</>
                      ) : (
                        <><LockClosedIcon className="h-4 w-4" /> Pay {plan.price} Securely</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── SUCCESS ── */
          <div className="flex flex-row">
            <div className="w-72 flex-shrink-0 bg-gradient-to-b from-green-500 to-emerald-600 text-white p-8 flex flex-col items-center justify-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</div>
              </div>
              <h3 className="text-2xl font-black text-center mb-1">Payment Done!</h3>
              <p className="text-white/70 text-sm text-center">Subscription active</p>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome to {plan.name}! 🚀</h2>
              <p className="text-gray-500 text-base mb-5">You now have access to all {plan.name} features.</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {plan.features.filter(f => f.included).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                    <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-700">{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                </div>
                <p className="text-sm font-medium">Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Pricing Section ───────────────────────────────────────────
const PricingSection = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      numericPrice: 0,
      period: 'forever',
      description: 'Everything you need to start',
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      color: 'from-slate-500 to-slate-600',
      ringColor: 'ring-slate-200',
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
      plan: 'free',
      popular: false
    },
    {
      name: 'Basic',
      price: '₹499',
      numericPrice: 499,
      period: 'per month',
      description: 'For active job seekers',
      icon: <BoltIcon className="h-6 w-6" />,
      color: 'from-violet-600 to-fuchsia-600',
      ringColor: 'ring-violet-300',
      features: [
        { text: '20 applications per day', included: true },
        { text: '10 job posts per day', included: true },
        { text: 'Enhanced profile', included: true },
        { text: 'Email support', included: true },
        { text: 'Priority support', included: true },
        { text: 'Featured listings', included: false },
        { text: 'Analytics dashboard', included: false },
      ],
      cta: 'Get Basic',
      plan: 'basic',
      popular: true
    },
    {
      name: 'Premium',
      price: '₹999',
      numericPrice: 999,
      period: 'per month',
      description: 'Unlimited everything',
      icon: <RocketLaunchIcon className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-500',
      ringColor: 'ring-amber-300',
      features: [
        { text: 'Unlimited applications', included: true },
        { text: 'Unlimited job posts', included: true },
        { text: 'Premium profile badge', included: true },
        { text: '24/7 Priority support', included: true },
        { text: 'Featured listings', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Early access features', included: true },
      ],
      cta: 'Get Premium',
      plan: 'premium',
      popular: false
    }
  ];

  const handlePlanClick = (plan) => {
    if (plan.plan === 'free' || currentPlan === plan.plan) {
      toast('You are already on this plan!', { icon: '👋' });
      return;
    }
    if (!user) { navigate('/login'); return; }
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleSuccess = (plan) => {
    setCurrentPlan(plan.plan);
    setShowCheckout(false);
    toast.success(`🎉 Upgraded to ${plan.name}!`);
    setTimeout(() => navigate(user?.role === 'student' ? '/student/dashboard' : '/company/dashboard'), 1000);
  };

  return (
    <>
      <section id="pricing" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-violet-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-8">
              <SparklesIcon className="h-4 w-4" />
              Pricing
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 leading-none mb-6">
              Simple,
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"> Honest</span>
              <br />Pricing.
            </h2>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              No hidden fees. Start free and upgrade when ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl border-2 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl overflow-hidden ${
                  plan.popular
                    ? `ring-4 ${plan.ringColor} border-transparent shadow-xl scale-105`
                    : 'border-gray-200 shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-center py-2 text-xs font-black uppercase tracking-widest">
                    ⚡ Most Popular
                  </div>
                )}

                <div className={`p-8 flex flex-col h-full ${plan.popular ? 'pt-12' : ''}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${plan.color} text-white`}>{plan.icon}</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                      <p className="text-xs text-gray-500">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-400 text-sm mb-1">/{plan.period}</span>
                    </div>
                    {plan.numericPrice > 0 && <p className="text-xs text-gray-400 mt-1">Cancel anytime</p>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        {feature.included ? (
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                            <CheckCircleIcon className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <XMarkIcon className="h-3 w-3 text-gray-300" />
                          </div>
                        )}
                        <span className={`text-sm font-medium ${feature.included ? 'text-gray-800' : 'text-gray-400'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-4 rounded-2xl font-black text-base transition-all transform hover:scale-105 ${
                      plan.plan === 'free' || currentPlan === plan.plan
                        ? 'bg-gray-100 text-gray-500 cursor-default hover:scale-100'
                        : `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-2xl`
                    }`}
                  >
                    {currentPlan === plan.plan ? '✓ Current Plan' : plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2"><LockClosedIcon className="h-4 w-4" /><span>Secure Payment</span></div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Cancel Anytime</span>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <span>No Hidden Charges</span>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <span>Instant Activation</span>
          </div>
        </div>
      </section>

      {showCheckout && selectedPlan && (
        <CheckoutModal
          plan={selectedPlan}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default PricingSection;