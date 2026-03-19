import api from "./index";

// 2.1 List Jobs (paginated + filters)
export const fetchJobs = ({ page = 1, limit = 10, search, remote, category, jobType, sort } = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (remote !== undefined) params.remote = remote;
  if (category) params.category = category;
  if (jobType) params.jobType = jobType;
  if (sort) params.sort = sort;
  return api.get("/jobs", { params });
};

// 2.2 Get All Categories
export const fetchCategories = () => api.get("/jobs/categories");

// 2.3 Get Job Detail
export const getJobById = (id) => api.get(`/jobs/${id}`);

// 2.4 Home Dashboard (Auth required)
export const fetchHomeDashboard = () => api.get("/jobs/home");

// 2.5 User Matches (Auth required)
export const fetchUserMatches = ({ page = 1, limit = 10, resumeId } = {}) => {
  const params = { page, limit };
  if (resumeId) params.resumeId = resumeId;
  return api.get("/jobs/user-matches", { params });
};

// 2.6 Create Job (Auth required)
export const createJob = ({ title, description }) =>
  api.post("/jobs", { title, description });
