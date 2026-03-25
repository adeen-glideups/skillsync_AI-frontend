import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJobs, fetchCategories } from "../../api/jobs.api";

export default function DashJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setJobs([]);
    setLoading(true);
    loadJobs(1);
  }, [search, filter, selectedCategory, jobType, sortBy]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !loading && !loadingMore && page < totalPages) {
      loadJobs(page + 1);
    }
  }, [loading, loadingMore, page, totalPages]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  async function loadCategories() {
    try {
      const { data } = await fetchCategories();
      const cats = data.data?.categories || data.data || [];
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      setCategories([]);
    }
  }

  async function loadJobs(pageNum = 1) {
    try {
      if (pageNum > 1) setLoadingMore(true);
      const { data } = await fetchJobs({
        page: pageNum,
        limit: 12,
        search: search || undefined,
        remote: filter === "all" ? undefined : filter === "remote",
        category: selectedCategory || undefined,
        jobType: jobType || undefined,
        sort: sortBy || undefined,
      });
      const d = data.data || data;
      const newJobs = Array.isArray(d) ? d : (d.jobs || d.items || []);
      if (pageNum === 1) {
        setJobs(newJobs);
      } else {
        setJobs((prev) => [...prev, ...newJobs]);
      }
      setPage(pageNum);
      setTotalPages(d.pagination?.totalPages || 1);
    } catch {
      if (pageNum === 1) setJobs([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  return (
    <>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <h2 className="section-title">Explore All Jobs</h2>
        <span style={{ fontSize: "0.82rem", color: "var(--ink-faint)" }}>
          Showing {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </span>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="search-input" placeholder="Search jobs, companies, skills..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label className="filter-label">Location</label>
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All locations</option>
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Job Type</label>
          <select className="filter-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">All types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((cat) => {
              const name = typeof cat === "string" ? cat : cat.name;
              return <option key={name} value={name}>{name}</option>;
            })}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Sort by</label>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      <div className="jobs-grid">
        {loading ? [0, 1, 2, 3, 4, 5].map((i) => (
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
        )) : jobs.length ? jobs.map((j, i) => (
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
              <span style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>{timeAgo(j.createdAt || j.createdAt)}</span>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "var(--ink-faint)" }}>No jobs found</div>
        )}
      </div>

      {/* Infinite scroll loader */}
      {!loading && page < totalPages && (
        <div ref={loaderRef} style={{ textAlign: "center", padding: "24px 0" }}>
          {loadingMore && <span className="spinner dark"></span>}
        </div>
      )}
      {!loading && page >= totalPages && jobs.length > 0 && (
        <div style={{ textAlign: "center", padding: 24, color: "var(--ink-faint)", fontSize: "0.85rem" }}>
          You&apos;ve reached the end
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
