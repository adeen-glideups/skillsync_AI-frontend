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
