import api from "./index";

// 4.1 Calculate Job Matches (AI Matching, Auth required)
export const calculateMatches = ({ resumeId, topN = 5 }) =>
  api.post("/matches", { resumeId, topN });

// 4.2 Get Matches by Resume (Auth required)
export const getMatchesByResume = (resumeId) =>
  api.get(`/matches/resume/${resumeId}`);

// 4.3 Clear All Matches by Resume ID (Auth required)
export const deleteMatchesByResume = (resumeId) =>
  api.delete(`/matches/resume/${resumeId}`);
