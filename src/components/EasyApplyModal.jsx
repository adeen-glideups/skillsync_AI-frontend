import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getPrefill, saveContact, submitApplication } from "../api/easyApply.api";
import "../styles/easy-apply.css";

export default function EasyApplyModal({ jobId, jobTitle, jobCompany, onClose, onSuccess }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=loading, 2=form, 3=submitting, 4=success, 5=error
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Form data
  const [contact, setContact] = useState({ email: "", phone: "", countryCode: "+92", city: "", country: "" });
  const [contactSource, setContactSource] = useState("");
  const [saveContactInfo, setSaveContactInfo] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [job, setJob] = useState(null);
  const [errors, setErrors] = useState({});

  // Close on escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Load prefill
  useEffect(() => {
    loadPrefill();
  }, [jobId]);

  async function loadPrefill() {
    setLoading(true);
    setError(null);
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
        setContactSource(d.contact.source || "");
      }

      setJob(d.job || null);
      setResumes(d.resumes || []);
      if (d.resumes?.length) setSelectedResume(d.resumes[0].id);

      setQuestions(d.screeningQuestions || []);
      const defaultAnswers = {};
      (d.screeningQuestions || []).forEach((_, i) => { defaultAnswers[i] = ""; });
      setAnswers(defaultAnswers);

      setStep(2);
    } catch (err) {
      const errCode = err.response?.data?.errorCode;
      const errMsg = err.response?.data?.message || "Failed to load application form";

      if (errCode === "ALREADY_APPLIED") {
        setAlreadyApplied(true);
        setError("You have already applied to this job.");
      } else if (errCode === "JOB_NOT_FOUND") {
        setError("This job is no longer available.");
      } else {
        setError(errMsg);
      }
      setStep(5);
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    const errs = {};

    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errs.email = "Please enter a valid email";
    }
    if (contact.phone && !/^\d{6,15}$/.test(contact.phone)) {
      errs.phone = "Enter valid digits (6-15)";
    }
    if (contact.countryCode && !/^\+\d{1,4}$/.test(contact.countryCode)) {
      errs.countryCode = "e.g., +92";
    }
    if (!selectedResume) {
      errs.resume = "Required";
    }
    questions.forEach((q, i) => {
      if (q.type === "number" && answers[i] && isNaN(Number(answers[i]))) {
        errs[`q${i}`] = "Enter a number";
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    setSubmitting(true);
    setStep(3);
    setError(null);

    try {
      if (saveContactInfo) {
        await saveContact({
          phone: contact.phone,
          countryCode: contact.countryCode,
          city: contact.city,
          country: contact.country,
        }).catch(() => {});
      }

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

      setStep(4);
      if (onSuccess) onSuccess();
    } catch (err) {
      const errCode = err.response?.data?.errorCode;
      const errMsg = err.response?.data?.message || "Application submission failed";

      if (errCode === "ALREADY_APPLIED") {
        setAlreadyApplied(true);
        setError("You have already applied to this job.");
        setStep(5);
      } else if (errCode === "RESUME_NOT_FOUND") {
        setError("Resume not found. Please select another.");
        setStep(2);
      } else {
        setError(errMsg);
        setStep(2);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function updateContact(field, value) {
    setContact((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function updateAnswer(index, value) {
    setAnswers((prev) => ({ ...prev, [index]: value }));
    if (errors[`q${index}`]) setErrors((prev) => ({ ...prev, [`q${index}`]: null }));
  }

  const displayTitle = jobTitle || job?.title || "Job";
  const displayCompany = jobCompany || job?.company || "Company";

  return createPortal(
    <div className="ea-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ea-modal">
        {/* Header */}
        <div className="ea-header">
          <div>
            <h2 className="ea-title">{step === 4 ? "Application Sent!" : "Easy Apply"}</h2>
            {step !== 4 && step !== 5 && <p className="ea-subtitle">{displayTitle}</p>}
          </div>
          <button className="ea-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Loading */}
        {step === 1 && (
          <div className="ea-loading">
            <div className="ea-skel-group">
              <div className="skeleton" style={{ height: 18, width: "35%", marginBottom: 14 }}></div>
              <div className="skeleton" style={{ height: 42, width: "100%", marginBottom: 10 }}></div>
              <div className="ea-skel-row">
                <div className="skeleton" style={{ height: 42, width: 90 }}></div>
                <div className="skeleton" style={{ height: 42, flex: 1 }}></div>
              </div>
              <div className="ea-skel-row">
                <div className="skeleton" style={{ height: 42, flex: 1 }}></div>
                <div className="skeleton" style={{ height: 42, flex: 1 }}></div>
              </div>
            </div>
            <div className="ea-skel-group">
              <div className="skeleton" style={{ height: 18, width: "30%", marginBottom: 14 }}></div>
              <div className="skeleton" style={{ height: 54, width: "100%", marginBottom: 8 }}></div>
              <div className="skeleton" style={{ height: 54, width: "100%" }}></div>
            </div>
            <div className="ea-loading-text">
              <span className="spinner"></span>
              Preparing your application...
            </div>
          </div>
        )}

        {/* Submitting */}
        {step === 3 && (
          <div className="ea-state">
            <div className="ea-state-icon sending">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
            <h3>Sending application...</h3>
            <p>Please wait while we submit to {displayCompany}.</p>
            <div className="spinner dark" style={{ marginTop: 16 }}></div>
          </div>
        )}

        {/* Success */}
        {step === 4 && (
          <div className="ea-state">
            <div className="ea-state-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            <h3>Application submitted!</h3>
            <p>Your application for <strong>{displayTitle}</strong> has been sent. You'll receive a confirmation email shortly.</p>
            <div className="ea-actions">
              <button className="dash-btn dash-btn-ghost" onClick={() => { onClose(); navigate("/dashboard/applications"); }}>
                View Applications
              </button>
              <button className="dash-btn dash-btn-dark" onClick={onClose}>Done</button>
            </div>
          </div>
        )}

        {/* Error */}
        {step === 5 && (
          <div className="ea-state">
            <div className="ea-state-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3>{alreadyApplied ? "Already Applied" : "Unable to Apply"}</h3>
            <p>{error}</p>
            <div className="ea-actions">
              {alreadyApplied ? (
                <button className="dash-btn dash-btn-dark" onClick={() => { onClose(); navigate("/dashboard/applications"); }}>
                  View My Applications
                </button>
              ) : (
                <>
                  <button className="dash-btn dash-btn-ghost" onClick={onClose}>Close</button>
                  <button className="dash-btn dash-btn-dark" onClick={loadPrefill}>Try Again</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        {step === 2 && (
          <div className="ea-form">
            {error && <div className="ea-alert error">{error}</div>}

            {contactSource === "extracted" && (
              <div className="ea-alert info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
                Contact auto-filled from resume. Please verify.
              </div>
            )}

            {/* Contact */}
            <div className="ea-section">
              <h3 className="ea-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Contact Information
              </h3>

              <div className="ea-field">
                <label>Email</label>
                <input
                  type="email"
                  className={errors.email ? "error" : ""}
                  value={contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="ea-field-error">{errors.email}</span>}
              </div>

              <div className="ea-row">
                <div className="ea-field" style={{ width: 90, flexShrink: 0 }}>
                  <label>Code</label>
                  <input
                    type="text"
                    className={errors.countryCode ? "error" : ""}
                    value={contact.countryCode}
                    onChange={(e) => updateContact("countryCode", e.target.value)}
                    placeholder="+92"
                  />
                </div>
                <div className="ea-field" style={{ flex: 1 }}>
                  <label>Phone</label>
                  <input
                    type="tel"
                    className={errors.phone ? "error" : ""}
                    value={contact.phone}
                    onChange={(e) => updateContact("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="3001234567"
                  />
                  {errors.phone && <span className="ea-field-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="ea-row">
                <div className="ea-field">
                  <label>City</label>
                  <input
                    type="text"
                    value={contact.city}
                    onChange={(e) => updateContact("city", e.target.value)}
                    placeholder="Karachi"
                  />
                </div>
                <div className="ea-field">
                  <label>Country</label>
                  <input
                    type="text"
                    value={contact.country}
                    onChange={(e) => updateContact("country", e.target.value)}
                    placeholder="Pakistan"
                  />
                </div>
              </div>

              <label className="ea-checkbox">
                <input type="checkbox" checked={saveContactInfo} onChange={(e) => setSaveContactInfo(e.target.checked)} />
                <span>Save for future applications</span>
              </label>
            </div>

            {/* Resume */}
            <div className="ea-section">
              <h3 className="ea-section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
                </svg>
                Select Resume
                {errors.resume && <span className="ea-field-error" style={{ marginLeft: 8, fontWeight: 400 }}>({errors.resume})</span>}
              </h3>

              {resumes.length ? (
                <div className="ea-resume-list">
                  {resumes.map((r) => (
                    <label key={r.id} className={`ea-resume-item ${selectedResume === r.id ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="resume"
                        checked={selectedResume === r.id}
                        onChange={() => {
                          setSelectedResume(r.id);
                          if (errors.resume) setErrors((prev) => ({ ...prev, resume: null }));
                        }}
                      />
                      <div className="ea-resume-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
                        </svg>
                      </div>
                      <div className="ea-resume-info">
                        <span className="ea-resume-name">{r.fileName || r.name}</span>
                        <span className="ea-resume-date">{new Date(r.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      {selectedResume === r.id && (
                        <svg className="ea-resume-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="ea-no-resume">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  <p>No resumes uploaded</p>
                  <button className="dash-btn dash-btn-ghost" onClick={() => { onClose(); navigate("/dashboard/upload"); }}>
                    Upload Resume
                  </button>
                </div>
              )}
            </div>

            {/* Questions */}
            {questions.length > 0 && (
              <div className="ea-section">
                <h3 className="ea-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Screening Questions
                </h3>

                {questions.map((q, i) => (
                  <div key={i} className="ea-field">
                    <label>{q.question}</label>
                    {q.type === "yesno" ? (
                      <div className="ea-yesno">
                        {["Yes", "No"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            className={answers[i] === opt ? "selected" : ""}
                            onClick={() => updateAnswer(i, opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={q.type === "number" ? "number" : "text"}
                        className={errors[`q${i}`] ? "error" : ""}
                        value={answers[i] || ""}
                        onChange={(e) => updateAnswer(i, e.target.value)}
                        placeholder={q.type === "number" ? "Enter a number" : "Your answer"}
                      />
                    )}
                    {errors[`q${i}`] && <span className="ea-field-error">{errors[`q${i}`]}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="ea-footer">
              <button className="dash-btn dash-btn-ghost" onClick={onClose}>Cancel</button>
              <button
                className="dash-btn dash-btn-dark"
                onClick={handleSubmit}
                disabled={submitting || !resumes.length}
              >
                {submitting ? (
                  <><span className="spinner"></span> Submitting...</>
                ) : (
                  <>
                    Submit Application
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
