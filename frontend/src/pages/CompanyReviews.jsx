import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
    StarIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    UserGroupIcon,
    ArrowLeftIcon,
    HandThumbUpIcon,
    CheckBadgeIcon,
    XMarkIcon,
    ChevronDownIcon,
    FaceSmileIcon,
    FaceFrownIcon,
    LightBulbIcon,
    CurrencyRupeeIcon,
    BriefcaseIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

// ── Star Rating Input ─────────────────────────────────────────
const StarInput = ({ value, onChange, size = 'md' }) => {
    const [hovered, setHovered] = useState(0);
    const sz = size === 'lg' ? 'h-9 w-9' : 'h-6 w-6';
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                >
                    {(hovered || value) >= star
                        ? <StarSolid className={`${sz} text-amber-400`} />
                        : <StarIcon className={`${sz} text-gray-300`} />
                    }
                </button>
            ))}
        </div>
    );
};

// ── Star Display ──────────────────────────────────────────────
const StarDisplay = ({ value, size = 'sm' }) => {
    const sz = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                star <= Math.round(value)
                    ? <StarSolid key={star} className={`${sz} text-amber-400`} />
                    : <StarIcon key={star} className={`${sz} text-amber-300`} />
            ))}
        </div>
    );
};

// ── Rating Bar ────────────────────────────────────────────────
const RatingBar = ({ label, value, color = 'bg-amber-400' }) => (
    <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 w-24 font-medium">{label}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
            <div
                className={`${color} h-2.5 rounded-full transition-all duration-700`}
                style={{ width: `${(value / 5) * 100}%` }}
            />
        </div>
        <span className="text-sm font-black text-gray-800 w-8">{value}</span>
    </div>
);

// ── Write Review Modal ────────────────────────────────────────
const WriteReviewModal = ({ company, onClose, onSubmit }) => {
    const [form, setForm] = useState({
        overallRating: 0, stipendRating: 0, cultureRating: 0,
        learningRating: 0, mentorRating: 0,
        title: '', pros: '', cons: '', advice: '',
        role: '', duration: '', stipend: '', workType: 'onsite',
        year: new Date().getFullYear(), wouldRecommend: null
    });
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1=ratings, 2=written, 3=context

    const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

    const handleSubmit = async () => {
        if (form.overallRating === 0) return toast.error('Please give an overall rating');
        if (!form.title.trim()) return toast.error('Please add a review title');
        if (!form.pros.trim()) return toast.error('Please add what you liked');
        if (!form.cons.trim()) return toast.error('Please add what could be better');
        if (!form.role.trim()) return toast.error('Please add your role');
        if (form.wouldRecommend === null) return toast.error('Would you recommend this company?');

        setSubmitting(true);
        try {
            await onSubmit({ ...form, companyId: company._id });
            toast.success('Review submitted anonymously!');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit');
        }
        setSubmitting(false);
    };

    const stepValid = () => {
        if (step === 1) return form.overallRating > 0 && form.stipendRating > 0 && form.cultureRating > 0 && form.learningRating > 0 && form.mentorRating > 0;
        if (step === 2) return form.title.trim() && form.pros.trim() && form.cons.trim();
        return true;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-6 text-white flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Anonymous Review</p>
                            <h2 className="text-2xl font-black">{company.companyName || company.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                    {/* Step dots */}
                    <div className="flex items-center gap-2 mt-4">
                        {['Ratings', 'Your Review', 'Context'].map((s, i) => (
                            <React.Fragment key={i}>
                                <div className={`flex items-center gap-2 ${step === i + 1 ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step > i + 1 ? 'bg-white text-orange-600' : step === i + 1 ? 'bg-white text-orange-600' : 'bg-white/30 text-black'}`}>
                                        {step > i + 1 ? '✓' : i + 1}
                                    </div>
                                    <span className="text-sm font-bold hidden sm:block">{s}</span>
                                </div>
                                {i < 2 && <div className={`flex-1 h-0.5 rounded ${step > i + 1 ? 'bg-white' : 'bg-white/30'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8">

                    {/* STEP 1: Ratings */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-gray-900">Rate your experience</h3>
                            <p className="text-sm text-gray-500 -mt-3">Your identity stays completely hidden. Be honest!</p>

                            {[
                                { key: 'overallRating', label: '⭐ Overall Experience', desc: 'How was the overall internship?' },
                                { key: 'stipendRating', label: '💰 Stipend & Compensation', desc: 'Was the pay fair for the work?' },
                                { key: 'cultureRating', label: '🏢 Work Culture', desc: 'Was the environment healthy?' },
                                { key: 'learningRating', label: '📚 Learning Opportunities', desc: 'Did you grow professionally?' },
                                { key: 'mentorRating', label: '🤝 Mentorship Quality', desc: 'Was your mentor supportive?' },
                            ].map(({ key, label, desc }) => (
                                <div key={key} className="bg-gray-50 rounded-2xl p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <p className="font-black text-gray-900">{label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                        </div>
                                        <StarInput value={form[key]} onChange={v => set(key, v)} size="lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: Written Review */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-black text-gray-900">Write your review</h3>

                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Review Title *</label>
                                <input
                                    value={form.title}
                                    onChange={e => set('title', e.target.value)}
                                    placeholder="e.g. Great learning experience but low stipend"
                                    maxLength={100}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition bg-amber-300 focus:bg-orange-200"
                                />
                                <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/100</p>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FaceSmileIcon className="h-4 w-4 text-green-500" /> Pros — What did you like? *
                                </label>
                                <textarea
                                    value={form.pros}
                                    onChange={e => set('pros', e.target.value)}
                                    placeholder="Great team, learned a lot about React, flexible work hours, good mentorship..."
                                    rows={4}
                                    maxLength={1000}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 transition bg-green-50/40 focus:bg-green-200 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FaceFrownIcon className="h-4 w-4 text-red-500" /> Cons — What could be better? *
                                </label>
                                <textarea
                                    value={form.cons}
                                    onChange={e => set('cons', e.target.value)}
                                    placeholder="Stipend was low for the work load, limited mentorship at times, unclear expectations..."
                                    rows={4}
                                    maxLength={1000}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 transition bg-red-50/40 focus:bg-red-200 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <LightBulbIcon className="h-4 w-4 text-amber-500" /> Advice to Management (Optional)
                                </label>
                                <textarea
                                    value={form.advice}
                                    onChange={e => set('advice', e.target.value)}
                                    placeholder="Please improve the onboarding process, give interns more ownership..."
                                    rows={3}
                                    maxLength={500}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition bg-amber-50/40 focus:bg-orange-200 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Context */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-black text-gray-900">Add context</h3>
                            <p className="text-sm text-gray-500 -mt-3">Helps others understand your situation. Still anonymous!</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Your Role / Position *</label>
                                    <div className="relative">
                                        <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            value={form.role}
                                            onChange={e => set('role', e.target.value)}
                                            placeholder="e.g. Frontend Developer Intern"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50 focus:bg-orange-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Duration *</label>
                                    <select
                                        value={form.duration}
                                        onChange={e => set('duration', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50 appearance-none"
                                    >
                                        <option value="">Select duration</option>
                                        {['1 month', '2 months', '3 months', '4 months', '6 months', '1 year'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Work Type</label>
                                    <select
                                        value={form.workType}
                                        onChange={e => set('workType', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50 appearance-none"
                                    >
                                        <option value="onsite">Onsite</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Actual Stipend (₹/month)</label>
                                    <div className="relative">
                                        <CurrencyRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={form.stipend}
                                            onChange={e => set('stipend', e.target.value)}
                                            placeholder="e.g. 15000"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50 focus:bg-orange-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Year of Internship</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={form.year}
                                            onChange={e => set('year', e.target.value)}
                                            min={2015}
                                            max={new Date().getFullYear()}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition bg-gray-50 focus:bg-orange-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Would Recommend */}
                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-3">Would you recommend this company? *</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => set('wouldRecommend', true)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-black text-base transition-all ${form.wouldRecommend === true
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 text-gray-500 hover:border-green-300'
                                            }`}
                                    >
                                        <FaceSmileIcon className="h-6 w-6" />
                                        Yes, Recommend!
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => set('wouldRecommend', false)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-black text-base transition-all ${form.wouldRecommend === false
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 text-gray-500 hover:border-red-300'
                                            }`}
                                    >
                                        <FaceFrownIcon className="h-6 w-6" />
                                        Not Really
                                    </button>
                                </div>
                            </div>

                            {/* Anonymous note */}
                            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                                <CheckBadgeIcon className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-orange-800 font-medium">
                                    Your review is <strong>100% anonymous</strong>. Your name, email, and identity are never shared with the company or other users.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer buttons */}
                <div className="border-t px-8 py-5 flex gap-4 flex-shrink-0 bg-white">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition"
                        >
                            ← Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            onClick={() => stepValid() ? setStep(s => s + 1) : toast.error('Please fill all required fields')}
                            className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            Continue →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {submitting
                                ? <><div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" /> Submitting...</>
                                : '🚀 Submit Anonymous Review'
                            }
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Review Card ───────────────────────────────────────────────
const ReviewCard = ({ review, currentUserId, onHelpful }) => {
    const [expanded, setExpanded] = useState(false);
    const isHelpful = review.helpful?.includes(currentUserId);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-orange-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    {/* Anonymous avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-white font-black text-lg shadow-md">
                        {review.role?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-gray-900">{review.role || 'Intern'}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{review.duration}</span>
                            {review.workType && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${review.workType === 'remote' ? 'bg-green-100 text-green-700'
                                    : review.workType === 'hybrid' ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {review.workType}
                                </span>
                            )}
                            {review.year && <span className="text-xs text-gray-400">{review.year}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <StarDisplay value={review.overallRating} />
                            <span className="text-sm font-bold text-gray-700">{review.overallRating}/5</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {review.wouldRecommend ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            <CheckBadgeIcon className="h-4 w-4" /> Recommends
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                            <XMarkIcon className="h-4 w-4" /> Doesn't Recommend
                        </span>
                    )}
                    {review.stipend && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            ₹{review.stipend.toLocaleString()}/mo
                        </span>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-black text-gray-900 mb-4">"{review.title}"</h3>

            {/* Pros */}
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-black text-green-700 uppercase tracking-wider">Pros</span>
                </div>
                <p className={`text-sm text-gray-700 leading-relaxed ${!expanded && 'line-clamp-2'}`}>{review.pros}</p>
            </div>

            {/* Cons */}
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs font-black text-red-600 uppercase tracking-wider">Cons</span>
                </div>
                <p className={`text-sm text-gray-700 leading-relaxed ${!expanded && 'line-clamp-2'}`}>{review.cons}</p>
            </div>

            {/* Advice - only when expanded */}
            {expanded && review.advice && (
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-black text-amber-700 uppercase tracking-wider">Advice to Management</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.advice}</p>
                </div>
            )}

            {/* Sub-ratings when expanded */}
            {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <RatingBar label="Stipend" value={review.stipendRating} color="bg-emerald-400" />
                    <RatingBar label="Culture" value={review.cultureRating} color="bg-blue-400" />
                    <RatingBar label="Learning" value={review.learningRating} color="bg-violet-400" />
                    <RatingBar label="Mentorship" value={review.mentorRating} color="bg-orange-400" />
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onHelpful(review._id)}
                        className={`flex items-center gap-2 text-sm font-bold transition-all hover:scale-105 ${isHelpful ? 'text-orange-600' : 'text-gray-400 hover:text-orange-500'
                            }`}
                    >
                        <HandThumbUpIcon className="h-4 w-4" />
                        {review.helpful?.length || 0} Helpful
                    </button>
                    <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                </div>
                <button
                    onClick={() => setExpanded(e => !e)}
                    className="flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition"
                >
                    {expanded ? 'Show less' : 'Read more'}
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const CompanyReviews = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [company, setCompany] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [filterRating, setFilterRating] = useState(0);

    useEffect(() => {
        fetchData();
    }, [companyId]);

    const fetchData = async () => {
        try {
            const [companyRes, reviewRes] = await Promise.all([
                axios.get(`/auth/company/${companyId}`),
                axios.get(`/reviews/company/${companyId}`)
            ]);
            setCompany(companyRes.data);
            setReviews(reviewRes.data.reviews);
            setStats(reviewRes.data.stats);
        } catch (err) {
            toast.error('Failed to load reviews');
        }
        setLoading(false);
    };

    const handleSubmitReview = async (formData) => {
        await axios.post('/reviews', formData);
        fetchData();
    };

    const handleHelpful = async (reviewId) => {
        if (!user) return toast.error('Login to mark helpful');
        try {
            await axios.patch(`/reviews/${reviewId}/helpful`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const sortedReviews = [...reviews]
        .filter(r => filterRating === 0 || Math.round(r.overallRating) === filterRating)
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'highest') return b.overallRating - a.overallRating;
            if (sortBy === 'lowest') return a.overallRating - b.overallRating;
            if (sortBy === 'helpful') return (b.helpful?.length || 0) - (a.helpful?.length || 0);
            return 0;
        });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading reviews...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 font-semibold transition">
                        <ArrowLeftIcon className="h-5 w-5" /> Back
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-xl">
                                <BuildingOfficeIcon className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900">
                                    {company?.companyName || company?.name}
                                </h1>
                                <div className="flex items-center gap-4 mt-1 text-gray-500 text-sm flex-wrap">
                                    {company?.industry && <span className="font-medium">{company.industry}</span>}
                                    {company?.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPinIcon className="h-4 w-4" />{company.location}
                                        </span>
                                    )}
                                    {company?.companySize && (
                                        <span className="flex items-center gap-1">
                                            <UserGroupIcon className="h-4 w-4" />{company.companySize} employees
                                        </span>
                                    )}
                                </div>

                                {stats && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <StarDisplay value={parseFloat(stats.overall)} size="md" />
                                        <span className="text-2xl font-black text-gray-900">{stats.overall}</span>
                                        <span className="text-gray-400 text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                                        <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                            {stats.recommendPercent}% recommend
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {user?.role === 'student' && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black text-base hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap"
                            >
                                ✍️ Write Anonymous Review
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* ── LEFT: Stats Sidebar ── */}
                    <div className="lg:col-span-1 space-y-6">
                        {stats ? (
                            <>
                                {/* Overall Score */}
                                <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                                    <h3 className="font-black text-gray-900 text-lg mb-5">Overall Ratings</h3>
                                    <div className="text-center mb-6">
                                        <div className="text-7xl font-black text-gray-900 leading-none">{stats.overall}</div>
                                        <StarDisplay value={parseFloat(stats.overall)} size="lg" />
                                        <p className="text-gray-500 text-sm mt-2">{reviews.length} reviews</p>
                                    </div>
                                    <div className="space-y-3">
                                        <RatingBar label="Stipend" value={stats.stipend} color="bg-emerald-400" />
                                        <RatingBar label="Culture" value={stats.culture} color="bg-blue-400" />
                                        <RatingBar label="Learning" value={stats.learning} color="bg-violet-400" />
                                        <RatingBar label="Mentorship" value={stats.mentor} color="bg-orange-400" />
                                    </div>
                                </div>

                                {/* Stipend Insight */}
                                {stats.avgStipend > 0 && (
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-lg">
                                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Avg. Actual Stipend</p>
                                        <div className="text-4xl font-black mb-1">
                                            ₹{Math.round(stats.avgStipend).toLocaleString()}
                                        </div>
                                        <p className="text-white/70 text-sm">per month (crowdsourced)</p>
                                    </div>
                                )}

                                {/* Recommendation */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Would Recommend</p>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20">
                                            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                                                    strokeDasharray={`${stats.recommendPercent} ${100 - stats.recommendPercent}`}
                                                    strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-base font-black text-gray-900">{stats.recommendPercent}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-2xl">{stats.recommendPercent}%</p>
                                            <p className="text-gray-500 text-sm">of interns recommend</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating filter */}
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Filter by Stars</p>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setFilterRating(0)}
                                            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition ${filterRating === 0 ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            All Reviews ({reviews.length})
                                        </button>
                                        {[5, 4, 3, 2, 1].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setFilterRating(r)}
                                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${filterRating === r ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                            >
                                                <StarDisplay value={r} size="sm" />
                                                <span className="text-gray-500 text-xs">
                                                    ({reviews.filter(rv => Math.round(rv.overallRating) === r).length})
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                                <div className="text-5xl mb-3">🌟</div>
                                <p className="font-black text-gray-900 mb-2">Be the first!</p>
                                <p className="text-sm text-gray-500">No reviews yet. Share your experience anonymously.</p>
                                {user?.role === 'student' && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="mt-4 w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-black text-sm hover:shadow-lg transition"
                                    >
                                        Write First Review
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: Reviews List ── */}
                    <div className="lg:col-span-2">
                        {/* Sort controls */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900">
                                {sortedReviews.length} Review{sortedReviews.length !== 1 ? 's' : ''}
                            </h2>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:border-orange-400 bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="highest">Highest Rated</option>
                                <option value="lowest">Lowest Rated</option>
                                <option value="helpful">Most Helpful</option>
                            </select>
                        </div>

                        {sortedReviews.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-xl font-black text-gray-900 mb-2">No reviews found</p>
                                <p className="text-gray-500">Try a different filter or be the first to review!</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {sortedReviews.map(review => (
                                    <ReviewCard
                                        key={review._id}
                                        review={review}
                                        currentUserId={user?.id}
                                        onHelpful={handleHelpful}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Write Review Modal */}
            {showModal && company && (
                <WriteReviewModal
                    company={company}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmitReview}
                />
            )}
        </div>
    );
};

export default CompanyReviews;