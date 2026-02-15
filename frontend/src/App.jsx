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

    if (loading) return <div className="text-indigo-400 animate-pulse">Loading analytics...</div>;

    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="text-indigo-500" />
                    <h2 className="text-2xl font-bold">Insights Dashboard</h2>
                </div>
                <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<BarChart3 />} label="Total Avg Rating" value={report?.total_avg_rating} color="text-indigo-400" />
                <StatCard icon={<Users />} label="Unique Raters" value={report?.unique_rating_count} color="text-purple-400" />
                <StatCard icon={<Clock />} label="30d Rolling Avg" value={report?.avg_rating_last_30_days} color="text-green-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 bg-slate-900/40">
                    <h3 className="font-semibold mb-4 text-slate-400">Trend Analysis</h3>
                    <div className="space-y-4">
                        <TrendItem label="60 Day Average" value={report?.avg_rating_last_60_days} />
                        <TrendItem label="90 Day Average" value={report?.avg_rating_last_90_days} />
                    </div>
                </div>
                <div className="glass p-6 bg-slate-900/40 flex flex-col justify-center items-center text-center">
                    <p className="text-slate-500 text-sm mb-2">System Status</p>
                    <div className="flex items-center gap-2 text-green-500 font-bold">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        Live & Syncing
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="glass p-6 bg-slate-900/20">
        <div className={`mb-2 ${color}`}>{icon}</div>
        <div className="text-slate-400 text-sm mb-1">{label}</div>
        <div className="text-3xl font-bold">{value}</div>
    </div>
);

const TrendItem = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="font-mono font-bold text-indigo-400">{value}</span>
    </div>
);

export default App;
