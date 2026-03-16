import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'py-2 bg-dark-bg/60 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
                    : 'py-4 bg-transparent border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 glass-card px-6 rounded-2xl border border-white/10 bg-dark-card/40">
                    <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ duration: 0.4, type: "spring" }}
                            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]"
                        >
                            <FileSearch size={20} />
                            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                        </motion.div>
                        <span className="font-extrabold text-2xl tracking-tighter text-white">
                            CareerScan<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500">AI</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/" 
                            className={`relative text-sm font-semibold tracking-wide transition-colors ${location.pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Home
                            {location.pathname === '/' && (
                                <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                            )}
                        </Link>
                        <Link 
                            to="/upload" 
                            className={`relative text-sm font-semibold tracking-wide transition-colors ${location.pathname === '/upload' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Scan Resume
                            {location.pathname === '/upload' && (
                                <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                            )}
                        </Link>
                    </div>

                    <div>
                        <Link to="/upload">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl"
                            >
                                Get Started
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
