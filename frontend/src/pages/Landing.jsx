import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UploadCloud, CheckCircle2, Zap, Target, Sparkles } from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: <Target className="w-6 h-6 text-neon-cyan" />,
            title: "Smart ATS Matching",
            desc: "See exactly how well your resume matches the job description using advanced vector similarity."
        },
        {
            icon: <Zap className="w-6 h-6 text-neon-purple" />,
            title: "AI-Powered Insights",
            desc: "Get actionable suggestions from Llama 3 to improve your formatting, tone, and keywords."
        },
        {
            icon: <CheckCircle2 className="w-6 h-6 text-neon-pink" />,
            title: "Skill Gap Analysis",
            desc: "Instantly identify which crucial skills you are missing to pass the automated screeners."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <div className="flex-1 w-full flex flex-col items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center max-w-5xl mx-auto mt-10 md:mt-24 relative z-10"
            >
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md text-neon-cyan px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Launching CareerScan AI 1.0</span>
                </motion.div>

                <motion.h1 
                    variants={itemVariants}
                    className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1]"
                >
                    Land Your Dream Job with <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-glow">
                        Intelligent Insights
                    </span>
                </motion.h1>

                <motion.p 
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
                >
                    Stop guessing why your resume isn't getting past the ATS.
                    Upload your PDF, paste the job description, and let our <span className="text-neon-cyan font-medium">AI analyze your match score</span> and uncover missing skills instantly.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <Link to="/upload">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary py-4 px-10 text-lg sm:w-auto flex items-center justify-center gap-3 w-full"
                        >
                            Analyze My Resume Now
                            <UploadCloud className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                        </motion.button>
                    </Link>
                    <a href="#features" className="text-gray-400 font-semibold hover:text-white hover:text-glow-purple transition-all duration-300 py-4 px-8 text-lg flex items-center gap-2">
                        See How It Works
                    </a>
                </motion.div>
            </motion.div>

            {/* Stats/Social Proof */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-32 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
            >
                <div className="glass-card text-center py-8 px-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h4 className="text-4xl font-bold text-white mb-2 text-glow">50k+</h4>
                    <p className="text-sm font-medium text-gray-400 tracking-wider uppercase">Resumes Analyzed</p>
                </div>
                <div className="glass-card text-center py-8 px-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h4 className="text-4xl font-bold text-white mb-2 text-glow-purple">85%</h4>
                    <p className="text-sm font-medium text-gray-400 tracking-wider uppercase">Interview Rate Increase</p>
                </div>
                <div className="glass-card text-center py-8 px-4 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h4 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(255, 0, 127, 0.5)' }}>Top 1%</h4>
                    <p className="text-sm font-medium text-gray-400 tracking-wider uppercase">AI Accuracy</p>
                </div>
            </motion.div>

            {/* Feature Cards */}
            <div id="features" className="mt-40 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: idx * 0.2, duration: 0.8, type: "spring" }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="glass-card p-10 flex flex-col items-start relative overflow-hidden group"
                    >
                        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500" />
                        
                        <div className="bg-dark-bg p-4 rounded-2xl mb-8 shadow-inner border border-white/5 relative z-10">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
