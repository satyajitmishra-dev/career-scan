import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTaskId, setStatus } from '../redux/resumeSlice';
import { uploadResume } from '../services/api';
import { Upload, FileText, X, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';

const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState('');
    const [exp, setExp] = useState('Entry Level');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles[0].type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }
        setFile(acceptedFiles[0]);
        setError('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    const handleLevelSelect = (level) => {
        setExp(level);
    };

    const levels = [
        { id: 'Entry Level', icon: <GraduationCap size={18} /> },
        { id: 'Mid Level', icon: <Briefcase size={18} /> },
        { id: 'Senior Level', icon: <Briefcase size={18} /> }
    ];

    const handleSubmit = async () => {
        if (!file) {
            setError('A resume PDF is required.');
            return;
        }

        setIsUploading(true);
        dispatch(setStatus('uploading'));

        try {
            const response = await uploadResume(file, exp, jd);
            dispatch(setTaskId(response.task_id));
            dispatch(setStatus('processing'));
            navigate('/processing');
        } catch (err) {
            setError('Failed to upload. Please ensure the backend server is running.');
            setIsUploading(false);
            dispatch(setStatus('failed'));
        }
    };

    return (
        <div className="flex-1 w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10 pt-28">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* Left Column - Form */}
                <div className="glass-card p-8 md:p-10 flex flex-col justify-between h-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Upload Profile</h2>
                        <p className="text-gray-400 mb-10 leading-relaxed">Provide your details to get an AI-powered analysis of your career profile.</p>

                        <div className="mb-10">
                            <label className="block text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Experience Level</label>
                            <div className="flex gap-4">
                                {levels.map((level) => (
                                    <button
                                        key={level.id}
                                        onClick={() => handleLevelSelect(level.id)}
                                        className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-2xl border transition-all duration-300 ${exp === level.id
                                            ? 'border-neon-cyan bg-neon-cyan/10 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-105'
                                            : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={exp === level.id ? 'text-neon-cyan mb-2 scale-110 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'mb-2 transition-transform'}>
                                            {level.icon}
                                        </div>
                                        <span className="text-xs font-semibold">{level.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">Job Description</label>
                                <span className="text-xs text-neon-pink font-medium bg-neon-pink/10 px-3 py-1 rounded-full border border-neon-pink/20">Optional</span>
                            </div>
                            <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the job requirements here for a targeted Match Score..."
                                className="w-full h-40 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-gray-200 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all resize-none placeholder-gray-600 backdrop-blur-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Dropzone & Submit */}
                <div className="flex flex-col gap-6">
                    <motion.div
                        {...getRootProps()}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-500 glass-card
               ${isDragActive ? 'border-neon-pink bg-neon-pink/5 shadow-[0_0_30px_rgba(255,0,127,0.3)]' : 'border-white/20 hover:border-neon-purple hover:bg-white/5'}
               ${file ? 'border-none p-0 overflow-hidden shadow-[0_0_30px_rgba(138,43,226,0.4)]' : ''}
             `}
                    >
                        <input {...getInputProps()} />

                        <AnimatePresence mode="wait">
                            {!file ? (
                                <motion.div
                                    key="upload-prompt"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex flex-col items-center text-center pointer-events-none"
                                >
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-lg transition-all duration-500
                                        ${isDragActive ? 'bg-neon-pink/20 shadow-[0_0_20px_rgba(255,0,127,0.5)] scale-110' : 'bg-white/5 border border-white/10'}
                                    `}>
                                        <Upload className={`w-12 h-12 transition-colors duration-500 ${isDragActive ? 'text-neon-pink' : 'text-gray-400'}`} />
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-3 transition-colors ${isDragActive ? 'text-neon-pink text-glow' : 'text-white'}`}>
                                        {isDragActive ? 'Drop PDF here' : 'Select Resume PDF'}
                                    </h3>
                                    <p className="text-sm text-gray-400 max-w-[220px] leading-relaxed">
                                        Drag & drop your file here, or click to browse. Max 5MB.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="file-preview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full h-full flex flex-col items-center justify-center text-white relative p-10 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20"
                                >
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-md border border-white/10 hover:text-neon-pink"
                                    >
                                        <X size={20} />
                                    </button>
                                    <FileText size={80} className="mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                                    <p className="font-bold text-xl text-center truncate w-full px-6 tracking-tight">{file.name}</p>
                                    <p className="text-gray-300 text-sm mt-3 font-medium tracking-wide">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {error && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-neon-pink text-sm text-center font-medium px-4 bg-neon-pink/10 py-3 rounded-xl border border-neon-pink/20">
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        onClick={handleSubmit}
                        disabled={!file || isUploading}
                        whileHover={file && !isUploading ? { scale: 1.02 } : {}}
                        whileTap={file && !isUploading ? { scale: 0.98 } : {}}
                        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all
              ${!file
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                : 'btn-primary'
                            }
            `}
                    >
                        {isUploading ? (
                            <span className="flex items-center gap-3">
                                <svg className="animate-spin -ml-1 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating & Uploading...
                            </span>
                        ) : (
                            <>
                                Begin Deep Scan <ChevronRight size={22} />
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadResume;
