import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { login } from "../api/auth.api";
import "../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);

  function toast(msg, type = "default") {
    const container = toastRef.current;
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  function validate() {
    let ok = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email.trim())) { setEmailError(true); ok = false; } else setEmailError(false);
    if (password.length < 8) { setPwError(true); ok = false; } else setPwError(false);
    return ok;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login({
        email: email.trim(),
        password,
        deviceType: "web",
      });

      const payload = res.data?.data || res.data;
      const user = payload?.user;
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;

      if (!accessToken || !user) {
        toast("Unexpected server response", "error");
        setLoading(false);
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth(user, accessToken);

      navigate("/dashboard");
    } catch (err) {
      let msg = "Login failed";
      if (err.response) {
        const data = err.response.data;
        msg = (data && typeof data === "object" && data.message) ? data.message : "Invalid email or password";
      } else if (err.request) {
        msg = "Network error — check connection";
      }
      toast(msg, "error");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="toast-container" ref={toastRef}></div>

      {/* Left Panel */}
      <aside className="auth-left login-left">
        <div className="left-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="logo-name">SkillSync AI</span>
        </div>

        <div className="left-body">
          <h2 className="left-headline">
            Your skills,<br /><em>perfectly</em><br />matched.
          </h2>
          <p className="left-sub">
            Upload your resume and our two-stage AI pipeline finds jobs that actually fit — with an explanation for each match.
          </p>

          <div className="mini-cards">
            <div className="mini-card">
              <div className="mini-card-info">
                <span className="mini-card-title">Senior Frontend Engineer</span>
                <span className="mini-card-co">TechCorp &middot; Remote</span>
              </div>
              <span className="mini-score score-green">92/100</span>
            </div>
            <div className="mini-card">
              <div className="mini-card-info">
                <span className="mini-card-title">Full Stack Developer</span>
                <span className="mini-card-co">StartupXYZ &middot; Hybrid</span>
              </div>
              <span className="mini-score score-green">78/100</span>
            </div>
            <div className="mini-card">
              <div className="mini-card-info">
                <span className="mini-card-title">Backend Node Engineer</span>
                <span className="mini-card-co">Agency Co &middot; On-site</span>
              </div>
              <span className="mini-score score-amber">61/100</span>
            </div>
          </div>
        </div>

        <div className="left-footer">&copy; 2025 SkillSync AI &middot; Free &middot; Powered by Gemini + Groq</div>
      </aside>

      {/* Right Panel */}
      <main className="auth-right">
        <div className="auth-form-box">
          <div className="form-header anim-1">
            <h1 className="form-title">Welcome back</h1>
            <p className="form-sub">
              Don&apos;t have an account? <Link to="/register">Sign up free</Link>
            </p>
          </div>

          <button className="google-btn anim-2" onClick={() => toast("Google sign-in coming soon!")}>
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Continue with Google
          </button>

          <div className="auth-divider anim-3"><span>or sign in with email</span></div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-input-group anim-3">
              <label className="auth-input-label">Email address</label>
              <div className="auth-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,12 2,6" />
                </svg>
                <input
                  className="auth-input"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <span className={`field-error ${emailError ? "show" : ""}`}>Please enter a valid email.</span>
            </div>

            <div className="auth-input-group anim-4">
              <label className="auth-input-label">Password</label>
              <div className="auth-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  className="auth-input"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                />
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
              <span className={`field-error ${pwError ? "show" : ""}`}>Password must be at least 8 characters.</span>
              <div className="forgot-link"><Link to="/forgot-password">Forgot password?</Link></div>
            </div>

            <button type="submit" className="auth-btn auth-btn-dark anim-5" disabled={loading}>
              {loading ? <><span className="spinner"></span> Signing in...</> : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
