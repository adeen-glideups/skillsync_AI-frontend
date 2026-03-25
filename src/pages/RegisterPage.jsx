import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { signup, requestOtp, verifyOtp, socialLogin } from "../api/auth.api";
import { signInWithGoogle, signOutFromFirebase } from "../lib/firebase";
import "../styles/auth.css";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 60;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const toastRef = useRef(null);
  const fileRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState({ name: "", email: "", password: "", gender: "", profileImage: null });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpExpiresIn, setOtpExpiresIn] = useState(OTP_EXPIRY_SECONDS);
  const otpInputRefs = useRef([]);
  const autoVerifyLockRef = useRef(false);

  useEffect(() => {
    if (currentStep !== 3) return;

    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setOtpExpiresIn(OTP_EXPIRY_SECONDS);
    autoVerifyLockRef.current = false;

    const focusTimer = setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);

    const intervalId = setInterval(() => {
      setOtpExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(focusTimer);
      clearInterval(intervalId);
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 3) return;
    const otp = otpDigits.join("");

    if (otp.length === OTP_LENGTH && !loading && !autoVerifyLockRef.current) {
      autoVerifyLockRef.current = true;
      handleVerifyOtp(otp);
    }

    if (otp.length < OTP_LENGTH) {
      autoVerifyLockRef.current = false;
    }
  }, [otpDigits, currentStep, loading]);

  function toast(msg, type = "default") {
    const container = toastRef.current;
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  async function handleGoogleSignUp() {
    if (googleLoading || loading) return;
    setGoogleLoading(true);

    try {
      // Get Firebase token via Google popup
      const { token } = await signInWithGoogle();

      if (!token) {
        toast("Failed to authenticate with Google", "error");
        setGoogleLoading(false);
        return;
      }

      // Send Firebase token to backend (handles both login and signup)
      const res = await socialLogin(token);
      const payload = res.data?.data || res.data;
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;

      if (!accessToken) {
        await signOutFromFirebase();
        toast("Unexpected server response", "error");
        setGoogleLoading(false);
        return;
      }

      // Extract user object
      const { accessToken: _a, refreshToken: _r, ...user } = payload;

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth(user, accessToken);

      // Skip OTP for Google users (email already verified by Google)
      navigate("/dashboard");
    } catch (err) {
      await signOutFromFirebase();
      toast(err.message || "Google sign-up failed", "error");
      setGoogleLoading(false);
    }
  }

  function goPanel(n) { setCurrentStep(n); }

  function goStep2() {
    const errs = {};
    if (!state.name.trim()) errs.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) errs.email = true;
    if (state.password.length < 8) errs.password = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    goPanel(2);
  }

  function handleAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast("Image too large. Max 2MB.", "error"); return; }
    setState({ ...state, profileImage: file });
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function submitSignup() {
    if (!state.gender) { setErrors({ gender: true }); return; }
    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", state.name.trim());
      formData.append("email", state.email.trim());
      formData.append("password", state.password);
      formData.append("gender", state.gender);
      if (state.profileImage) formData.append("profileImage", state.profileImage);

      const { data } = await signup(formData);
      const payload = data.data || data;

      if (payload?.accessToken) {
        localStorage.setItem("accessToken", payload.accessToken);
        if (payload.refreshToken) localStorage.setItem("refreshToken", payload.refreshToken);
        const { accessToken: _a, refreshToken: _r, ...user } = payload;
        localStorage.setItem("user", JSON.stringify(user));
      }

      await requestOtp(state.email.trim(), "VERIFYEMAIL");

      goPanel(3);
    } catch (err) {
      toast(err.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  }

  function updateOtpFrom(index, rawValue) {
    const digits = (rawValue || "").replace(/\D/g, "");
    if (!digits) {
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setOtpDigits((prev) => {
      const next = [...prev];
      digits.slice(0, OTP_LENGTH - index).split("").forEach((digit, offset) => {
        next[index + offset] = digit;
      });
      return next;
    });

    const nextFocusIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
    otpInputRefs.current[nextFocusIndex]?.focus();
    otpInputRefs.current[nextFocusIndex]?.select();
  }

  function handleOtpInput(e, index) {
    updateOtpFrom(index, e.target.value);
  }

  function handleOtpPaste(e, index) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    updateOtpFrom(index, pasted);
  }

  function handleOtpKeyDown(e, index) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerifyOtp(otpOverride) {
    const otp = otpOverride || otpDigits.join("");
    if (otp.length < OTP_LENGTH) { toast("Enter all 6 digits", "error"); return; }

    setLoading(true);
    try {
      const { data } = await verifyOtp({ email: state.email.trim(), otp, purpose: "VERIFYEMAIL" });
      const payload = data.data || data;

      if (payload?.accessToken) {
        localStorage.setItem("accessToken", payload.accessToken);
        if (payload.refreshToken) localStorage.setItem("refreshToken", payload.refreshToken);
        const { accessToken: _a, refreshToken: _r, ...user } = payload;
        localStorage.setItem("user", JSON.stringify(user));
        setAuth(user, payload.accessToken);
      } else {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("accessToken");
        if (user && token) setAuth(user, token);
      }

      goPanel("success");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast(err.message || "Invalid OTP", "error");
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (otpExpiresIn > 0 || loading) return;

    try {
      await requestOtp(state.email.trim(), "VERIFYEMAIL");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpExpiresIn(OTP_EXPIRY_SECONDS);
      autoVerifyLockRef.current = false;
      otpInputRefs.current[0]?.focus();
      toast("New code sent!", "success");
    } catch { toast("Failed to resend", "error"); }
  }

  const stepItems = [
    { num: 1, name: "Your details", desc: "Name, email, password" },
    { num: 2, name: "Profile setup", desc: "Gender & photo" },
    { num: 3, name: "Verify email", desc: "6-digit OTP" },
  ];
  const progressPct = { 1: 33, 2: 66, 3: 100 };

  return (
    <div className="auth-page">
      <div className="toast-container" ref={toastRef}></div>

      <aside className="auth-left signup-left">
        <div className="left-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="logo-name">SkillSync AI</span>
        </div>

        <div className="left-steps">
          <p className="steps-label">Account setup</p>
          <div className="step-list">
            {stepItems.map((s) => (
              <div key={s.num} className={`step-item ${currentStep === s.num ? "active" : ""} ${typeof currentStep === "number" && s.num < currentStep ? "done" : ""}`}>
                <div className="step-dot">{s.num}</div>
                <div className="step-content">
                  <div className="step-name">{s.name}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="left-footer">&copy; 2025 SkillSync AI &middot; Free to use</div>
      </aside>

      <main className="auth-right">
        <div className="auth-form-box">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct[currentStep] || 100}%` }}></div>
          </div>

          {/* STEP 1 */}
          <div className={`step-panel ${currentStep === 1 ? "active" : ""}`}>
            <div className="form-header signup-header">
              <h1 className="form-title">Create account</h1>
              <p className="form-sub">Already have one? <Link to="/login">Sign in</Link></p>
            </div>

            <button className="google-btn" onClick={handleGoogleSignUp} disabled={googleLoading || loading}>
              {googleLoading ? (
                <><span className="spinner"></span> Connecting...</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            <div className="auth-divider"><span>or with email</span></div>

            <div className="auth-input-group">
              <label className="auth-input-label">Full name</label>
              <div className="auth-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input className="auth-input" type="text" placeholder="Ali Hassan" autoComplete="name" value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} />
              </div>
              <span className={`field-error ${errors.name ? "show" : ""}`}>Name is required.</span>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Email address</label>
              <div className="auth-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,12 2,6" /></svg>
                <input className="auth-input" type="email" placeholder="you@example.com" autoComplete="email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} />
              </div>
              <span className={`field-error ${errors.email ? "show" : ""}`}>Enter a valid email.</span>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Password</label>
              <div className="auth-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <input className="auth-input" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" autoComplete="new-password" value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} style={{ paddingRight: 44 }} />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPw ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              <span className={`field-error ${errors.password ? "show" : ""}`}>Min. 8 characters required.</span>
            </div>

            <button className="auth-btn auth-btn-dark" onClick={goStep2}>Continue &rarr;</button>
          </div>

          {/* STEP 2 */}
          <div className={`step-panel ${currentStep === 2 ? "active" : ""}`}>
            <div className="form-header signup-header">
              <h1 className="form-title">Your profile</h1>
              <p className="form-sub">Help us personalise your experience</p>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Gender</label>
              <div className="gender-group">
                {["male", "female", "other"].map((g) => (
                  <div className="gender-opt" key={g}>
                    <input type="radio" name="gender" id={g} value={g} checked={state.gender === g} onChange={() => setState({ ...state, gender: g })} />
                    <label htmlFor={g}>{g === "male" ? "\u2642 Male" : g === "female" ? "\u2640 Female" : "\u25CE Other"}</label>
                  </div>
                ))}
              </div>
              <span className={`field-error ${errors.gender ? "show" : ""}`}>Please select a gender.</span>
            </div>

            <div className="auth-input-group">
              <label className="auth-input-label">Profile photo <span style={{ color: "var(--ink-faint)", fontWeight: 400 }}>(optional)</span></label>
              <div className="avatar-upload">
                <div className="avatar-preview" onClick={() => fileRef.current?.click()}>
                  {avatarPreview ? <img src={avatarPreview} alt="preview" /> : <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                </div>
                <div className="avatar-info"><span onClick={() => fileRef.current?.click()}>Click to upload</span> a photo<br />JPG, PNG or WebP &middot; Max 2MB</div>
              </div>
              <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="auth-btn auth-btn-ghost" style={{ flex: 1 }} onClick={() => goPanel(1)}>&larr; Back</button>
              <button className="auth-btn auth-btn-dark" style={{ flex: 2 }} onClick={submitSignup} disabled={loading}>
                {loading ? <span className="spinner"></span> : "Create account"}
              </button>
            </div>
          </div>

          {/* STEP 3: OTP */}
          <div className={`step-panel ${currentStep === 3 ? "active" : ""}`}>
            <div className="form-header signup-header">
              <h1 className="form-title">Check your email</h1>
              <p className="form-sub">We sent a 6-digit code to {state.email}</p>
            </div>

            <div className="otp-group">
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpInputRefs.current[i] = el;
                  }}
                  className="otp-input"
                  maxLength="6"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otpDigits[i]}
                  onInput={(e) => handleOtpInput(e, i)}
                  onPaste={(e) => handleOtpPaste(e, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            <div className="otp-footer">
              <p className="otp-hint">The code expires in <strong>{otpExpiresIn} seconds</strong></p>
              <p className="otp-resend">
                Didn&apos;t get it? <button onClick={resendOtp} disabled={otpExpiresIn > 0 || loading}>Resend code</button>
              </p>
            </div>

            <button className="auth-btn auth-btn-dark" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? <><span className="spinner"></span> Verifying...</> : "Verify & Sign in"}
            </button>
          </div>

          {/* SUCCESS */}
          <div className={`step-panel ${currentStep === "success" ? "active" : ""}`}>
            <div className="success-screen">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12" /></svg>
              </div>
              <h2 className="success-title">You&apos;re in!</h2>
              <p className="success-sub">Your account is verified.<br />Redirecting to your dashboard...</p>
              <div className="spinner dark"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
