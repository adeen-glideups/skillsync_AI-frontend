import api from "./index";

// 3.1 Get User's Resumes (Auth required)
export const fetchResumes = () => api.get("/resumes");

// 3.2 Upload Resume (Auth required, multipart/form-data)
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 3.3 Delete Resume by ID (Auth required)
export const deleteResume = (resumeId) => api.delete(`/resumes/${resumeId}`);

// 3.4 Delete All User Resumes (Auth required)
export const deleteAllResumes = () => api.delete("/resumes");
