import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    resumeData: null,
    analysisResult: null,
    status: 'idle', // 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
    error: null,
    taskId: null
};

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setTaskId: (state, action) => {
            state.taskId = action.payload;
        },
        setAnalysisResult: (state, action) => {
            state.analysisResult = action.payload;
            state.status = 'completed';
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        },
        resetAnalysis: () => {
            return initialState;
        }
    }
});

export const { setStatus, setTaskId, setAnalysisResult, setError, resetAnalysis } = resumeSlice.actions;
export default resumeSlice.reducer;
