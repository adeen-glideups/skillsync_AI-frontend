import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequestOtp, verifyOtp, resetPassword } from "../api/auth.api";
import "../styles/auth.css";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 60;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newPassword, 4=success
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpExpiresIn, setOtpExpiresIn] = useState(OTP_EXPIRY_SECONDS);
  const otpInputRefs = useRef([]);
  const autoVerifyLockRef = useRef(false);

  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  useEffect(() => {
    if (step !== 2) return;

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
  }, [step]);

  useEffect(() => {
    if (step !== 2) return;
    const otp = otpDigits.join("");

    if (otp.length === OTP_LENGTH && !loading && !autoVerifyLockRef.current) {
      autoVerifyLockRef.current = true;
      handleVerifyOtp(otp);
    }

    if (otp.length < OTP_LENGTH) {
      autoVerifyLockRef.current = false;
    }
  }, [otpDigits, step, loading]);

  function toast(msg, type = "default") {
    const container = toastRef.current;
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  async function handleRequestOtp(e) {
    e.preventDefault();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) { setEmailError(true); return; }
    setEmailError(false);
    setLoading(true);

    try {
      await forgotPasswordRequestOtp(email.trim());
      toast("Reset code sent to your email!", "success");
      setStep(2);
    } catch (err) {
      toast(err.message || "Failed to send reset code", "error");
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
    if (e.key === "Enter") {
      e.preventDefault();
      if (!loading) handleVerifyOtp();
      return;
    }

    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerifyOtp(otpOverride) {
    const otp = otpOverride || otpDigits.join("");
    if (otp.length < OTP_LENGTH) { toast("Enter all 6 digits", "error"); return; }

    setLoading(true);
    try {
      const { data } = await verifyOtp({ email: email.trim(), otp, purpose: "FORGOTPASSWORD" });
      const payload = data.data || data;

      // Store tokens if returned so we can call update-password
      if (payload?.accessToken) {
        localStorage.setItem("accessToken", payload.accessToken);
        if (payload.refreshToken) localStorage.setItem("refreshToken", payload.refreshToken);
      }

      toast("Code verified!", "success");
      setStep(3);
    } catch (err) {
      toast(err.message || "Invalid code", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPw.length < 8) { toast("Password must be at least 8 characters", "error"); return; }
    if (newPw !== confirmPw) { toast("Passwords do not match", "error"); return; }

    setLoading(true);
    try {
      await resetPassword(newPw);
      // Server logs out all devices on reset — clear local tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setStep(4);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      toast(err.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (otpExpiresIn > 0 || loading) return;

    try {
      await forgotPasswordRequestOtp(email.trim());
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpExpiresIn(OTP_EXPIRY_SECONDS);
      autoVerifyLockRef.current = false;
      otpInputRefs.current[0]?.focus();
      toast("New code sent!", "success");
    } catch { toast("Failed to resend", "error"); }
  }

  return (
    <div className="auth-page">
      <div className="toast-container" ref={toastRef}></div>

      <aside className="auth-left login-left">
        <div className="left-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="logo-name">SkillSync AI</span>
        </div>

        <div className="left-body">
          <h2 className="left-headline">
            Reset your<br /><em>password</em>
          </h2>
          <p className="left-sub">
            Enter your email and we&apos;ll send you a 6-digit code to reset your password.
          </p>
        </div>

        <div className="left-footer">&copy; 2025 SkillSync AI</div>
      </aside>

      <main className="auth-right">
        <div className="auth-form-box">
          {/* STEP 1: Email */}
          <div className={`step-panel ${step === 1 ? "active" : ""}`}>
            <div className="form-header anim-1">
              <h1 className="form-title">Forgot password?</h1>
              <p className="form-sub">
                Enter your email and we&apos;ll send a reset code. <Link to="/login">Back to login</Link>
              </p>
            </div>

            <form className="auth-form" onSubmit={handleRequestOtp} noValidate>
              <div className="auth-input-group anim-2">
                <label className="auth-input-label">Email address</label>
                <div className="auth-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,12 2,6" />
                  </svg>
                  <input className="auth-input" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <span className={`field-error ${emailError ? "show" : ""}`}>Please enter a valid email.</span>
              </div>

              <button type="submit" className="auth-btn auth-btn-dark anim-3" disabled={loading}>
                {loading ? <><span className="spinner"></span> Sending...</> : "Send reset code"}
              </button>
            </form>
          </div>

          {/* STEP 2: OTP */}
          <div className={`step-panel ${step === 2 ? "active" : ""}`}>
            <div className="form-header">
              <h1 className="form-title">Check your email</h1>
              <p className="form-sub">We sent a 6-digit code to {email}</p>
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
              {loading ? <><span className="spinner"></span> Verifying...</> : "Verify code"}
            </button>
          </div>

          {/* STEP 3: New Password */}
          <div className={`step-panel ${step === 3 ? "active" : ""}`}>
            <div className="form-header">
              <h1 className="form-title">New password</h1>
              <p className="form-sub">Enter your new password below</p>
            </div>

            <form className="auth-form" onSubmit={handleResetPassword} noValidate>
              <div className="auth-input-group">
                <label className="auth-input-label">New password</label>
                <div className="auth-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <input className="auth-input" type={showNewPw ? "text" : "password"} placeholder="Min. 8 characters" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                  <button type="button" className="pw-toggle" onClick={() => setShowNewPw(!showNewPw)} aria-label={showNewPw ? "Hide password" : "Show password"}>
                    {showNewPw ? (
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Confirm password</label>
                <div className="auth-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <input className="auth-input" type={showConfirmPw ? "text" : "password"} placeholder="Re-enter password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                  <button type="button" className="pw-toggle" onClick={() => setShowConfirmPw(!showConfirmPw)} aria-label={showConfirmPw ? "Hide password" : "Show password"}>
                    {showConfirmPw ? (
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn auth-btn-dark" disabled={loading}>
                {loading ? <><span className="spinner"></span> Resetting...</> : "Reset password"}
              </button>
            </form>
          </div>

          {/* STEP 4: Success */}
          <div className={`step-panel ${step === 4 ? "active" : ""}`}>
            <div className="success-screen">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12" /></svg>
              </div>
              <h2 className="success-title">Password reset!</h2>
              <p className="success-sub">Your password has been updated.<br />Redirecting to login...</p>
              <div className="spinner dark"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
