import { create } from "zustand";

const useMatchStore = create((set) => ({
  matches: [],
  resumeId: null,
  status: "idle", // idle | uploading | processing | done | error
  error: null,

  setResumeId: (id) => set({ resumeId: id }),
  setMatches: (matches) => set({ matches, status: "done" }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: "error" }),

  reset: () =>
    set({ matches: [], resumeId: null, status: "idle", error: null }),
}));

export default useMatchStore;
