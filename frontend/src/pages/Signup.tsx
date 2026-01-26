
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(email, password, name);
            // Redirect to Login with success message
            navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
        } catch (err: any) {
            setError('Failed to create account. ' + (err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] relative overflow-hidden p-6 py-12">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}></div>

            <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-brand-primary/10 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-brand-secondary/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative z-10 perspective-1000">
                <div className="glass-card p-8 md:p-10 backdrop-blur-2xl bg-white/80 border border-white/60 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-500">

                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group cursor-pointer hover:-translate-y-1 transition-transform">
                            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                                <i className="fas fa-comment-dots text-white text-lg"></i>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-800">ConvoVerse</span>
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500 font-medium">Join us to start your journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm font-bold px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
                                <i className="fas fa-exclamation-circle text-lg"></i>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-user text-slate-300 group-focus-within:text-brand-primary transition-colors"></i>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 group-hover:border-slate-300"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-envelope text-slate-300 group-focus-within:text-brand-primary transition-colors"></i>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 group-hover:border-slate-300"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-lock text-slate-300 group-focus-within:text-brand-primary transition-colors"></i>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 group-hover:border-slate-300"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fas fa-key text-slate-300 group-focus-within:text-brand-primary transition-colors"></i>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 group-hover:border-slate-300"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <i className="fas fa-circle-notch fa-spin"></i>
                            ) : (
                                <>
                                    Create Account <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-primary font-bold hover:text-brand-secondary transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signup;
