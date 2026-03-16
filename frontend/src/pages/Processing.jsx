import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { checkProcessingStatus, getAnalysisResult } from '../services/api';
import { setStatus, setAnalysisResult, setError } from '../redux/resumeSlice';

const Processing = () => {
    const { taskId, status } = useSelector((state) => state.resume);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!taskId) {
            navigate('/upload');
            return;
        }

        let intervalId;

        const pollStatus = async () => {
            try {
                const result = await checkProcessingStatus(taskId);

                if (result.status === 'completed') {
                    clearInterval(intervalId);
                    const analysis = await getAnalysisResult(taskId);
                    dispatch(setAnalysisResult(analysis));
                    navigate(`/results/${taskId}`);
                } else if (result.status === 'failed') {
                    clearInterval(intervalId);
                    dispatch(setError(result.error || 'Processing failed on the server.'));
                    navigate('/upload');
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        };

        intervalId = setInterval(pollStatus, 3000);
        pollStatus();

        return () => clearInterval(intervalId);
    }, [taskId, navigate, dispatch]);

    return (
        <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative z-10 pt-20">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="glass-card p-12 md:p-16 flex flex-col items-center max-w-xl w-full text-center relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none" />
                
                {/* Radar/Scanner Animation */}
                <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border border-neon-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                    />
                    <motion.div 
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                        className="absolute inset-0 rounded-full border border-neon-cyan/30"
                    />
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,240,255,0.4) 360deg)' }}
                    />
                    <div className="w-12 h-12 rounded-full bg-neon-cyan/20 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.8)] z-10 relative flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-neon-cyan text-glow animate-pulse" />
                    </div>
                </div>

                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter text-glow-purple">Analyzing Profile</h2>
                <p className="text-gray-400 mb-10 max-w-sm leading-relaxed">
                    Neural engine is currently extracting data, running vector similarity matches, and generating Llama 3 insights...
                </p>

                {/* Animated Progress Steps */}
                <div className="w-full space-y-4 text-left font-mono">
                    <LoadingStep text="Extracting text vectors..." delay={0} />
                    <LoadingStep text="Identifying semantic skills..." delay={1.5} />
                    <LoadingStep text="Cross-referencing JD data..." delay={3} />
                    <LoadingStep text="Querying Llama 3 engine..." delay={4.5} />
                </div>
            </motion.div>
        </div>
    );
};

const LoadingStep = ({ text, delay }) => {
    const [status, setStatus] = useState('pending'); // pending, scanning, done

    useEffect(() => {
        const timer1 = setTimeout(() => setStatus('scanning'), delay * 1000);
        const timer2 = setTimeout(() => setStatus('done'), (delay + 1.5) * 1000);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, [delay]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`flex items-center gap-4 text-sm font-medium p-4 rounded-xl border transition-colors duration-500
                ${status === 'pending' ? 'bg-white/5 border-white/5 text-gray-600' : ''}
                ${status === 'scanning' ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple shadow-[0_0_15px_rgba(138,43,226,0.2)]' : ''}
                ${status === 'done' ? 'bg-neon-cyan/5 border-neon-cyan/20 text-neon-cyan' : ''}
            `}
        >
            <div className="w-6 h-6 flex items-center justify-center relative">
                {status === 'pending' && <div className="w-2 h-2 rounded bg-gray-600" />}
                {status === 'scanning' && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-neon-purple border-t-transparent rounded-full"
                    />
                )}
                {status === 'done' && (
                    <motion.svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                )}
            </div>
            <span className="tracking-wide">
                {text}
            </span>
        </motion.div>
    );
};

export default Processing;
