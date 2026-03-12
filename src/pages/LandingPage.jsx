import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
  const landingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const reveals = landingRef.current?.querySelectorAll(".reveal");
    if (!reveals) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = [
              ...entry.target.parentElement.querySelectorAll(".reveal"),
            ];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 80}ms`;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing" ref={landingRef}>
      {/* ── NAV ── */}
      <nav className="landing-nav">
        <Link className="nav-logo" to="/">
          <div className="nav-logo-mark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="nav-logo-text">SkillSync AI</span>
        </Link>

        <ul className="nav-links">
          <li>
            <a href="#how">How it works</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#tech">Technology</a>
          </li>
        </ul>

        <div className="nav-cta">
          <Link to="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"></span>
            RAG-Powered Job Matching
          </div>

          <h1 className="hero-headline">
            Jobs that match
            <span className="line2">
              your <em>real</em> skills.
            </span>
          </h1>

          <p className="hero-sub">
            Upload your resume. Our two-stage AI pipeline uses semantic
            embeddings to retrieve candidates, then a cross-encoder LLM to
            verify each match — no false positives.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-hero">
              Upload your resume
              <span className="btn-hero-arrow">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 5h8M5 1l4 4-4 4" />
                </svg>
              </span>
            </Link>
            <span className="hero-note">Free · No credit card</span>
          </div>
        </div>

        {/* floating match cards */}
        <div className="hero-floaters">
          <div className="floater-card">
            <div className="floater-top">
              <span className="floater-company">TechCorp</span>
              <span className="score-pill score-high">92 / 100</span>
            </div>
            <div className="floater-title">Senior Frontend Engineer</div>
            <div className="floater-tags">
              <span className="tag">React</span>
              <span className="tag">TypeScript</span>
              <span className="tag">Remote</span>
            </div>
            <div className="floater-bar">
              <div
                className="floater-bar-fill"
                style={{ "--target-w": "92%", background: "var(--accent)" }}
              ></div>
            </div>
          </div>

          <div className="floater-card">
            <div className="floater-top">
              <span className="floater-company">StartupXYZ</span>
              <span className="score-pill score-high">78 / 100</span>
            </div>
            <div className="floater-title">Full Stack Developer</div>
            <div className="floater-tags">
              <span className="tag">Node.js</span>
              <span className="tag">MySQL</span>
            </div>
            <div className="floater-bar">
              <div
                className="floater-bar-fill"
                style={{ "--target-w": "78%", background: "#4a9e6b" }}
              ></div>
            </div>
          </div>

          <div className="floater-card">
            <div className="floater-top">
              <span className="floater-company">Agency Co</span>
              <span className="score-pill score-mid">61 / 100</span>
            </div>
            <div className="floater-title">Backend Engineer</div>
            <div className="floater-tags">
              <span className="tag">Express</span>
              <span className="tag">Docker</span>
            </div>
            <div className="floater-bar">
              <div
                className="floater-bar-fill"
                style={{ "--target-w": "61%", background: "var(--accent2)" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-num">768</span>
            <span className="stat-label">embedding dimensions</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">2-stage</span>
            <span className="stat-label">retrieval pipeline</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">0</span>
            <span className="stat-label">false positives shown</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">$0</span>
            <span className="stat-label">cost to run MVP</span>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how">
        <div className="section-inner">
          <p className="section-label reveal">Process</p>
          <h2 className="section-title reveal">
            Three steps from resume to ranked matches.
          </h2>

          <div className="steps-grid">
            <div className="step reveal">
              <div className="step-num">01</div>
              <div className="step-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
              </div>
              <div className="step-title">Upload your resume</div>
              <p className="step-desc">
                Drop in your PDF or DOCX. We extract raw text and pass it
                through the embedding pipeline to capture your full skill
                context.
              </p>
              <div className="step-tech">
                <span className="tech-badge">pdf-parse</span>
                <span className="tech-badge">mammoth</span>
              </div>
            </div>

            <div className="step reveal">
              <div className="step-num">02</div>
              <div className="step-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="step-title">Semantic retrieval</div>
              <p className="step-desc">
                Stage one: cosine similarity across all job embeddings retrieves
                the top 10 candidates. Fast, cheap, and filters hundreds of jobs
                instantly.
              </p>
              <div className="step-tech">
                <span className="tech-badge">text-embedding-004</span>
                <span className="tech-badge">cosine similarity</span>
              </div>
            </div>

            <div className="step reveal">
              <div className="step-num">03</div>
              <div className="step-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
              <div className="step-title">LLM verification</div>
              <p className="step-desc">
                Stage two: Groq reads your resume and each candidate job
                together and returns a verified 0–100 score. Only 50+ scores
                surface to you.
              </p>
              <div className="step-tech">
                <span className="tech-badge">Groq LLM</span>
                <span className="tech-badge">cross-encoder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PIPELINE DIAGRAM ── */}
      <section className="pipeline-section" id="tech">
        <div className="pipeline-inner">
          <p className="section-label reveal">Architecture</p>
          <h2 className="section-title reveal">
            The full RAG pipeline, visualized.
          </h2>

          <div className="pipeline-flow reveal">
            <div className="pipe-node highlight">
              <span className="pipe-node-icon">📄</span>
              <div className="pipe-node-title">Resume</div>
              <div className="pipe-node-sub">PDF / DOCX</div>
            </div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node">
              <span className="pipe-node-icon">✂️</span>
              <div className="pipe-node-title">Text Extract</div>
              <div className="pipe-node-sub">pdf-parse / mammoth</div>
            </div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node">
              <span className="pipe-node-icon">🧠</span>
              <div className="pipe-node-title">Embed</div>
              <div className="pipe-node-sub">768-dim vector</div>
            </div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node">
              <span className="pipe-node-icon">🗄️</span>
              <div className="pipe-node-title">MySQL Search</div>
              <div className="pipe-node-sub">top 10 by cosine</div>
            </div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node">
              <span className="pipe-node-icon">⚡</span>
              <div className="pipe-node-title">Groq Rerank</div>
              <div className="pipe-node-sub">0–100 score</div>
            </div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node">
              <span className="pipe-node-icon">🔍</span>
              <div className="pipe-node-title">Filter 50+</div>
              <div className="pipe-node-sub">kill false positives</div>
            </div>
            <div className="pipe-arrow">→</div>
            <div className="pipe-node highlight">
              <span className="pipe-node-icon">✅</span>
              <div className="pipe-node-title">Results</div>
              <div className="pipe-node-sub">ranked + explained</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" id="features">
        <div className="section-inner">
          <p className="section-label reveal">Why SkillSync</p>
          <h2 className="section-title reveal">
            Built to actually understand your experience.
          </h2>

          <div className="features-grid">
            <div className="feature-card accent-card reveal">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="feature-title">No false positives</div>
              <p className="feature-desc">
                Content writers won't see React roles. A two-stage LLM reranker
                verifies every match before it reaches you — no more "87% match"
                on jobs you're completely wrong for.
              </p>
            </div>

            <div className="feature-card reveal">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="feature-title">Explained matches</div>
              <p className="feature-desc">
                Every result comes with a 2-sentence explanation of why the job
                fits your profile. Not just a score — an insight you can act on.
              </p>
            </div>

            <div className="feature-card reveal">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
              </div>
              <div className="feature-title">Semantic understanding</div>
              <p className="feature-desc">
                Keyword filters miss "Node.js developer" matching "backend
                engineer." Our embedding model understands meaning, not just
                words.
              </p>
            </div>

            <div className="feature-card reveal">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="feature-title">Free tier, forever</div>
              <p className="feature-desc">
                Built entirely on free APIs — Gemini embeddings, Groq LLM, MySQL
                on Railway. Zero infrastructure cost at MVP scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title reveal">
            Ready to find your <em>real</em> match?
          </h2>
          <p className="cta-sub reveal">
            Drop your resume and let the pipeline do the work. Takes under 30
            seconds.
          </p>

          <div
            className="upload-zone reveal"
            onClick={() => navigate("/register")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/register");
            }}
          >
            <div className="upload-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16,16 12,12 8,16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <div className="upload-text">Drop your resume here</div>
            <div className="upload-hint">
              PDF or DOCX · Max 5MB · Free analysis
            </div>
          </div>

          <div className="reveal">
            <Link
              to="/register"
              className="btn-hero"
              style={{ display: "inline-flex" }}
            >
              Or create an account
              <span className="btn-hero-arrow">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 5h8M5 1l4 4-4 4" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-left">
            Built by <span>SkillSync AI</span> · RAG + Reranking architecture
          </div>
          <div className="footer-stack">
            <span className="stack-badge">Node.js</span>
            <span className="stack-badge">Prisma</span>
            <span className="stack-badge">Gemini</span>
            <span className="stack-badge">Groq</span>
            <span className="stack-badge">Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
