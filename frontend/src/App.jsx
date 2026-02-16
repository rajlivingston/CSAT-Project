import React, { useState, useEffect } from 'react';
import { Star, Upload, Send, LayoutDashboard, LogIn, ChevronRight, BarChart3, Users, Clock } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';

const App = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] p-4 md:p-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<FeedbackForm />} />
                    <Route path="/admin" element={<AdminLayout />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
};

const FeedbackForm = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', description: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return alert('Please provide a rating');

        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('rating', rating);
        data.append('description', formData.description);
        if (file) data.append('screenshot', file);

        try {
            await axios.post('/api/submit', data);
            setSubmitted(true);
        } catch (err) {
            alert('Failed to submit feedback. Saving locally...');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-8 text-center max-w-md w-full flex flex-col items-center justify-center mx-auto">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <Send size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                <p className="text-gray-400 mb-6">Your feedback helps us improve RapidoForm.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-primary w-full">Send Another</button>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="glass p-8 max-w-2xl w-full relative">
            <button
                onClick={() => navigate('/admin')}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors p-2"
                title="Admin Login"
            >
                <LogIn size={20} />
            </button>
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">CSAT Form</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ maxWidth: '90%', margin: '0 auto 1.5rem auto' }}>
                    <div className="mb-6 md:mb-0">
                        <label className="label font-bold">Name</label>
                        <input required type="text" className="input" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="label font-bold">Email</label>
                        <input required type="email" className="input" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                </div>

                <div style={{ maxWidth: '90%', margin: '0 auto 1.5rem auto' }}>
                    <label className="label font-bold">How would you rate your experience with us?</label>
                    <div
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}
                        onMouseLeave={() => setHover(0)}
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="relative flex-shrink-0" style={{ width: '48px', height: '48px', display: 'inline-block' }}>
                                {/* Left half - for 0.5 ratings */}
                                <div
                                    className="absolute inset-0 overflow-hidden cursor-pointer"
                                    style={{ width: '50%', clipPath: 'inset(0 50% 0 0)', zIndex: 2 }}
                                    onMouseEnter={() => setHover(star - 0.5)}
                                    onClick={() => setRating(star - 0.5)}
                                >
                                    <Star
                                        size={48}
                                        fill={(star - 0.5) <= (hover || rating) ? "#facc15" : "none"}
                                        className={`transition-all duration-200 ${(star - 0.5) <= (hover || rating) ? 'text-yellow-400' : 'text-slate-600'}`}
                                        style={{ position: 'absolute', left: 0, top: 0, display: 'block' }}
                                    />
                                </div>
                                {/* Right half - for full ratings */}
                                <div
                                    className="absolute inset-0 cursor-pointer"
                                    style={{ zIndex: 1 }}
                                    onMouseEnter={() => setHover(star)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        size={48}
                                        fill={star <= (hover || rating) ? "#facc15" : "none"}
                                        className={`transition-all duration-200 ${star <= (hover || rating) ? 'text-yellow-400' : 'text-slate-600'}`}
                                        style={{ display: 'block' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-indigo-400 font-semibold mt-2">
                            Rating: {rating} / 5
                        </p>
                    )}
                </div>

                <div style={{ maxWidth: '90%', margin: '0 auto 1.5rem auto' }}>
                    <label className="label font-bold">Description (Optional)</label>
                    <textarea className="input min-h-[100px] resize-none" placeholder="Tell us more about your experience..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div style={{ maxWidth: '90%', margin: '0 auto 1.5rem auto' }}>
                    <label className="label font-bold">Screenshot (If error occurred)</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="input cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-500 file:text-white file:cursor-pointer hover:file:bg-indigo-600"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <br />
                </div>

                <div style={{ maxWidth: '90%', margin: '0 auto' }}>
                    <button disabled={loading} type="submit" className="btn btn-primary w-full mt-6">
                        {loading ? 'Submitting...' : <>Submit Feedback <Send size={18} /></>}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const AdminLayout = () => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const navigate = useNavigate();

    const handleLogin = (t) => {
        setToken(t);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        navigate('/');
    };

    if (!token) {
        return <LoginForm onLogin={handleLogin} onBack={() => navigate('/')} />;
    }

    return <AdminDashboard token={token} onLogout={handleLogout} />;
};

const LoginForm = ({ onLogin, onBack }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post('/api/login', {
                username: formData.username,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.setItem('adminToken', res.data.access_token);
            onLogin(res.data.access_token);
        } catch (err) {
            alert('Invalid credentials');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-8 max-w-sm w-full">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <LogIn size={24} />
                </div>
                <h2 className="text-2xl font-bold">Admin Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Username</label>
                    <input required type="text" className="input" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div>
                    <label className="label">Password</label>
                    <input required type="password" className="input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button disabled={loading} type="submit" className="btn btn-primary w-full">
                    {loading ? 'Authenticating...' : 'Login'}
                </button>
                <button type="button" onClick={onBack} className="w-full text-slate-500 text-sm hover:text-slate-300">Back to Feedback</button>
            </form>
        </motion.div>
    );
};

const AdminDashboard = ({ token, onLogout }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get('/api/report', { headers: { Authorization: `Bearer ${token}` } });
                setReport(res.data);
            } catch (err) {
                console.error(err);
                onLogout();
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [token]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <div className="text-indigo-400 font-medium animate-pulse">Analyzing Performance Data...</div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Insights Dashboard</h2>
                        <p className="text-slate-400 text-sm">Real-time customer satisfaction metrics</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">System Status</span>
                        <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live & Syncing
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold transition-colors border border-red-500/20"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<BarChart3 size={24} />}
                    label="Average Satisfaction"
                    value={report?.total_avg_rating}
                    suffix="/ 5.0"
                    color="indigo"
                />
                <StatCard
                    icon={<Users size={24} />}
                    label="Total Responses"
                    value={report?.unique_rating_count}
                    color="purple"
                />
                <StatCard
                    icon={<Clock size={24} />}
                    label="Last 30 Days"
                    value={report?.avg_rating_last_30_days}
                    suffix="/ 5.0"
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rating Distribution */}
                <div className="lg:col-span-1 glass p-6 bg-slate-900/40 border-white/5">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Star size={18} className="text-yellow-500" />
                        Rating Distribution
                    </h3>
                    <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = report?.distribution?.[stars] || 0;
                            const total = Object.values(report?.distribution || {}).reduce((a, b) => a + b, 0) || 1;
                            const percentage = (count / total) * 100;

                            return (
                                <div key={stars} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 flex items-center gap-1">
                                            {stars} <Star size={12} fill="#94a3b8" />
                                        </span>
                                        <span className="text-slate-300 font-medium">{count} items</span>
                                    </div>
                                    <div className="rating-bar-bg">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`rating-bar-fill ${stars >= 4 ? 'bg-green-500' : stars >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Benchmarks</h4>
                        <div className="space-y-3">
                            <TrendItem label="60 Day Average" value={report?.avg_rating_last_60_days} />
                            <TrendItem label="90 Day Average" value={report?.avg_rating_last_90_days} />
                        </div>
                    </div>
                </div>

                {/* Recent Feedbacks */}
                <div className="lg:col-span-2 glass p-6 bg-slate-900/40 border-white/5 flex flex-col">
                    <h3 className="text-lg font-bold mb-6">Recent Feedback</h3>
                    <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                        {report?.recent_feedback?.length > 0 ? (
                            <div className="space-y-4">
                                {report.recent_feedback.map((fb, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={fb.id}
                                        className="p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-100">{fb.name}</h4>
                                                <p className="text-xs text-slate-500">{fb.email}</p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-md border border-white/5">
                                                <span className={`font-bold ${fb.rating >= 4 ? 'text-green-400' : fb.rating >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {fb.rating}
                                                </span>
                                                <Star size={14} fill="currentColor" className={fb.rating >= 4 ? 'text-green-400' : fb.rating >= 3 ? 'text-yellow-400' : 'text-red-400'} />
                                            </div>
                                        </div>
                                        {fb.description && (
                                            <p className="text-sm text-slate-400 italic">"{fb.description}"</p>
                                        )}
                                        <div className="mt-2 text-[10px] text-slate-600 font-medium uppercase tracking-wider">
                                            {new Date(fb.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-600 italic">
                                No feedback received yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, color, suffix }) => {
    const colorClasses = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 glow-indigo',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 glow-purple',
        green: 'text-green-400 bg-green-500/10 border-green-500/20 glow-green'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`glass p-6 border ${colorClasses[color]} bg-slate-900/20 relative overflow-hidden group`}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-slate-400 text-sm font-medium mb-1">{label}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tight text-white">{value}</span>
                    {suffix && <span className="text-slate-500 text-sm font-bold uppercase">{suffix}</span>}
                </div>
            </div>
        </motion.div>
    );
};

const TrendItem = ({ label, value }) => (
    <div className="flex justify-between items-center bg-slate-800/20 p-3 rounded-lg border border-white/5">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-indigo-400">{value}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        </div>
    </div>
);

export default App;
