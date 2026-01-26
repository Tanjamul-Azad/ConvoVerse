
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8 relative overflow-hidden">
            {/* Decorative background elements if needed, keeping it clean for now as per image */}

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                {/* Brand Column */}
                <div className="md:col-span-5 flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                            <i className="fas fa-comment-dots text-sm"></i>
                        </div>
                        <span className="text-xl font-bold text-brand-primary">ConvoVerse</span>
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                        Enhancing social intelligence through AI-driven simulations.
                    </p>
                </div>

                {/* Links Columns container */}
                <div className="md:col-span-7 grid grid-cols-3 gap-8">
                    {/* Product Column */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link to="#" className="hover:text-brand-primary transition-colors">Features</Link></li>
                            <li><Link to="#" className="hover:text-brand-primary transition-colors">Pricing</Link></li>
                            <li><Link to="#" className="hover:text-brand-primary transition-colors">Testimonials</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><Link to="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
                            <li><Link to="#" className="hover:text-brand-primary transition-colors">Careers</Link></li>
                            <li><Link to="#" className="hover:text-brand-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Connect Column */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                            © 2026 ConvoVerse.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
