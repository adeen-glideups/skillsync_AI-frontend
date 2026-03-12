import { useState, useCallback } from "react";
import { fetchJobs, searchJobs } from "../api/jobs.api";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadJobs = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchJobs(params);
      setJobs(data.jobs ?? data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await searchJobs(query);
      setJobs(data.jobs ?? data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, loading, error, loadJobs, search };
}
