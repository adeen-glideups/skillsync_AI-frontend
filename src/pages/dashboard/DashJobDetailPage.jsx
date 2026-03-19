import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../../api/jobs.api";
import EasyApplyModal from "../../components/EasyApplyModal";

export default function DashJobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  async function loadJob() {
    setLoading(true);
    setNotFound(false);
    try {
      const { data } = await getJobById(jobId);
      const d = data.data || data;
      setJob(d.job || d);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      }
      setJob(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--ink-faint)" }}>
        <div className="spinner dark" style={{ marginBottom: 16 }}></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--ink-faint)" }}>
        <h3 style={{ marginBottom: 12, color: "var(--ink)" }}>Job not found</h3>
        <p style={{ marginBottom: 20 }}>This job may have been removed or the link is invalid.</p>
        <button className="dash-btn dash-btn-dark" onClick={() => navigate(-1)}>
          &larr; Go back
        </button>
      </div>
    );
  }

  const skills = Array.isArray(job.tags) ? job.tags : (job.skills || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15,18 9,12 15,6" /></svg>
        Back
      </button>

      <div className="job-detail-header">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flex: 1 }}>
          <div className="job-detail-logo">{(job.company || "?")[0].toUpperCase()}</div>
          <div className="job-detail-title-block">
            <h1 className="job-detail-title">{job.title}</h1>
            <div className="job-detail-meta">
              <span>{job.company || "Company"}</span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {job.location || "Worldwide"}
              </span>
              <span className={`job-remote-badge ${job.remote ? "remote" : "onsite"}`}>{job.remote ? "Remote" : "On-site"}</span>
              <span>{timeAgo(job.createdAt || job.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="job-detail-body">
        <div className="job-detail-desc">
          <h3>Job Description</h3>
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
        </div>
        <div className="job-detail-sidebar">
          <div className="job-detail-card">
            <button className="apply-btn" onClick={() => setShowApply(true)}>
              Easy Apply
            </button>
          </div>
          <div className="job-detail-card">
            <h4>Skills Required</h4>
            <div className="skills-list">
              {skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}
            </div>
          </div>
          <div className="job-detail-card">
            <h4>Quick Info</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: "0.84rem", color: "var(--ink-soft)" }}><strong style={{ color: "var(--ink)" }}>{job.company || "N/A"}</strong></div>
              <div style={{ fontSize: "0.84rem", color: "var(--ink-soft)" }}><strong style={{ color: "var(--ink)" }}>{job.location || "Worldwide"}</strong></div>
              <div style={{ fontSize: "0.84rem", color: "var(--ink-soft)" }}><strong style={{ color: "var(--ink)" }}>{job.jobType || "Full-time"}</strong></div>
              {job.sourceUrl && (
                <a href={job.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.82rem", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>View original posting</a>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApply && (
        <EasyApplyModal
          jobId={jobId}
          jobTitle={job.title}
          jobCompany={job.company}
          onClose={() => setShowApply(false)}
        />
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
