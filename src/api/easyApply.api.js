import api from "./index";

// 5.1 Get Prefill Data (Auth required)
export const getPrefill = (jobId) => api.get(`/easy-apply/${jobId}/prefill`);

// 5.2 Save/Update Contact Info (Auth required)
export const saveContact = ({ phone, countryCode, city, country }) =>
  api.put("/easy-apply/contact", { phone, countryCode, city, country });

// 5.3 Submit Application (Auth required)
export const submitApplication = (jobId, { resumeId, contact, answers }) =>
  api.post(`/easy-apply/${jobId}/submit`, { resumeId, contact, answers });

// 5.4 Get My Applications (Auth required)
export const fetchMyApplications = () => api.get("/easy-apply/my-applications");
