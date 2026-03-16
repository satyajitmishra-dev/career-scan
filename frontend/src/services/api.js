import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadResume = async (file, experienceLevel, jobDescription) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('experience_level', experienceLevel);
    if (jobDescription) {
        formData.append('job_description', jobDescription);
    }

    const response = await apiClient.post('/resumes/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const checkProcessingStatus = async (taskId) => {
    const response = await apiClient.get(`/resumes/status/${taskId}`);
    return response.data;
};

export const getAnalysisResult = async (resumeId) => {
    const response = await apiClient.get(`/analysis/${resumeId}`);
    return response.data;
};
