import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchResumes, uploadResume, deleteResume, deleteAllResumes } from "../../api/resume.api";
import { calculateMatches } from "../../api/matches.api";

const AI_STATUS_LINES = [
  "Parsing document structure...",
  "Extracting key skills and competencies...",
  "Analyzing work experience timeline...",
  "Building candidate profile vector...",
  "Querying job database with semantic search...",
  "Running AI similarity scoring engine...",
  "Cross-referencing skill embeddings...",
  "Evaluating role-to-experience alignment...",
  "Ranking matches by relevance score...",
  "Generating match explanations...",
  "Compiling your personalized results...",
  "Finalizing match confidence scores...",
];

export default function DashUploadPage() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Matching flow state
  const [matching, setMatching] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [matchingPhase, setMatchingPhase] = useState("upload"); // upload | matching

  useEffect(() => {
    loadUploads();
  }, []);

  // Rotate AI status lines while matching
  useEffect(() => {
    if (!matching) return;
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % AI_STATUS_LINES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [matching]);

  async function loadUploads() {
    try {
      const { data } = await fetchResumes();
      const d = data.data || data;
      const resumes = Array.isArray(d) ? d : (d.resumes || d.items || []);
      setUploads(
        resumes.map((r) => ({
          id: r.id,
          name: r.fileName,
          type: r.fileName?.endsWith(".docx") ? "docx" : "pdf",
          date: timeAgo(r.uploadedAt),
        }))
      );
    } catch {
      setUploads([]);
    }
  }

  function toast(msg, type = "default") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  async function handleDeleteResume(e, resumeId, name) {
    e.stopPropagation();
    if (!window.confirm(`Delete "${name}"? This will also remove its matches.`)) return;
    try {
      await deleteResume(resumeId);
      setUploads((prev) => prev.filter((u) => u.id !== resumeId));
      toast("Resume deleted", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete resume", "error");
    }
  }

  async function handleDeleteAll() {
    if (!uploads || !uploads.length) return;
    if (!window.confirm("Delete all resumes? This cannot be undone.")) return;
    try {
      await deleteAllResumes();
      setUploads([]);
      toast("All resumes deleted", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete resumes", "error");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }

  function handleFileSelect(e) {
    processFile(e.target.files[0]);
  }

  async function processFile(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast("File too large. Max 5MB.", "error"); return; }
    if (!file.name.match(/\.(pdf|docx)$/i)) { toast("Only PDF or DOCX files allowed.", "error"); return; }

    setMatching(true);
    setStatusIdx(0);
    setMatchingPhase("upload");

    try {
      const { data } = await uploadResume(file);

      setMatchingPhase("matching");

      const d2 = data.data || data;
      const resumeId = d2.resume?.id || d2.id;
      if (resumeId) {
        await calculateMatches({ resumeId, topN: 5 });
        navigate(`/dashboard/matches?resumeId=${resumeId}`);
      } else {
        toast("Resume uploaded successfully!", "success");
        navigate("/dashboard/matches");
      }
    } catch (err) {
      toast(err.response?.data?.message || err.message, "error");
      setMatching(false);
    }
  }

  // If matching flow is active, show the animated screen
  if (matching) {
    return (
      <div className="matching-flow">
        <div className="matching-flow-header">
          <div className="matching-flow-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </div>
          <h2 className="matching-flow-title">
            {matchingPhase === "upload" ? "Uploading your resume" : "Finding your best matches"}
          </h2>
          <div className="matching-flow-status">
            <div className="matching-flow-spinner"></div>
            <span key={statusIdx} className="matching-flow-line">{AI_STATUS_LINES[statusIdx]}</span>
          </div>
          <div className="matching-flow-progress">
            <div className="matching-flow-progress-bar" style={{ animationDuration: "45s" }}></div>
          </div>
        </div>

        <div className="matching-flow-cards">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="match-card matching-flow-skeleton" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="match-score-ring">
                <div className="skeleton" style={{ width: 56, height: 56, borderRadius: "50%" }}></div>
              </div>
              <div className="match-body" style={{ flex: 1 }}>
                <div className="skeleton skeleton-line" style={{ height: 18, width: "65%", marginBottom: 8 }}></div>
                <div className="skeleton skeleton-line" style={{ height: 14, width: "45%", marginBottom: 14 }}></div>
                <div className="skeleton skeleton-line" style={{ height: 48, width: "100%", borderRadius: 6 }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page-grid">
      <div>
        <h2 className="section-title" style={{ marginBottom: 20 }}>Upload Resume</h2>

        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-zone-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16,16 12,12 8,16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>
          <div className="upload-zone-title">Drop your resume here</div>
          <p className="upload-zone-sub"><span>Click to browse</span> or drag &amp; drop<br />PDF or DOCX &middot; Max 5MB</p>
        </div>
        <input type="file" ref={fileInputRef} accept=".pdf,.docx" style={{ display: "none" }} onChange={handleFileSelect} />
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Uploads</h2>
          {uploads && uploads.length > 1 && (
            <button className="upload-delete-all-btn" onClick={handleDeleteAll}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete All
            </button>
          )}
        </div>
        <div className="upload-list">
          {uploads === null ? [0, 1, 2].map((i) => (
            <div key={i} className="upload-item">
              <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-line" style={{ height: 14, width: "70%", marginBottom: 6 }}></div>
                <div className="skeleton skeleton-line" style={{ height: 12, width: "40%" }}></div>
              </div>
            </div>
          )) : uploads.length ? uploads.map((u) => (
            <div key={u.id} className="upload-item" style={{ animation: "fadeUp 0.4s ease both" }}>
              <div className={`upload-item-icon ${u.type === "docx" ? "docx" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
                </svg>
              </div>
              <div className="upload-item-info">
                <div className="upload-item-name">{u.name}</div>
                <div className="upload-item-meta">Uploaded {u.date}</div>
              </div>
              <button className="upload-item-action" onClick={() => navigate(`/dashboard/matches?resumeId=${u.id}`)}>See matches &rarr;</button>
              <button className="upload-item-delete" onClick={(e) => handleDeleteResume(e, u.id, u.name)} title="Delete resume">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          )) : (
            <p style={{ color: "var(--ink-faint)", fontSize: "0.88rem" }}>No uploads yet</p>
          )}
        </div>
      </div>
    </div>
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
