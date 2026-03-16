import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyApplications } from "../../api/easyApply.api";

export default function DashApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const { data } = await fetchMyApplications();
      const d = data.data || data;
      setApplications(Array.isArray(d) ? d : (d.applications || d.items || []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
      setApplications([]);
    }
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

  const statusColors = {
    APPLIED: { bg: "var(--accent-lt)", color: "var(--accent)", label: "Applied" },
    REVIEWED: { bg: "#e8f0fe", color: "#2563eb", label: "Reviewed" },
    INTERVIEW: { bg: "#fef3e8", color: "var(--accent2)", label: "Interview" },
    REJECTED: { bg: "#fde8e8", color: "#c0392b", label: "Rejected" },
    ACCEPTED: { bg: "var(--accent-lt)", color: "var(--accent)", label: "Accepted" },
  };

  if (applications === null) {
    return (
      <>
        <div className="section-header" style={{ marginBottom: 24 }}>
          <h2 className="section-title">My Applications</h2>
          <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>Loading...</span>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="match-card" style={{ cursor: "default" }}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-line" style={{ height: 18, width: "60%", marginBottom: 8 }}></div>
              <div className="skeleton skeleton-line" style={{ height: 14, width: "40%" }}></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <h2 className="section-title">My Applications</h2>
        <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>
          {applications.length ? `${applications.length} applications` : "No applications yet"}
        </span>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fde8e8", borderRadius: 8, color: "#c0392b", fontSize: "0.88rem", marginBottom: 16 }}>{error}</div>
      )}

      {!applications.length ? (
        <div className="matches-empty">
          <div className="matches-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <h3 className="matches-empty-title">No applications yet</h3>
          <p className="matches-empty-sub">Browse jobs and use Easy Apply to submit your first application.</p>
          <button className="dash-btn dash-btn-dark" onClick={() => navigate("/dashboard/jobs")}>Explore Jobs &rarr;</button>
        </div>
      ) : (
        applications.map((app, i) => {
          const st = statusColors[app.status] || statusColors.APPLIED;
          return (
            <div key={app.id} className="match-card" style={{ animation: `fadeUp 0.4s ${i * 0.06}s ease both` }} onClick={() => navigate(`/dashboard/jobs/${app.jobId}`)}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "var(--bg)", border: "1px solid var(--rule)", display: "grid", placeItems: "center", fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--ink-soft)", flexShrink: 0 }}>
                {(app.job?.company || app.job?.title || "?")[0].toUpperCase()}
              </div>
              <div className="match-body">
                <div className="match-title">{app.job?.title || "Job"}</div>
                <div className="match-company">{app.job?.company || "Company"}</div>
                <div className="match-footer" style={{ marginTop: 8 }}>
                  <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--ink-faint)", marginLeft: 8 }}>Applied {timeAgo(app.appliedAt)}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
