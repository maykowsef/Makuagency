import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = ({ onLogin, users }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // ... rest of state
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const foundUser = users ? users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password) : null;

            if (foundUser) {
                // Update lastLogin time
                const userData = {
                    ...foundUser,
                    lastLogin: new Date().toISOString()
                };
                onLogin(userData);
            } else {
                // Legacy Fallback (just in case)
                if (email === 'admin@crmpro.com' && password === 'admin123') {
                    onLogin({ email, name: 'System Admin', role: 'Administrator', avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=dc2626&color=fff', lastLogin: new Date().toISOString() });
                } else if (email === 'makremmakrouma2@gmail.com' && password === 'makrem123456') {
                    onLogin({ email, name: 'Makrem', role: 'Employer Data Specialist', avatar: 'https://ui-avatars.com/api/?name=Makrem&background=4F46E5&color=fff', lastLogin: new Date().toISOString() });
                } else {
                    setError('Invalid email or password. Please try again.');
                    setIsLoading(false);
                }
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-100">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-200/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-200/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-[440px] relative">
                {/* Logo & Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-50 mb-6 group cursor-default">
                        <ShieldCheck className="w-8 h-8 text-indigo-600 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        CRM <span className="text-indigo-600">Pro</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Enterprise Data Management Gateway</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium flex items-center gap-3 animate-shake">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Access Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 p-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authorizing Access...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Secure Login</span>
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-sm font-semibold text-slate-400">
                            Problem logging in? <button className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">Contact IT Support</button>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-slate-400 text-sm font-medium">© 2026 CRM Pro. All rights reserved.</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Login;
