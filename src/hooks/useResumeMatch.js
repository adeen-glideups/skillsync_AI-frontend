import { useCallback, useRef } from "react";
import useMatchStore from "../store/matchStore";
import { uploadResume, getMatchResults, getMatchStatus } from "../api/resume.api";

export function useResumeMatch() {
  const { matches, resumeId, status, error, setResumeId, setMatches, setStatus, setError, reset } =
    useMatchStore();
  const pollRef = useRef(null);

  const upload = useCallback(
    async (file) => {
      setStatus("uploading");
      try {
        const { data } = await uploadResume(file);
        setResumeId(data.resumeId);
        setStatus("processing");
        pollForResults(data.resumeId);
      } catch (err) {
        setError(err.response?.data?.message ?? "Upload failed");
      }
    },
    [setResumeId, setStatus, setError]
  );

  const pollForResults = useCallback(
    (id) => {
      pollRef.current = setInterval(async () => {
        try {
          const { data } = await getMatchStatus(id);
          if (data.status === "done") {
            clearInterval(pollRef.current);
            const result = await getMatchResults(id);
            setMatches(result.data.matches ?? result.data);
          }
        } catch {
          clearInterval(pollRef.current);
          setError("Failed to fetch match results");
        }
      }, 3000);
    },
    [setMatches, setError]
  );

  const stopPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  return { matches, resumeId, status, error, upload, stopPolling, reset };
}
