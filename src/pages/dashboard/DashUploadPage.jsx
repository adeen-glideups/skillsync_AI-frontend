import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchResumes, uploadResume } from "../../api/resume.api";
import { calculateMatches } from "../../api/matches.api";

export default function DashUploadPage() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [progressSub, setProgressSub] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUploads();
  }, []);

  async function loadUploads() {
    try {
      const { data } = await fetchResumes();
      const d = data.data || data;
      const resumes = d.resumes || d.items || [];
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

    setUploading(true);
    setProgressLabel("Uploading resume...");
    setProgressSub("Extracting text and generating embeddings");

    try {
      const { data } = await uploadResume(file);

      setProgressLabel("Finding your matches...");
      setProgressSub("Running semantic search + AI verification");

      const d2 = data.data || data;
      const resumeId = d2.resume?.id || d2.id;
      if (resumeId) await calculateMatches({ resumeId, topN: 5 });

      toast("Resume uploaded successfully!", "success");
      navigate("/dashboard/matches");
    } catch (err) {
      toast(err.response?.data?.message || err.message, "error");
    } finally {
      setUploading(false);
    }
  }

  async function runMatch(resumeId) {
    try {
      await calculateMatches({ resumeId, topN: 5 });
      navigate("/dashboard/matches");
    } catch (err) {
      toast(err.response?.data?.message || err.message, "error");
    }
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

        {uploading && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "var(--bg-card)", border: "1px solid var(--rule)", borderRadius: 10 }}>
              <div className="spinner dark"></div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--ink)" }}>{progressLabel}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--ink-faint)", marginTop: 2 }}>{progressSub}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="section-title" style={{ marginBottom: 20 }}>Recent Uploads</h2>
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
              <button className="upload-item-action" onClick={() => runMatch(u.id)}>Find matches &rarr;</button>
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
