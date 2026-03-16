import React from 'react';
import { motion } from 'framer-motion';

const Background = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-dark-bg">
            {/* Top right purple blob */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-neon-purple/20 blur-[120px]"
            />
            
            {/* Bottom left cyan blob */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -30, 0],
                    y: [0, 50, 0]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-neon-cyan/10 blur-[150px]"
            />

            {/* Center pink abstract shape */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[30%] left-[30%] w-[30vw] h-[40vw] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-neon-pink/15 blur-[100px]"
            />
            
            {/* Noise overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>
    );
};

export default Background;
