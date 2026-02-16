import React, { useState, useEffect } from 'react';
import {
    Star, Upload, Send, LayoutDashboard, LogIn, ChevronRight,
    BarChart3, Users, Clock, MessageSquare, Home, LogOut,
    Settings, PieChart, Activity, Bell, Search, User,
    TrendingUp, TrendingDown, Eye, ArrowRight, Zap, Shield
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';

/* ═══════════════════ APP ROOT ═══════════════════ */

const App = () => (
    <AnimatePresence mode="wait">
        <Routes>
            <Route path="/" element={<FeedbackPage />} />
            <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
    </AnimatePresence>
);

/* ═══════════════════ FEEDBACK PAGE ═══════════════════ */

const FeedbackPage = () => (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-indigo-500/[0.07] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] bg-violet-500/[0.07] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-[30%] right-[20%] w-[20%] h-[20%] bg-cyan-500/[0.04] blur-[100px] rounded-full pointer-events-none" />
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
        if (rating === 0) return alert('Please select a rating');
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
        } catch { alert('Submission failed. Try again.'); }
        finally { setLoading(false); }
    };

    if (submitted) return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-lg w-full relative z-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Send size={32} />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 font-heading">Thank You!</h2>
            <p className="text-slate-400 mb-8">Your feedback helps us build better experiences.</p>
            <button onClick={() => { setSubmitted(false); setRating(0); setFormData({ name: '', email: '', description: '' }); }}
                className="btn-premium btn-premium-primary w-full max-w-xs mx-auto">Submit Another</button>
        </motion.div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="glass-card p-8 sm:p-10 max-w-2xl w-full relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">Share Feedback</h1>
                    <p className="text-slate-400 mt-1 text-sm">Your honest opinion shapes our product.</p>
                </div>
                <button onClick={() => navigate('/admin')}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/10" title="Admin">
                    <LogIn size={18} className="text-slate-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField label="Full Name" required type="text" placeholder="Alex Rivera"
                    value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                <InputField label="Email" required type="email" placeholder="alex@company.com"
                    value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />

                <div className="sm:col-span-2 py-3">
                    <label className="text-sm font-semibold text-slate-300 block mb-3">Overall Experience</label>
                    <div className="flex gap-2" onMouseLeave={() => setHover(0)}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <motion.button type="button" key={s} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                onMouseEnter={() => setHover(s)} onClick={() => setRating(s)}
                                className={`p-2 rounded-xl transition-colors ${(hover || rating) >= s ? 'bg-indigo-500/10' : 'bg-transparent'}`}>
                                <Star size={36} fill={(hover || rating) >= s ? '#6366f1' : 'none'}
                                    className={`transition-colors duration-200 ${(hover || rating) >= s ? 'text-indigo-400' : 'text-slate-700'}`} />
                            </motion.button>
                        ))}
                        {rating > 0 && <span className="text-indigo-400 text-sm font-bold self-center ml-2">{rating}/5</span>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block pl-0.5">Comments</label>
                    <textarea className="input-premium min-h-[110px] resize-none" placeholder="What could we improve?"
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block pl-0.5">Attachment</label>
                    <div className="relative group">
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={e => setFile(e.target.files[0])} />
                        <div className="input-premium flex items-center gap-3 text-slate-500 group-hover:border-white/10 transition-colors cursor-pointer">
                            <Upload size={16} />
                            <span className="text-sm">{file ? file.name : 'Upload screenshot (optional)'}</span>
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-2 pt-3">
                    <button disabled={loading} type="submit" className="btn-premium btn-premium-primary w-full py-3.5 text-base">
                        {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</span> : 'Submit Feedback'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const InputField = ({ label, value, onChange, ...props }) => (
    <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block pl-0.5">{label}</label>
        <input className="input-premium" value={value} onChange={e => onChange(e.target.value)} {...props} />
    </div>
);

/* ═══════════════════ ADMIN LAYOUT ═══════════════════ */

const AdminLayout = () => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const navigate = useNavigate();

    const handleLogin = (t) => { setToken(t); localStorage.setItem('adminToken', t); };
    const handleLogout = () => { localStorage.removeItem('adminToken'); setToken(null); navigate('/'); };

    if (!token) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-violet-500/[0.06] blur-[140px] rounded-full pointer-events-none" />
            <LoginForm onLogin={handleLogin} />
        </div>
    );

    return (
        <div className="app-container">
            <Sidebar onLogout={handleLogout} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<AdminDashboard token={token} />} />
                    <Route path="/feedback" element={<FeedbackListPage token={token} />} />
                    <Route path="/settings" element={<SettingsPlaceholder />} />
                </Routes>
            </main>
        </div>
    );
};

/* ═══════════════════ LOGIN ═══════════════════ */

const LoginForm = ({ onLogin }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await axios.post('/api/login', form, { headers: { 'Content-Type': 'application/json' } });
            onLogin(res.data.access_token);
        } catch { setError('Invalid credentials. Access denied.'); }
        finally { setLoading(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 sm:p-12 max-w-md w-full relative z-10">
            <div className="text-center mb-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                    className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/20">
                    <Shield size={28} />
                </motion.div>
                <h2 className="text-2xl font-black tracking-tight font-heading">Admin Console</h2>
                <p className="text-slate-500 text-sm mt-1">Secure access for authorized personnel</p>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center font-medium">
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <InputField label="Username" required type="text" placeholder="admin"
                    value={form.username} onChange={v => setForm({ ...form, username: v })} />
                <InputField label="Password" required type="password" placeholder="••••••••"
                    value={form.password} onChange={v => setForm({ ...form, password: v })} />
                <button disabled={loading} type="submit" className="btn-premium btn-premium-primary w-full py-3.5 mt-2">
                    {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</span> : 'Sign In'}
                </button>
                <button type="button" onClick={() => navigate('/')}
                    className="w-full text-sm text-slate-500 hover:text-slate-300 transition-colors pt-1">← Back to Feedback Form</button>
            </form>
        </motion.div>
    );
};

/* ═══════════════════ SIDEBAR ═══════════════════ */

const Sidebar = ({ onLogout }) => {
    const location = useLocation();
    const links = [
        { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin' },
        { icon: <MessageSquare size={18} />, label: 'Feedback', path: '/admin/feedback' },
        { icon: <Settings size={18} />, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <aside className="sidebar">
            <Link to="/" className="flex items-center gap-2.5 mb-10 pl-1 group">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-500/20">R</div>
                <span className="text-lg font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">RapidCSAT</span>
            </Link>

            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-3 pl-3">Navigation</p>
            <nav className="space-y-1 flex-1">
                {links.map(l => {
                    const active = location.pathname === l.path;
                    return (
                        <Link key={l.path} to={l.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'}`}>
                            <span className={active ? 'text-indigo-400' : 'text-slate-500'}>{l.icon}</span>
                            {l.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/5 pt-4 mt-4">
                <button onClick={onLogout}
                    className="flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-rose-400 transition-colors text-sm font-medium w-full rounded-xl hover:bg-rose-500/5">
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </aside>
    );
};

/* ═══════════════════ ADMIN DASHBOARD ═══════════════════ */

const AdminDashboard = ({ token }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/report', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => setReport(r.data))
            .catch(err => {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    window.location.reload();
                }
            })
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <Loader text="Loading analytics..." />;

    const dist = report?.distribution || {};
    const totalFeedback = Object.values(dist).reduce((a, b) => a + b, 0) || 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight font-heading">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Customer satisfaction analytics overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1.5 rounded-full font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 pl-3 pr-1.5 py-1.5 rounded-xl">
                        <span className="text-xs font-semibold text-slate-300">Admin</span>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500" />
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <KPICard label="CSAT Score" value={report?.total_avg_rating} suffix="/5" icon={<Star size={20} />}
                    color="indigo" trend={report?.avg_rating_last_30_days > report?.avg_rating_last_60_days ? 'up' : 'down'} />
                <KPICard label="Total Responses" value={report?.unique_rating_count} icon={<Users size={20} />}
                    color="violet" trend="up" />
                <KPICard label="30-Day Avg" value={report?.avg_rating_last_30_days} suffix="/5" icon={<TrendingUp size={20} />}
                    color="cyan" trend={report?.avg_rating_last_30_days >= 4 ? 'up' : 'down'} />
                <KPICard label="90-Day Avg" value={report?.avg_rating_last_90_days} suffix="/5" icon={<Clock size={20} />}
                    color="amber" trend={report?.avg_rating_last_90_days >= 4 ? 'up' : 'down'} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Distribution Chart */}
                <div className="lg:col-span-3 glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold font-heading text-base">Rating Distribution</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{totalFeedback} total responses</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map(s => {
                            const count = dist[s] || 0;
                            const pct = totalFeedback > 0 ? ((count / totalFeedback) * 100) : 0;
                            const barColor = s >= 4 ? 'bg-emerald-500' : s === 3 ? 'bg-amber-500' : 'bg-rose-500';
                            return (
                                <div key={s} className="flex items-center gap-3 group">
                                    <div className="flex items-center gap-1 w-12 shrink-0">
                                        <span className="text-sm font-bold text-slate-300">{s}</span>
                                        <Star size={12} fill="#6366f1" className="text-indigo-500" />
                                    </div>
                                    <div className="flex-1 h-8 bg-white/[0.03] rounded-lg overflow-hidden relative">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, ease: 'circOut', delay: (5 - s) * 0.1 }}
                                            className={`h-full rounded-lg ${barColor} opacity-80 group-hover:opacity-100 transition-opacity relative`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-lg" />
                                        </motion.div>
                                    </div>
                                    <div className="w-20 text-right shrink-0">
                                        <span className="text-sm font-bold text-slate-200">{count}</span>
                                        <span className="text-xs text-slate-500 ml-1">({pct.toFixed(0)}%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Trends Panel */}
                <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                    <h3 className="font-bold font-heading text-base mb-5">Trend Benchmarks</h3>
                    <div className="space-y-4 flex-1">
                        <BenchmarkRow label="30-Day Average" value={report?.avg_rating_last_30_days} />
                        <BenchmarkRow label="60-Day Average" value={report?.avg_rating_last_60_days} />
                        <BenchmarkRow label="90-Day Average" value={report?.avg_rating_last_90_days} />
                        <BenchmarkRow label="All-Time Score" value={report?.total_avg_rating} highlight />
                    </div>
                    <div className="mt-5 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                        <div className="flex items-center gap-2 text-indigo-400 mb-1">
                            <Zap size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">System Health</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">All services operational. Data synced in real-time.</p>
                    </div>
                </div>
            </div>

            {/* Recent Feedback */}
            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <h3 className="font-bold font-heading text-base">Recent Feedback</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Latest customer submissions</p>
                    </div>
                    <Link to="/admin/feedback" className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {report?.recent_feedback?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {report.recent_feedback.map((fb, i) => (
                            <motion.div key={fb.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-indigo-300 text-sm font-bold border border-white/5 uppercase">
                                            {fb.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-100">{fb.name}</p>
                                            <p className="text-[10px] text-slate-600">{fb.email}</p>
                                        </div>
                                    </div>
                                    <RatingBadge rating={fb.rating} />
                                </div>
                                {fb.description && <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-2 mb-3">"{fb.description}"</p>}
                                <p className="text-[10px] text-slate-600 font-medium">
                                    {fb.created_at && new Date(fb.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-600 text-sm italic">No feedback submissions yet.</div>
                )}
            </div>
        </motion.div>
    );
};

/* ═══════════════════ FEEDBACK LIST PAGE ═══════════════════ */

const FeedbackListPage = ({ token }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/report', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => setFeedbacks(r.data.recent_feedback || []))
            .catch(err => {
                console.error(err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    window.location.reload();
                }
            })
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <Loader text="Loading feedback..." />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight font-heading">Feedback Archive</h1>
                <p className="text-slate-500 text-sm mt-1">All customer submissions in one place</p>
            </div>

            {feedbacks.length > 0 ? (
                <div className="space-y-3">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <div className="col-span-4">Customer</div>
                        <div className="col-span-2">Rating</div>
                        <div className="col-span-4">Comment</div>
                        <div className="col-span-2 text-right">Date</div>
                    </div>
                    {feedbacks.map((fb, i) => (
                        <motion.div key={fb.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card grid grid-cols-12 gap-4 px-5 py-4 items-center">
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-indigo-300 text-sm font-bold border border-white/5 uppercase shrink-0">
                                    {fb.name?.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-100 truncate">{fb.name}</p>
                                    <p className="text-[10px] text-slate-600 truncate">{fb.email}</p>
                                </div>
                            </div>
                            <div className="col-span-2"><RatingBadge rating={fb.rating} /></div>
                            <div className="col-span-4">
                                <p className="text-xs text-slate-400 italic truncate">{fb.description || '—'}</p>
                            </div>
                            <div className="col-span-2 text-right text-[11px] text-slate-500 font-medium">
                                {fb.created_at && new Date(fb.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center text-slate-500 italic text-sm">No feedback submissions found.</div>
            )}
        </motion.div>
    );
};

/* ═══════════════════ SHARED COMPONENTS ═══════════════════ */

const KPICard = ({ label, value, suffix, icon, color, trend }) => {
    const palette = {
        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/15', glow: 'shadow-indigo-500/5' },
        violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/15', glow: 'shadow-violet-500/5' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/15', glow: 'shadow-cyan-500/5' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/15', glow: 'shadow-amber-500/5' },
    };
    const c = palette[color] || palette.indigo;

    return (
        <div className={`glass-card p-5 relative group overflow-hidden`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.text} flex items-center justify-center border ${c.border}`}>{icon}</div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {trend === 'up' ? 'Up' : 'Down'}
                    </div>
                )}
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black font-heading tracking-tight">{value ?? '—'}</span>
                {suffix && <span className="text-sm text-slate-500 font-semibold">{suffix}</span>}
            </div>
        </div>
    );
};

const BenchmarkRow = ({ label, value, highlight }) => (
    <div className="flex items-center justify-between group">
        <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
        <span className={`text-base font-black font-heading tracking-tight ${highlight ? 'text-indigo-400' : 'text-slate-200'}`}>{value ?? '—'}</span>
    </div>
);

const RatingBadge = ({ rating }) => {
    const color = rating >= 4 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15'
        : rating >= 3 ? 'text-amber-400 bg-amber-500/10 border-amber-500/15'
            : 'text-rose-400 bg-rose-500/10 border-rose-500/15';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border ${color}`}>
            {rating} <Star size={10} fill="currentColor" />
        </span>
    );
};

const Loader = ({ text }) => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-[3px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 animate-pulse">{text}</p>
    </div>
);

const SettingsPlaceholder = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-heading">Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Configuration and preferences</p>
        </div>
        <div className="glass-card p-8 text-center">
            <Settings size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Settings module coming soon.</p>
        </div>
    </motion.div>
);

export default App;
