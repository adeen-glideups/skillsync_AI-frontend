import api from "./index";

export const fetchJobs = (params) => api.get("/jobs", { params });

export const searchJobs = (query) => api.get("/jobs/search", { params: { q: query } });

export const getJobById = (id) => api.get(`/jobs/${id}`);
