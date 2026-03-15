import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHomeDashboard, fetchJobs } from "../../api/jobs.api";

export default function DashHomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStats();
    loadJobs();
  }, []);

  async function loadStats() {
    try {
      const { data } = await fetchHomeDashboard();
      const d = data.data || data;
      setStats([
        { icon: "upload", color: "green", num: String(d.resumesUploaded), label: "Resumes Uploaded", change: "+1 this week", up: true },
        { icon: "star", color: "amber", num: String(d.jobsMatched), label: "Jobs Matched", change: "from last upload", up: true },
        { icon: "check", color: "blue", num: String(d.jobsApplied), label: "Applied Jobs", change: "track via links", up: false },
      ]);
    } catch {
      setStats([
        { icon: "upload", color: "green", num: "0", label: "Resumes Uploaded", change: "", up: false },
        { icon: "star", color: "amber", num: "0", label: "Jobs Matched", change: "", up: false },
        { icon: "check", color: "blue", num: "0", label: "Applied Jobs", change: "", up: false },
      ]);
    }
  }

  async function loadJobs() {
    try {
      const { data } = await fetchJobs({ page: 1, limit: 6 });
      const d = data.data || data;
      setJobs(d.jobs || d.items || []);
    } catch {
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }

  const filteredJobs = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || (j.company || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "remote" ? j.remote : !j.remote);
    return matchSearch && matchFilter;
  }).slice(0, 6);

  const statIcons = {
    upload: <><polyline points="16,16 12,12 8,16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></>,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />,
    check: <polyline points="20,6 9,17 4,12" />,
  };

  return (
    <>
      {/* Stats */}
      <div className="stats-grid">
        {stats ? stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ animation: `fadeUp 0.4s ${i * 0.1}s ease both` }}>
            <div className="stat-card-top">
              <div className={`stat-icon ${s.color}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{statIcons[s.icon]}</svg>
              </div>
              <span className={`stat-change ${s.up ? "up" : "neutral"}`}>{s.change}</span>
            </div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        )) : [0, 1, 2].map((i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-top">
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10 }}></div>
              <div className="skeleton" style={{ width: 50, height: 22 }}></div>
            </div>
            <div className="skeleton" style={{ width: 80, height: 40 }}></div>
            <div className="skeleton" style={{ width: 120, height: 14, marginTop: 4 }}></div>
          </div>
        ))}
      </div>

      {/* Upload CTA */}
      <div className="upload-hero">
        <div className="upload-hero-left">
          <h2 className="upload-hero-title">Upload your resume to find matches</h2>
          <p className="upload-hero-sub">Our two-stage AI pipeline analyses your skills<br />and surfaces only the jobs that truly fit.</p>
        </div>
        <div className="upload-hero-action">
          <button className="dash-btn dash-btn-primary" style={{ fontSize: "0.95rem", padding: "13px 28px" }} onClick={() => navigate("/dashboard/upload")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="16,16 12,12 8,16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
            Upload Resume
          </button>
        </div>
      </div>

      {/* Explore Jobs */}
      <div className="section-header">
        <h2 className="section-title">Explore Jobs</h2>
        <button className="section-link" onClick={() => navigate("/dashboard/jobs")}>View all &rarr;</button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="search-input" placeholder="Search jobs, companies, skills..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="filter-bar">
        {["all", "remote", "onsite"].map((f) => (
          <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "remote" ? "Remote" : "On-site"}
          </button>
        ))}
      </div>

      <div className="jobs-grid">
        {jobsLoading ? [0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="job-card skeleton-card">
            <div className="job-card-top">
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8 }}></div>
              <div className="skeleton" style={{ width: 60, height: 22, borderRadius: 100 }}></div>
            </div>
            <div className="skeleton skeleton-line" style={{ height: 18, width: "80%", marginBottom: 8 }}></div>
            <div className="skeleton skeleton-line" style={{ height: 14, width: "50%", marginBottom: 16 }}></div>
            <div style={{ display: "flex", gap: 6 }}>
              <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 4 }}></div>
              <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 4 }}></div>
            </div>
          </div>
        )) : filteredJobs.length ? filteredJobs.map((j, i) => (
          <div key={j.id} className="job-card" style={{ animation: `fadeUp 0.4s ${i * 0.06}s ease both` }} onClick={() => navigate(`/dashboard/jobs/${j.id}`)}>
            <div className="job-card-top">
              <div className="job-company-logo">{(j.company || j.title || "?")[0].toUpperCase()}</div>
              <span className={`job-remote-badge ${j.remote ? "remote" : "onsite"}`}>{j.remote ? "Remote" : "On-site"}</span>
            </div>
            <div className="job-title">{j.title}</div>
            <div className="job-company">{j.company || "Company"} &middot; {j.location || "Worldwide"}</div>
            <div className="job-tags">
              {(Array.isArray(j.tags) ? j.tags : (j.skills || "").split(",").map((s) => s.trim())).slice(0, 3).map((t, ti) => (
                <span key={ti} className="job-tag">{t}</span>
              ))}
            </div>
            <div className="job-footer">
              <span className="job-location">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {j.location || "Worldwide"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>{timeAgo(j.postedAt || j.createdAt)}</span>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--ink-faint)" }}>No jobs found</div>
        )}
      </div>
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
