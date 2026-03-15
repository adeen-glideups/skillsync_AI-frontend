import api from "./index";

// 4.1 Calculate Job Matches (AI Matching, Auth required)
export const calculateMatches = ({ resumeId, topN = 5 }) =>
  api.post("/matches", { resumeId, topN });
