import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMatchesByResume, deleteMatchesByResume } from "../../api/matches.api";
import { fetchResumes } from "../../api/resume.api";

export default function DashMatchesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get("resumeId");

  const [resumes, setResumes] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(resumeIdParam ? Number(resumeIdParam) : null);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [matches, setMatches] = useState(null);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user resumes for the selector
  useEffect(() => {
    loadResumes();
  }, []);

  // Load matches when a resume is selected
  useEffect(() => {
    if (selectedResumeId) {
      loadMatchesForResume(selectedResumeId);
    }
  }, [selectedResumeId]);

  async function loadResumes() {
    try {
      const { data } = await fetchResumes();
      const d = data.data || data;
      const list = Array.isArray(d) ? d : (d.resumes || d.items || []);
      setResumes(list);
      // Auto-select first resume if none from URL
      if (!selectedResumeId && list.length > 0) {
        setSelectedResumeId(list[0].id);
      }
    } catch {
      setResumes([]);
    }
  }

  async function loadMatchesForResume(resumeId) {
    setLoading(true);
    setError(null);
    setMatches(null);
    setResumeInfo(null);
    try {
      const { data } = await getMatchesByResume(resumeId);
      const d = data.data || data;

      // Resume info from response
      setResumeInfo({
        resumeId: d.resumeId,
        fileName: d.fileName,
        uploadedAt: d.uploadedAt,
      });
      setTotalMatches(d.totalMatches || 0);

      const matchList = Array.isArray(d.matches) ? d.matches : (Array.isArray(d) ? d : []);
      setMatches(matchList);
    } catch (err) {
      setError(err.message || "Failed to load matches");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  function handleResumeChange(id) {
    setSelectedResumeId(Number(id));
  }

  async function handleClearMatches() {
    if (!selectedResumeId) return;
    if (!window.confirm("Clear all matches for this resume? You can re-match later.")) return;
    try {
      await deleteMatchesByResume(selectedResumeId);
      setMatches([]);
      setTotalMatches(0);
    } catch (err) {
      setError(err.message || "Failed to clear matches");
    }
  }

  // Loading resumes list
  if (resumes === null) {
    return (
      <>
        <div className="section-header" style={{ marginBottom: 24 }}>
          <h2 className="section-title">My Matches</h2>
          <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>Loading...</span>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="match-card" style={{ cursor: "default" }}>
            <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-line" style={{ height: 18, width: "60%", marginBottom: 8 }}></div>
              <div className="skeleton skeleton-line" style={{ height: 14, width: "40%", marginBottom: 12 }}></div>
              <div className="skeleton skeleton-line" style={{ height: 50, width: "100%", borderRadius: 6 }}></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // No resumes at all
  if (resumes.length === 0) {
    return (
      <>
        <div className="section-header" style={{ marginBottom: 24 }}>
          <h2 className="section-title">My Matches</h2>
        </div>
        <div className="matches-empty">
          <div className="matches-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
          <h3 className="matches-empty-title">No matches yet</h3>
          <p className="matches-empty-sub">Upload your resume to get AI-powered job matches with explanations for each result.</p>
          <button className="dash-btn dash-btn-dark" onClick={() => navigate("/dashboard/upload")}>Upload Resume &rarr;</button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header with resume selector */}
      <div className="section-header" style={{ marginBottom: 8 }}>
        <h2 className="section-title">My Matches</h2>
        <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>
          {loading ? "Loading..." : matches ? `${totalMatches} matches found` : "Select a resume"}
        </span>
      </div>

      {/* Resume selector bar */}
      <div className="matches-resume-bar">
        <div className="matches-resume-selector">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, stroke: "var(--ink-faint)", flexShrink: 0 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
          </svg>
          <select
            className="matches-resume-select"
            value={selectedResumeId || ""}
            onChange={(e) => handleResumeChange(e.target.value)}
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>{r.fileName}</option>
            ))}
          </select>
        </div>
        {resumeInfo && (
          <div className="matches-resume-meta">
            Uploaded {timeAgo(resumeInfo.uploadedAt)}
          </div>
        )}
        {matches && matches.length > 0 && (
          <button className="matches-clear-btn" onClick={(e) => { e.stopPropagation(); handleClearMatches(); }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear matches
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fde8e8", borderRadius: 8, color: "#c0392b", fontSize: "0.88rem", marginBottom: 16 }}>{error}</div>
      )}

      {/* Loading state with skeletons */}
      {loading && (
        <div style={{ marginTop: 8 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="match-card" style={{ cursor: "default" }}>
              <div className="match-score-ring">
                <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%" }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-line" style={{ height: 18, width: "60%", marginBottom: 8 }}></div>
                <div className="skeleton skeleton-line" style={{ height: 14, width: "40%", marginBottom: 12 }}></div>
                <div className="skeleton skeleton-line" style={{ height: 50, width: "100%", borderRadius: 6 }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty matches */}
      {!loading && matches && matches.length === 0 && (
        <div className="matches-empty" style={{ marginTop: 8 }}>
          <div className="matches-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
          <h3 className="matches-empty-title">No matches for this resume</h3>
          <p className="matches-empty-sub">Try uploading a different resume or check back later as we add more jobs.</p>
        </div>
      )}

      {/* Match cards */}
      {!loading && matches && matches.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {matches.map((m, i) => {
            const score = Math.round(m.matchScore || m.similarityScore || 0);
            const circumference = 163;
            const offset = circumference - (score / 100) * circumference;
            const ringClass = score >= 70 ? "ring-green" : score >= 50 ? "ring-amber" : "ring-red";
            const jobId = m.job?.id || m.jobId;

            return (
              <div
                key={m.matchId || m.id || i}
                className="match-card"
                style={{ animation: `fadeUp 0.4s ${i * 0.08}s ease both` }}
                onClick={() => jobId && navigate(`/dashboard/jobs/${jobId}`)}
              >
                <div className="match-score-ring">
                  <svg viewBox="0 0 60 60">
                    <circle className="ring-bg" cx="30" cy="30" r="26" />
                    <circle className={`ring-fill ${ringClass}`} cx="30" cy="30" r="26" strokeDasharray={circumference} strokeDashoffset={offset} />
                  </svg>
                  <div className="match-score-text">{score}</div>
                </div>
                <div className="match-body">
                  <div className="match-card-header">
                    <div>
                      <div className="match-title">{m.job?.title || m.title || "Job"}</div>
                      <div className="match-company">{m.job?.company || m.company || "Company"}</div>
                    </div>
                    {m.rank && <span className="match-rank">#{m.rank}</span>}
                  </div>
                  {m.explanation && (
                    <div className="match-explanation">{m.explanation}</div>
                  )}
                  <div className="match-footer">
                    <span className={`job-remote-badge ${m.job?.remote ? "remote" : "onsite"}`}>
                      {m.job?.remote ? "Remote" : "On-site"}
                    </span>
                    {m.job?.jobType && (
                      <span className="match-job-type">{m.job.jobType.replace("_", " ")}</span>
                    )}
                    <span className="match-location" title={m.job?.location || "Worldwide"}>
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {m.job?.location || "Worldwide"}
                    </span>
                    <span className="match-date">{timeAgo(m.matchedAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}
