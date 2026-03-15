import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserMatches } from "../../api/jobs.api";

export default function DashMatchesPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches(pageNum = 1) {
    try {
      if (pageNum > 1) setLoadingMore(true);
      const { data } = await fetchUserMatches({ page: pageNum, limit: 50 });
      const d = data.data || data;
      const newMatches = d.matches || d.items || [];
      if (pageNum === 1) {
        setMatches(newMatches);
      } else {
        setMatches((prev) => [...(prev || []), ...newMatches]);
      }
      setPage(pageNum);
      setTotalPages(d.pagination?.totalPages || 1);
    } catch {
      setMatches([]);
    } finally {
      setLoadingMore(false);
    }
  }

  if (matches === null) {
    return (
      <>
        <div className="section-header" style={{ marginBottom: 24 }}>
          <h2 className="section-title">My Matches</h2>
          <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>Loading...</span>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="match-card" style={{ cursor: "default" }}>
            <div className="skeleton" style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }}></div>
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

  return (
    <>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <h2 className="section-title">My Matches</h2>
        <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>
          {matches.length ? `${matches.length} matches found` : "No matches yet"}
        </span>
      </div>

      {!matches.length ? (
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
      ) : (
        <>
          {matches.map((m, i) => {
            const score = Math.round(m.similarityScore || 0);
            const circumference = 163;
            const offset = circumference - (score / 100) * circumference;
            const ringClass = score >= 70 ? "ring-green" : score >= 50 ? "ring-amber" : "ring-red";

            return (
              <div key={m.id || i} className="match-card" style={{ animation: `fadeUp 0.4s ${i * 0.08}s ease both` }} onClick={() => navigate(`/dashboard/jobs/${m.jobId || m.job?.id}`)}>
                <div className="match-score-ring">
                  <svg viewBox="0 0 60 60">
                    <circle className="ring-bg" cx="30" cy="30" r="26" />
                    <circle className={`ring-fill ${ringClass}`} cx="30" cy="30" r="26" strokeDasharray={circumference} strokeDashoffset={offset} />
                  </svg>
                  <div className="match-score-text">{score}</div>
                </div>
                <div className="match-body">
                  <div className="match-title">{m.job?.title || m.title}</div>
                  <div className="match-company">{m.job?.company || m.company} &middot; {m.job?.location || "Worldwide"}</div>
                  <div className="match-explanation">{m.explanation || "Strong skill alignment detected by our AI pipeline."}</div>
                  <div className="match-footer">
                    <span className={`job-remote-badge ${m.job?.remote ? "remote" : "onsite"}`}>{m.job?.remote ? "Remote" : "On-site"}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {totalPages > page && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button className="dash-btn dash-btn-ghost" onClick={() => loadMatches(page + 1)} disabled={loadingMore}>
                {loadingMore ? <span className="spinner dark"></span> : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
