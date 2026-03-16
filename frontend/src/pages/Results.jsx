import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnalysisResult } from '../services/api';
import { setAnalysisResult } from '../redux/resumeSlice';
import ScoreChart from '../components/ScoreChart';
import { AlertCircle, CheckCircle, ChevronRight, Zap, Target } from 'lucide-react';

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const analysisResult = useSelector((state) => state.resume.analysisResult);
    const [loading, setLoading] = useState(!analysisResult);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!analysisResult && id) {
            const fetchResults = async () => {
                try {
                    const data = await getAnalysisResult(id);
                    dispatch(setAnalysisResult(data));
                    setLoading(false);
                } catch (err) {
                    setError('Could not fetch analysis results. ' + err.message);
                    setLoading(false);
                }
            };
            fetchResults();
        }
    }, [id, analysisResult, dispatch]);

    if (loading) return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]"></div>
            <p className="mt-4 text-neon-cyan text-glow font-medium animate-pulse">Loading neural insights...</p>
        </div>
    );
    
    if (error) return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="glass-card p-6 border-red-500/50 bg-red-500/10 text-red-400 font-bold flex items-center gap-3">
                <AlertCircle /> {error}
            </div>
        </div>
    );
    
    if (!analysisResult) return <div className="flex-1 flex items-center justify-center text-gray-400">No results found.</div>;

    const { score, job_match, missing_skills, extracted_skills, suggestions } = analysisResult;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <div className="flex-1 w-full py-16 px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Background ambient light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-neon-purple/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* Header section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8 relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-neon-cyan to-neon-purple rounded-full" />
                    <div className="pl-4">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter">Analysis Complete</h1>
                        <p className="text-gray-400 text-lg md:text-xl font-light">Here are your personalized AI insights to improve your resume.</p>
                    </div>
                    <Link to="/upload" className="btn-primary text-sm flex items-center gap-2 px-6 py-3">
                        New Scan <ChevronRight size={18} />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

                    {/* Left Column - Scores */}
                    <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-8 flex flex-col items-center relative overflow-hidden group hover:border-neon-cyan/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="text-xl font-bold text-white mb-8 w-full text-left flex items-center gap-2">
                                <Target className="text-neon-cyan" size={24} /> Overall Score
                            </h3>
                            <ScoreChart score={score} label="Out of 100" />

                            {job_match !== undefined && job_match !== null && (
                                <div className="mt-10 w-full border-t border-white/10 pt-8 flex flex-col items-center">
                                    <h3 className="text-lg font-bold text-white mb-6 w-full text-center tracking-wide">JD Match</h3>
                                    <ScoreChart score={job_match} label="Match %" />
                                </div>
                            )}
                        </div>

                        <div className="glass-card p-6 bg-neon-purple/5 border-neon-purple/20 hover:border-neon-purple/50 transition-colors group">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <Zap className="text-neon-purple group-hover:text-glow-purple transition-all" size={20} /> Quick Tip
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                A score above 80 significantly increases your chances of passing an ATS system. Focus heavily on adding missing keywords naturally.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Details */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">

                        {/* Suggestions */}
                        <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-neon-purple/20 blur-3xl rounded-full pointer-events-none" />
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <CheckCircle className="text-neon-purple" size={28} /> AI Suggestions
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {suggestions && suggestions.length > 0 ? (
                                    suggestions.map((sug, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.05)" }}
                                            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm flex items-start gap-5 transition-colors"
                                        >
                                            <div className="bg-neon-purple/20 border border-neon-purple/30 text-neon-purple w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black shadow-[0_0_10px_rgba(138,43,226,0.3)]">
                                                {idx + 1}
                                            </div>
                                            <p className="text-gray-200 pt-1.5 leading-relaxed text-sm md:text-base">{sug}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No suggestions provided by the AI.</p>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-card p-8 border-l-4 border-l-neon-pink bg-gradient-to-r from-neon-pink/5 to-transparent hover:border-neon-pink/80 transition-all">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <AlertCircle className="text-neon-pink" size={22} /> Missing Skills
                                </h3>
                                {missing_skills && missing_skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {missing_skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-neon-pink/10 text-neon-pink rounded-lg text-xs font-bold border border-neon-pink/20 uppercase tracking-wider shadow-[0_0_10px_rgba(255,0,127,0.1)]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-neon-cyan font-medium bg-neon-cyan/10 p-4 rounded-xl border border-neon-cyan/20">
                                        Exceptional! You matched all major mandatory skills.
                                    </p>
                                )}
                            </div>

                            <div className="glass-card p-8 border-l-4 border-l-neon-cyan bg-gradient-to-r from-neon-cyan/5 to-transparent hover:border-neon-cyan/80 transition-all">
                                <h3 className="text-xl font-bold text-white mb-6">Detected Skills</h3>
                                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {extracted_skills && extracted_skills.length > 0 ? (
                                        extracted_skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white/5 text-gray-300 rounded-lg border border-white/10 text-xs font-semibold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-colors cursor-default">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No primary skills explicitly detected.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </motion.div>

                </div>
            </motion.div>
        </div>
    );
};

export default Results;
