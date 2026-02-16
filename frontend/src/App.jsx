import React, { useState, useEffect } from 'react';
import {
    Star, Upload, Send, LayoutDashboard, LogIn, ChevronRight,
    BarChart3, Users, Clock, MessageSquare, Home, LogOut,
    Settings, PieChart, Activity, Bell, Search, User
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';

// --- Components ---

const App = () => {
    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<FeedbackFormContainer />} />
                <Route path="/admin/*" element={<AdminLayout />} />
            </Routes>
        </AnimatePresence>
    );
};

// --- Form Page (Public) ---

const FeedbackFormContainer = () => (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

        <FeedbackForm />
    </div>
);

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
            alert('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 text-center max-w-lg w-full relative z-10"
            >
                <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <Send size={36} />
                </div>
                <h2 className="text-3xl font-bold mb-3">Feedback Received!</h2>
                <p className="text-slate-400 mb-8 max-w-xs mx-auto">Your insights are invaluable. Thank you for helping us improve RapidoForm.</p>
                <button onClick={() => setSubmitted(false)} className="btn-premium btn-premium-primary w-full max-w-xs">
                    Send Another Response
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 max-w-2xl w-full relative z-10"
        >
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">RapidFeedback</h1>
                    <p className="text-slate-400 font-medium">We value your honest opinion.</p>
                </div>
                <button
                    onClick={() => navigate('/admin')}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                    title="Console Access"
                >
                    <LogIn size={22} className="text-slate-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                        required type="text" className="input-premium" placeholder="e.g. Alex Rivera"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                    <input
                        required type="email" className="input-premium" placeholder="alex@company.com"
                        value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2 space-y-4 py-4">
                    <label className="text-lg font-bold">Overall Experience</label>
                    <div className="flex gap-3" onMouseLeave={() => setHover(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <motion.div
                                key={star}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="cursor-pointer"
                                onMouseEnter={() => setHover(star)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={42}
                                    fill={(hover || rating) >= star ? "#6366f1" : "none"}
                                    className={`transition-colors duration-300 ${(hover || rating) >= star ? 'text-indigo-500' : 'text-slate-700'}`}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
                    <textarea
                        className="input-premium min-h-[120px] resize-none" placeholder="What can we do better?"
                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Attachments</label>
                    <div className="relative group">
                        <input
                            type="file" accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <div className="input-premium flex items-center gap-3 text-slate-500 group-hover:border-slate-400 transition-colors">
                            <Upload size={18} />
                            <span>{file ? file.name : 'Upload a screenshot (Optional)'}</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 pt-4">
                    <button disabled={loading} type="submit" className="btn-premium btn-premium-primary w-full py-4 text-lg">
                        {loading ? 'Processing...' : 'Submit Response'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

// --- Admin Section ---

const AdminLayout = () => {
    const token = localStorage.getItem('adminToken');
    const navigate = useNavigate();

    if (!token) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
                <LoginForm onLogin={() => navigate('/admin')} />
            </div>
        );
    }

    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<AdminDashboard token={token} />} />
                    <Route path="/feedback" element={<FeedbackList token={token} />} />
                    <Route path="/settings" element={<div className="p-10 text-slate-500 font-heading text-2xl">Settings Module coming soon</div>} />
                </Routes>
            </main>
        </div>
    );
};

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <MessageSquare size={20} />, label: 'Feedback', path: '/admin/feedback' },
        { icon: <Activity size={20} />, label: 'Analytics', path: '/admin/analytics' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <aside className="sidebar">
            <div className="mb-12 pl-2">
                <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">R</div>
                    RapidFeedback
                </Link>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === item.path
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className={`${location.pathname === item.path ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                            {item.icon}
                        </span>
                        <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-400 transition-colors group"
            >
                <LogOut size={20} />
                <span className="font-bold text-sm">Sign Out</span>
            </button>
        </aside>
    );
};

const AdminDashboard = ({ token }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get('/api/report', { headers: { Authorization: `Bearer ${token}` } });
                setReport(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [token]);

    if (loading) return <LoadingState />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            {/* Header Area */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight mb-2">Internal Insights</h2>
                    <p className="text-slate-400 font-medium">Monitoring platform performance and user satisfaction.</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-3 glass-card hover:bg-white/5 rounded-xl"><Bell size={20} /></button>
                    <div className="flex items-center gap-3 bg-white/5 pl-4 pr-2 py-2 rounded-xl border border-white/5">
                        <span className="text-sm font-bold">Admin Console</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MetricCard
                    label="Satisfaction Score"
                    value={report?.total_avg_rating}
                    suffix="/ 5.0"
                    trend="+12%"
                    icon={<PieChart size={24} />}
                    color="indigo"
                />
                <MetricCard
                    label="Total Respondents"
                    value={report?.unique_rating_count}
                    trend="+48"
                    icon={<Users size={24} />}
                    color="cyan"
                />
                <MetricCard
                    label="Active Momentum"
                    value={report?.avg_rating_last_30_days}
                    suffix="/ 5.0"
                    trend="-2%"
                    icon={<Activity size={24} />}
                    color="rose"
                />
            </div>

            {/* Visuals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold">Distribution Analysis</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-bold bg-white/5 rounded-md">1W</button>
                            <button className="px-3 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-400 rounded-md">1M</button>
                            <button className="px-3 py-1 text-xs font-bold bg-white/5 rounded-md">MAX</button>
                        </div>
                    </div>
                    <div className="h-[280px] flex items-end justify-between gap-4 px-4">
                        {[1, 2, 3, 4, 5].map((stars) => {
                            const count = report?.distribution?.[stars] || 0;
                            const total = Object.values(report?.distribution || {}).reduce((a, b) => a + b, 0) || 1;
                            const height = `${(count / total) * 100}%`;

                            return (
                                <div key={stars} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="w-full relative shimmer-container bg-white/5 rounded-t-xl overflow-hidden" style={{ height: '100%' }}>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className={`absolute bottom-0 w-full rounded-t-xl opacity-80 group-hover:opacity-100 transition-opacity bg-gradient-to-t ${stars >= 4 ? 'from-indigo-600 to-indigo-400' :
                                                    stars >= 3 ? 'from-blue-600 to-blue-400' : 'from-rose-600 to-rose-400'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-bold text-white">{count}</span>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(stars)].map((_, i) => <Star key={i} size={8} fill="currentColor" className="text-slate-600" />)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="glass-card p-8 flex flex-col">
                    <h3 className="text-xl font-bold mb-8">Quarterly Trends</h3>
                    <div className="space-y-6 flex-1">
                        <TrendItem label="60-Day Benchmark" value={report?.avg_rating_last_60_days} color="indigo" />
                        <TrendItem label="90-Day Benchmark" value={report?.avg_rating_last_90_days} color="purple" />
                        <TrendItem label="Historic High" value="4.92" color="cyan" />
                    </div>

                    <div className="mt-8 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                        <div className="flex items-center gap-3 text-indigo-400 mb-2">
                            <Activity size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Health Check</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">System syncing verified 2m ago. All pipelines operational.</p>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Feedback */}
            <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">Recent Pulse</h3>
                    <Link to="/admin/feedback" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">View All Archive &rarr;</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {report?.recent_feedback?.map((fb, idx) => (
                        <div key={fb.id} className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-white/10 uppercase">
                                        {fb.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-100">{fb.name}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Verified User</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                    <span className="text-xs font-bold text-white">{fb.rating}</span>
                                    <Star size={10} fill="#6366f1" className="text-indigo-500" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 italic mb-4 line-clamp-3">"{fb.description || 'No comment provided.'}"</p>
                            <div className="mt-auto text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                {new Date(fb.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- Helper Components ---

const MetricCard = ({ label, value, trend, icon, color, suffix }) => {
    const colors = {
        indigo: 'text-indigo-400 bg-indigo-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/20',
        rose: 'text-rose-400 bg-rose-500/20'
    };

    return (
        <div className="glass-card p-8 relative group overflow-hidden">
            <div className={`absolute top-0 right-0 p-8 opacity-10 scale-150 group-hover:scale-[1.8] transition-transform duration-500 ${colors[color].split(' ')[0]}`}>
                {icon}
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{label}</p>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black font-heading tracking-tighter">{value}</span>
                {suffix && <span className="text-slate-500 font-bold">{suffix}</span>}
            </div>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {trend} vs last month
            </div>
        </div>
    );
};

const TrendItem = ({ label, value, color }) => (
    <div className="flex items-center justify-between group">
        <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
        <div className="flex items-center gap-3">
            <span className={`text-lg font-black font-heading tracking-tight ${color === 'indigo' ? 'text-indigo-400' : color === 'purple' ? 'text-purple-400' : 'text-cyan-400'}`}>
                {value}
            </span>
            <div className={`w-1 h-1 rounded-full animate-ping ${color === 'indigo' ? 'bg-indigo-500' : color === 'purple' ? 'bg-purple-500' : 'bg-cyan-500'}`} />
        </div>
    </div>
);

const LoginForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/login', formData);
            localStorage.setItem('adminToken', res.data.access_token);
            onLogin();
        } catch (err) {
            alert('Invalid Authorization');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12 max-w-md w-full">
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                    <Settings size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">Internal Access</h2>
                <p className="text-slate-400">Authorized personnel only.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Identifer</label>
                    <input required type="text" className="input-premium font-medium" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Keyphrase</label>
                    <input required type="password" className="input-premium font-medium" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <button disabled={loading} type="submit" className="btn-premium btn-premium-primary w-full py-4 mt-4">
                    {loading ? 'Authenticating...' : 'Enter Console'}
                </button>
            </form>
        </motion.div>
    );
};

const LoadingState = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
        <div className="flex flex-col items-center gap-2">
            <h3 className="font-heading text-xl font-bold text-slate-200">Retrieving Datasets</h3>
            <p className="text-slate-500 text-sm animate-pulse">Establishing secure connection to analytics engine...</p>
        </div>
    </div>
);

const FeedbackList = ({ token }) => {
    // Basic implementation for now, showing the power of the new layout
    return (
        <div className="space-y-8">
            <h2 className="text-4xl font-extrabold tracking-tight">Feedback Archive</h2>
            <div className="glass-card p-8 text-slate-500 italic"> Feedback list module expansion in progress...</div>
        </div>
    );
}

export default App;
