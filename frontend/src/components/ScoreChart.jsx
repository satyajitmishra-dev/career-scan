import React from 'react';
import { motion } from 'framer-motion';

const ScoreChart = ({ score, label, subtitle }) => {
    // SVG logic for circular progress
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let colorInfo = score >= 80 
        ? { stroke: 'stroke-neon-cyan', text: 'text-neon-cyan', drop: 'drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]' } 
        : score >= 60 
            ? { stroke: 'stroke-neon-purple', text: 'text-neon-purple', drop: 'drop-shadow-[0_0_15px_rgba(138,43,226,0.6)]' } 
            : { stroke: 'stroke-neon-pink', text: 'text-neon-pink', drop: 'drop-shadow-[0_0_15px_rgba(255,0,127,0.6)]' };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background glow behind circle */}
                <div className={`absolute inset-0 rounded-full ${colorInfo.text} opacity-20 blur-2xl transition-opacity duration-1000`} />
                
                {/* Background Circle */}
                <svg
                    className="absolute inset-0 w-full h-full transform -rotate-90"
                    viewBox="0 0 120 120"
                >
                    <circle
                        className="text-white/5"
                        strokeWidth={stroke}
                        stroke="currentColor"
                        fill="transparent"
                        r={normalizedRadius}
                        cx="60"
                        cy="60"
                        strokeLinecap="round"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className={`${colorInfo.stroke} transition-all duration-500`}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={normalizedRadius}
                        cx="60"
                        cy="60"
                        style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
                    />
                </svg>
                <div className="flex flex-col items-center z-10">
                    <span className={`text-4xl font-black ${colorInfo.text} tracking-tight ${colorInfo.drop}`}>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                        >
                            {score}
                        </motion.span>
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</span>
                </div>
            </div>
            {subtitle && (
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-6 text-sm font-medium text-gray-300 text-center max-w-[200px]"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
};

export default ScoreChart;
