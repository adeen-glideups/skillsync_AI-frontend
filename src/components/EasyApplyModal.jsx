import { useState, useEffect } from "react";
import { getPrefill, saveContact, submitApplication } from "../api/easyApply.api";

export default function EasyApplyModal({ jobId, jobTitle, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1=contact, 2=resume+questions, 3=success
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [contact, setContact] = useState({ email: "", phone: "", countryCode: "+92", city: "", country: "" });
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    loadPrefill();
  }, [jobId]);

  async function loadPrefill() {
    try {
      const { data } = await getPrefill(jobId);
      const d = data.data || data;
      if (d.contact) {
        setContact({
          email: d.contact.email || "",
          phone: d.contact.phone || "",
          countryCode: d.contact.countryCode || "+92",
          city: d.contact.city || "",
          country: d.contact.country || "",
        });
      }
      setResumes(d.resumes || []);
      if (d.resumes?.length) setSelectedResume(d.resumes[0].id);
      setQuestions(d.screeningQuestions || []);
      const defaultAnswers = {};
      (d.screeningQuestions || []).forEach((q, i) => { defaultAnswers[i] = ""; });
      setAnswers(defaultAnswers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load application form");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!selectedResume) { setError("Please select a resume"); return; }
    setSubmitting(true);
    setError(null);

    try {
      // Save contact info first
      await saveContact({
        phone: contact.phone,
        countryCode: contact.countryCode,
        city: contact.city,
        country: contact.country,
      });

      // Submit application
      const answersList = questions.map((q, i) => ({
        question: q.question,
        answer: answers[i] || "",
      }));

      await submitApplication(jobId, {
        resumeId: selectedResume,
        contact: {
          email: contact.email,
          phone: contact.phone,
          countryCode: contact.countryCode,
          city: contact.city,
          country: contact.country,
        },
        answers: answersList,
      });

      setStep(3);
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || "Application failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}></div>

      <div style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", background: "var(--bg-card)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", padding: 32, animation: "scaleIn 0.3s ease both" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.4rem", color: "var(--ink)", marginBottom: 4 }}>
              {step === 3 ? "Application Sent!" : "Easy Apply"}
            </h2>
            {step !== 3 && <p style={{ fontSize: "0.84rem", color: "var(--ink-soft)" }}>{jobTitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-faint)", fontSize: "1.2rem", padding: 4 }}>&times;</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div className="spinner dark"></div>
            <p style={{ fontSize: "0.88rem", color: "var(--ink-faint)", marginTop: 12 }}>Loading form...</p>
          </div>
        ) : step === 3 ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div className="success-icon" style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-lt)", border: "2px solid rgba(26,107,74,0.2)", display: "grid", placeItems: "center", margin: "0 auto 20px", animation: "scaleIn 0.4s ease both" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="32" height="32"><polyline points="20,6 9,17 4,12" /></svg>
            </div>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.3rem", color: "var(--ink)", marginBottom: 8 }}>Application submitted!</h3>
            <p style={{ fontSize: "0.88rem", color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 20 }}>Your application for <strong>{jobTitle}</strong> has been submitted. Track it in My Applications.</p>
            <button className="dash-btn dash-btn-dark" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ padding: "10px 14px", background: "#fde8e8", borderRadius: 8, color: "#c0392b", fontSize: "0.84rem", marginBottom: 16 }}>{error}</div>
            )}

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)" }}>Contact Information</h3>

                <div className="dash-input-group">
                  <label className="dash-input-label">Email</label>
                  <input className="dash-input no-icon" style={{ paddingLeft: 14 }} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="your@email.com" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 10 }}>
                  <div className="dash-input-group">
                    <label className="dash-input-label">Code</label>
                    <input className="dash-input no-icon" style={{ paddingLeft: 14 }} value={contact.countryCode} onChange={(e) => setContact({ ...contact, countryCode: e.target.value })} placeholder="+92" />
                  </div>
                  <div className="dash-input-group">
                    <label className="dash-input-label">Phone</label>
                    <input className="dash-input no-icon" style={{ paddingLeft: 14 }} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="3001234567" />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div className="dash-input-group">
                    <label className="dash-input-label">City</label>
                    <input className="dash-input no-icon" style={{ paddingLeft: 14 }} value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} placeholder="Karachi" />
                  </div>
                  <div className="dash-input-group">
                    <label className="dash-input-label">Country</label>
                    <input className="dash-input no-icon" style={{ paddingLeft: 14 }} value={contact.country} onChange={(e) => setContact({ ...contact, country: e.target.value })} placeholder="PK" />
                  </div>
                </div>

                <button className="dash-btn dash-btn-dark" onClick={() => setStep(2)}>
                  Continue &rarr;
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)" }}>Select Resume</h3>

                {resumes.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {resumes.map((r) => (
                      <label key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: selectedResume === r.id ? "var(--accent-lt)" : "var(--bg)", border: `1px solid ${selectedResume === r.id ? "var(--accent)" : "var(--rule)"}`, borderRadius: 8, cursor: "pointer", transition: "all 0.2s" }}>
                        <input type="radio" name="resume" checked={selectedResume === r.id} onChange={() => setSelectedResume(r.id)} style={{ accentColor: "var(--accent)" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--ink)" }}>{r.fileName}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--ink-faint)" }}>Uploaded {new Date(r.uploadedAt).toLocaleDateString()}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.88rem", color: "var(--ink-faint)" }}>No resumes uploaded. Please upload a resume first.</p>
                )}

                {questions.length > 0 && (
                  <>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", marginTop: 8 }}>Screening Questions</h3>
                    {questions.map((q, i) => (
                      <div key={i} className="dash-input-group">
                        <label className="dash-input-label">{q.question}</label>
                        {q.type === "yesno" ? (
                          <div style={{ display: "flex", gap: 10 }}>
                            {["Yes", "No"].map((opt) => (
                              <button key={opt} className={`filter-chip ${answers[i] === opt ? "active" : ""}`} onClick={() => setAnswers({ ...answers, [i]: opt })} type="button">{opt}</button>
                            ))}
                          </div>
                        ) : (
                          <input className="dash-input no-icon" style={{ paddingLeft: 14 }} value={answers[i] || ""} onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })} placeholder="Your answer" />
                        )}
                      </div>
                    ))}
                  </>
                )}

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="dash-btn dash-btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>&larr; Back</button>
                  <button className="dash-btn dash-btn-dark" style={{ flex: 2 }} onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <><span className="spinner"></span> Submitting...</> : "Submit Application"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
