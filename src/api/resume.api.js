import api from "./index";

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getMatchResults = (resumeId) =>
  api.get(`/resume/${resumeId}/matches`);

export const getMatchStatus = (resumeId) =>
  api.get(`/resume/${resumeId}/status`);
