<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkillSync AI — Find Jobs That Actually Match You</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:        #0f0f0f;
      --ink-soft:   #5a5a5a;
      --ink-faint:  #9a9a9a;
      --bg:         #f7f5f0;
      --bg-card:    #ffffff;
      --accent:     #1a6b4a;
      --accent-lt:  #e8f5ee;
      --accent2:    #d4622a;
      --rule:       #e2dfd8;
      --serif:      'Instrument Serif', Georgia, serif;
      --sans:       'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--sans);
      background: var(--bg);
      color: var(--ink);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Noise texture overlay ── */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
      opacity: 0.4;
    }

    /* ════════════════════════════════
       NAV
    ════════════════════════════════ */
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px;
      height: 64px;
      background: rgba(247,245,240,0.88);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--rule);
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .nav-logo-mark {
      width: 32px;
      height: 32px;
      background: var(--accent);
      border-radius: 8px;
      display: grid;
      place-items: center;
    }

    .nav-logo-mark svg { width: 18px; height: 18px; }

    .nav-logo-text {
      font-family: var(--serif);
      font-size: 1.15rem;
      color: var(--ink);
      letter-spacing: -0.01em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
      list-style: none;
    }

    .nav-links a {
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--ink-soft);
      transition: color 0.2s;
    }

    .nav-links a:hover { color: var(--ink); }

    .nav-cta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-ghost {
      padding: 8px 20px;
      border: 1px solid var(--rule);
      border-radius: 6px;
      background: transparent;
      font-family: var(--sans);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--ink);
      cursor: pointer;
      text-decoration: none;
      transition: border-color 0.2s, background 0.2s;
    }

    .btn-ghost:hover { background: var(--bg-card); border-color: #c8c4bc; }

    .btn-primary {
      padding: 8px 20px;
      border: none;
      border-radius: 6px;
      background: var(--accent);
      font-family: var(--sans);
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.2s, transform 0.15s;
    }

    .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

    /* ════════════════════════════════
       HERO
    ════════════════════════════════ */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 120px 48px 80px;
      position: relative;
      overflow: hidden;
    }

    /* background grid */
    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(var(--rule) 1px, transparent 1px),
        linear-gradient(90deg, var(--rule) 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
      opacity: 0.5;
      pointer-events: none;
    }

    .hero-inner {
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--accent-lt);
      border: 1px solid #b8dfc8;
      border-radius: 100px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--accent);
      margin-bottom: 32px;
      opacity: 0;
      animation: fadeUp 0.6s 0.1s ease forwards;
    }

    .hero-eyebrow-dot {
      width: 6px; height: 6px;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }

    .hero-headline {
      font-family: var(--serif);
      font-size: clamp(3rem, 7vw, 6.5rem);
      line-height: 1.05;
      letter-spacing: -0.03em;
      color: var(--ink);
      margin-bottom: 28px;
      opacity: 0;
      animation: fadeUp 0.7s 0.2s ease forwards;
    }

    .hero-headline em {
      font-style: italic;
      color: var(--accent);
    }

    .hero-headline .line2 {
      display: block;
      padding-left: 120px; /* offset for editorial feel */
    }

    .hero-sub {
      font-size: 1.125rem;
      font-weight: 300;
      line-height: 1.7;
      color: var(--ink-soft);
      max-width: 520px;
      margin-bottom: 48px;
      opacity: 0;
      animation: fadeUp 0.7s 0.35s ease forwards;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      opacity: 0;
      animation: fadeUp 0.7s 0.45s ease forwards;
    }

    .btn-hero {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      background: var(--ink);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-family: var(--sans);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, transform 0.15s;
    }

    .btn-hero:hover { background: #2a2a2a; transform: translateY(-2px); }

    .btn-hero-arrow {
      width: 20px; height: 20px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: grid;
      place-items: center;
      transition: transform 0.2s;
    }

    .btn-hero:hover .btn-hero-arrow { transform: translateX(3px); }

    .hero-note {
      font-size: 0.85rem;
      color: var(--ink-faint);
    }

    /* floating score cards */
    .hero-floaters {
      position: absolute;
      right: 48px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 16px;
      opacity: 0;
      animation: fadeLeft 0.8s 0.6s ease forwards;
    }

    @keyframes fadeLeft {
      from { opacity: 0; transform: translateY(-50%) translateX(40px); }
      to { opacity: 1; transform: translateY(-50%) translateX(0); }
    }

    .floater-card {
      background: var(--bg-card);
      border: 1px solid var(--rule);
      border-radius: 12px;
      padding: 16px 20px;
      width: 260px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .floater-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .floater-card:nth-child(2) { margin-left: 24px; }
    .floater-card:nth-child(3) { margin-left: 12px; }

    .floater-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .floater-company {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ink-faint);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .score-pill {
      padding: 3px 10px;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .score-high { background: #e8f5ee; color: #1a6b4a; }
    .score-mid  { background: #fef3e8; color: #c25a15; }
    .score-low  { background: #fde8e8; color: #b91c1c; }

    .floater-title {
      font-family: var(--serif);
      font-size: 1rem;
      line-height: 1.3;
      color: var(--ink);
      margin-bottom: 8px;
    }

    .floater-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .tag {
      padding: 3px 9px;
      background: var(--bg);
      border: 1px solid var(--rule);
      border-radius: 4px;
      font-size: 0.72rem;
      color: var(--ink-soft);
    }

    .floater-bar {
      margin-top: 12px;
      height: 3px;
      background: var(--rule);
      border-radius: 2px;
      overflow: hidden;
    }

    .floater-bar-fill {
      height: 100%;
      border-radius: 2px;
      animation: barGrow 1.4s 1s ease forwards;
      width: 0%;
    }

    @keyframes barGrow {
      to { width: var(--target-w); }
    }

    /* ════════════════════════════════
       STATS BAR
    ════════════════════════════════ */
    .stats-bar {
      background: var(--ink);
      padding: 28px 48px;
    }

    .stats-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
    }

    .stat-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .stat-num {
      font-family: var(--serif);
      font-size: 2.2rem;
      color: #fff;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.5);
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.12);
    }

    /* ════════════════════════════════
       HOW IT WORKS
    ════════════════════════════════ */
    .section {
      padding: 120px 48px;
    }

    .section-inner {
      max-width: 1100px;
      margin: 0 auto;
    }

    .section-label {
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 16px;
    }

    .section-title {
      font-family: var(--serif);
      font-size: clamp(2rem, 4vw, 3.2rem);
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: var(--ink);
      max-width: 560px;
      margin-bottom: 72px;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
    }

    .step {
      background: var(--bg-card);
      padding: 40px 36px;
      border: 1px solid var(--rule);
      position: relative;
      overflow: hidden;
      transition: transform 0.3s;
    }

    .step:first-child { border-radius: 12px 0 0 12px; }
    .step:last-child  { border-radius: 0 12px 12px 0; }

    .step:hover { transform: translateY(-4px); z-index: 1; box-shadow: 0 12px 40px rgba(0,0,0,0.08); }

    .step-num {
      font-family: var(--serif);
      font-size: 4rem;
      color: var(--rule);
      line-height: 1;
      margin-bottom: 24px;
      transition: color 0.3s;
    }

    .step:hover .step-num { color: var(--accent-lt); }

    .step-icon {
      width: 44px;
      height: 44px;
      background: var(--accent-lt);
      border-radius: 10px;
      display: grid;
      place-items: center;
      margin-bottom: 20px;
    }

    .step-icon svg { width: 22px; height: 22px; stroke: var(--accent); }

    .step-title {
      font-family: var(--serif);
      font-size: 1.35rem;
      line-height: 1.2;
      color: var(--ink);
      margin-bottom: 12px;
    }

    .step-desc {
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--ink-soft);
    }

    .step-tech {
      margin-top: 24px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .tech-badge {
      padding: 4px 10px;
      background: var(--bg);
      border: 1px solid var(--rule);
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 500;
      color: var(--ink-soft);
      font-family: 'Courier New', monospace;
    }

    /* ════════════════════════════════
       PIPELINE DIAGRAM
    ════════════════════════════════ */
    .pipeline-section {
      padding: 80px 48px 120px;
      background: var(--bg-card);
      border-top: 1px solid var(--rule);
      border-bottom: 1px solid var(--rule);
    }

    .pipeline-inner {
      max-width: 1100px;
      margin: 0 auto;
    }

    .pipeline-flow {
      display: flex;
      align-items: center;
      gap: 0;
      margin-top: 64px;
      overflow-x: auto;
      padding-bottom: 8px;
    }

    .pipe-node {
      flex: 1;
      min-width: 140px;
      background: var(--bg);
      border: 1px solid var(--rule);
      border-radius: 10px;
      padding: 20px 16px;
      text-align: center;
      position: relative;
      transition: background 0.2s, border-color 0.2s;
    }

    .pipe-node:hover { background: var(--accent-lt); border-color: #b8dfc8; }

    .pipe-node-icon {
      font-size: 1.6rem;
      margin-bottom: 10px;
      display: block;
    }

    .pipe-node-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 4px;
    }

    .pipe-node-sub {
      font-size: 0.72rem;
      color: var(--ink-faint);
    }

    .pipe-arrow {
      padding: 0 4px;
      color: var(--ink-faint);
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .pipe-node.highlight {
      background: var(--ink);
      border-color: var(--ink);
    }

    .pipe-node.highlight .pipe-node-title { color: #fff; }
    .pipe-node.highlight .pipe-node-sub   { color: rgba(255,255,255,0.5); }

    /* ════════════════════════════════
       FEATURES
    ════════════════════════════════ */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--rule);
      border-radius: 12px;
      padding: 36px;
      transition: box-shadow 0.3s, transform 0.3s;
    }

    .feature-card:hover {
      box-shadow: 0 8px 32px rgba(0,0,0,0.07);
      transform: translateY(-3px);
    }

    .feature-card.accent-card {
      background: var(--accent);
      border-color: var(--accent);
    }

    .feature-card.accent-card .feature-title { color: #fff; }
    .feature-card.accent-card .feature-desc  { color: rgba(255,255,255,0.75); }

    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--bg);
      display: grid;
      place-items: center;
      margin-bottom: 20px;
    }

    .accent-card .feature-icon { background: rgba(255,255,255,0.15); }

    .feature-icon svg { width: 24px; height: 24px; stroke: var(--accent); }
    .accent-card .feature-icon svg { stroke: #fff; }

    .feature-title {
      font-family: var(--serif);
      font-size: 1.3rem;
      color: var(--ink);
      margin-bottom: 10px;
    }

    .feature-desc {
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--ink-soft);
    }

    /* ════════════════════════════════
       UPLOAD CTA
    ════════════════════════════════ */
    .cta-section {
      padding: 120px 48px;
      text-align: center;
    }

    .cta-inner {
      max-width: 680px;
      margin: 0 auto;
    }

    .cta-title {
      font-family: var(--serif);
      font-size: clamp(2.5rem, 5vw, 4rem);
      line-height: 1.1;
      letter-spacing: -0.025em;
      color: var(--ink);
      margin-bottom: 20px;
    }

    .cta-title em { color: var(--accent); font-style: italic; }

    .cta-sub {
      font-size: 1.05rem;
      color: var(--ink-soft);
      line-height: 1.7;
      margin-bottom: 48px;
    }

    .upload-zone {
      border: 2px dashed var(--rule);
      border-radius: 16px;
      padding: 56px 40px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      background: var(--bg-card);
      margin-bottom: 24px;
    }

    .upload-zone:hover {
      border-color: var(--accent);
      background: var(--accent-lt);
    }

    .upload-icon {
      width: 56px;
      height: 56px;
      background: var(--bg);
      border-radius: 14px;
      display: grid;
      place-items: center;
      margin: 0 auto 20px;
      border: 1px solid var(--rule);
    }

    .upload-icon svg { width: 28px; height: 28px; stroke: var(--ink-soft); }

    .upload-text {
      font-size: 1rem;
      font-weight: 500;
      color: var(--ink);
      margin-bottom: 6px;
    }

    .upload-hint {
      font-size: 0.85rem;
      color: var(--ink-faint);
    }

    /* ════════════════════════════════
       FOOTER
    ════════════════════════════════ */
    footer {
      border-top: 1px solid var(--rule);
      padding: 40px 48px;
    }

    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .footer-left {
      font-size: 0.85rem;
      color: var(--ink-faint);
    }

    .footer-left span { color: var(--ink-soft); font-family: var(--serif); }

    .footer-stack {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .stack-badge {
      padding: 4px 10px;
      border: 1px solid var(--rule);
      border-radius: 4px;
      font-size: 0.72rem;
      font-family: 'Courier New', monospace;
      color: var(--ink-soft);
    }

    /* ════════════════════════════════
       ANIMATIONS
    ════════════════════════════════ */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .reveal {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      nav { padding: 0 24px; }
      .nav-links { display: none; }
      .hero { padding: 100px 24px 60px; }
      .hero-floaters { display: none; }
      .hero-headline .line2 { padding-left: 0; }
      .stats-inner { flex-wrap: wrap; gap: 24px; }
      .stat-divider { display: none; }
      .section { padding: 80px 24px; }
      .pipeline-section { padding: 60px 24px; }
      .steps-grid { grid-template-columns: 1fr; gap: 12px; }
      .step { border-radius: 12px !important; }
      .features-grid { grid-template-columns: 1fr; }
      .cta-section { padding: 80px 24px; }
      footer { padding: 32px 24px; }
      .footer-inner { flex-direction: column; gap: 16px; text-align: center; }
    }
  </style>
</head>
<body>

  <!-- ── NAV ── -->
  <nav>
    <a class="nav-logo" href="#">
      <div class="nav-logo-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <span class="nav-logo-text">SkillSync AI</span>
    </a>

    <ul class="nav-links">
      <li><a href="#how">How it works</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#tech">Technology</a></li>
    </ul>

    <div class="nav-cta">
      <a href="/login" class="btn-ghost">Sign in</a>
      <a href="/register" class="btn-primary">Get started</a>
    </div>
  </nav>

  <!-- ── HERO ── -->
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-eyebrow">
        <span class="hero-eyebrow-dot"></span>
        RAG-Powered Job Matching
      </div>

      <h1 class="hero-headline">
        Jobs that match
        <span class="line2">your <em>real</em> skills.</span>
      </h1>

      <p class="hero-sub">
        Upload your resume. Our two-stage AI pipeline uses semantic embeddings to retrieve candidates, then a cross-encoder LLM to verify each match — no false positives.
      </p>

      <div class="hero-actions">
        <a href="/register" class="btn-hero">
          Upload your resume
          <span class="btn-hero-arrow">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 5h8M5 1l4 4-4 4"/>
            </svg>
          </span>
        </a>
        <span class="hero-note">Free · No credit card</span>
      </div>
    </div>

    <!-- floating match cards -->
    <div class="hero-floaters">
      <div class="floater-card">
        <div class="floater-top">
          <span class="floater-company">TechCorp</span>
          <span class="score-pill score-high">92 / 100</span>
        </div>
        <div class="floater-title">Senior Frontend Engineer</div>
        <div class="floater-tags">
          <span class="tag">React</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Remote</span>
        </div>
        <div class="floater-bar">
          <div class="floater-bar-fill" style="--target-w:92%; background: var(--accent);"></div>
        </div>
      </div>

      <div class="floater-card">
        <div class="floater-top">
          <span class="floater-company">StartupXYZ</span>
          <span class="score-pill score-high">78 / 100</span>
        </div>
        <div class="floater-title">Full Stack Developer</div>
        <div class="floater-tags">
          <span class="tag">Node.js</span>
          <span class="tag">MySQL</span>
        </div>
        <div class="floater-bar">
          <div class="floater-bar-fill" style="--target-w:78%; background: #4a9e6b;"></div>
        </div>
      </div>

      <div class="floater-card">
        <div class="floater-top">
          <span class="floater-company">Agency Co</span>
          <span class="score-pill score-mid">61 / 100</span>
        </div>
        <div class="floater-title">Backend Engineer</div>
        <div class="floater-tags">
          <span class="tag">Express</span>
          <span class="tag">Docker</span>
        </div>
        <div class="floater-bar">
          <div class="floater-bar-fill" style="--target-w:61%; background: var(--accent2);"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── STATS ── -->
  <div class="stats-bar">
    <div class="stats-inner">
      <div class="stat-item">
        <span class="stat-num">768</span>
        <span class="stat-label">embedding dimensions</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">2-stage</span>
        <span class="stat-label">retrieval pipeline</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">0</span>
        <span class="stat-label">false positives shown</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-num">$0</span>
        <span class="stat-label">cost to run MVP</span>
      </div>
    </div>
  </div>

  <!-- ── HOW IT WORKS ── -->
  <section class="section" id="how">
    <div class="section-inner">
      <p class="section-label reveal">Process</p>
      <h2 class="section-title reveal">Three steps from resume to ranked matches.</h2>

      <div class="steps-grid">
        <div class="step reveal">
          <div class="step-num">01</div>
          <div class="step-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <div class="step-title">Upload your resume</div>
          <p class="step-desc">Drop in your PDF or DOCX. We extract raw text and pass it through the embedding pipeline to capture your full skill context.</p>
          <div class="step-tech">
            <span class="tech-badge">pdf-parse</span>
            <span class="tech-badge">mammoth</span>
          </div>
        </div>

        <div class="step reveal">
          <div class="step-num">02</div>
          <div class="step-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div class="step-title">Semantic retrieval</div>
          <p class="step-desc">Stage one: cosine similarity across all job embeddings retrieves the top 10 candidates. Fast, cheap, and filters hundreds of jobs instantly.</p>
          <div class="step-tech">
            <span class="tech-badge">text-embedding-004</span>
            <span class="tech-badge">cosine similarity</span>
          </div>
        </div>

        <div class="step reveal">
          <div class="step-num">03</div>
          <div class="step-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
          </div>
          <div class="step-title">LLM verification</div>
          <p class="step-desc">Stage two: Groq reads your resume and each candidate job together and returns a verified 0–100 score. Only 50+ scores surface to you.</p>
          <div class="step-tech">
            <span class="tech-badge">Groq LLM</span>
            <span class="tech-badge">cross-encoder</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── PIPELINE DIAGRAM ── -->
  <section class="pipeline-section" id="tech">
    <div class="pipeline-inner">
      <p class="section-label reveal">Architecture</p>
      <h2 class="section-title reveal">The full RAG pipeline, visualized.</h2>

      <div class="pipeline-flow reveal">
        <div class="pipe-node highlight">
          <span class="pipe-node-icon">📄</span>
          <div class="pipe-node-title">Resume</div>
          <div class="pipe-node-sub">PDF / DOCX</div>
        </div>
        <div class="pipe-arrow">→</div>
        <div class="pipe-node">
          <span class="pipe-node-icon">✂️</span>
          <div class="pipe-node-title">Text Extract</div>
          <div class="pipe-node-sub">pdf-parse / mammoth</div>
        </div>
        <div class="pipe-arrow">→</div>
        <div class="pipe-node">
          <span class="pipe-node-icon">🧠</span>
          <div class="pipe-node-title">Embed</div>
          <div class="pipe-node-sub">768-dim vector</div>
        </div>
        <div class="pipe-arrow">→</div>
        <div class="pipe-node">
          <span class="pipe-node-icon">🗄️</span>
          <div class="pipe-node-title">MySQL Search</div>
          <div class="pipe-node-sub">top 10 by cosine</div>
        </div>
        <div class="pipe-arrow">→</div>
        <div class="pipe-node">
          <span class="pipe-node-icon">⚡</span>
          <div class="pipe-node-title">Groq Rerank</div>
          <div class="pipe-node-sub">0–100 score</div>
        </div>
        <div class="pipe-arrow">→</div>
        <div class="pipe-node">
          <span class="pipe-node-icon">🔍</span>
          <div class="pipe-node-title">Filter 50+</div>
          <div class="pipe-node-sub">kill false positives</div>
        </div>
        <div class="pipe-arrow">→</div>
        <div class="pipe-node highlight">
          <span class="pipe-node-icon">✅</span>
          <div class="pipe-node-title">Results</div>
          <div class="pipe-node-sub">ranked + explained</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── FEATURES ── -->
  <section class="section" id="features">
    <div class="section-inner">
      <p class="section-label reveal">Why SkillSync</p>
      <h2 class="section-title reveal">Built to actually understand your experience.</h2>

      <div class="features-grid">
        <div class="feature-card accent-card reveal">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="feature-title">No false positives</div>
          <p class="feature-desc">Content writers won't see React roles. A two-stage LLM reranker verifies every match before it reaches you — no more "87% match" on jobs you're completely wrong for.</p>
        </div>

        <div class="feature-card reveal">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="feature-title">Explained matches</div>
          <p class="feature-desc">Every result comes with a 2-sentence explanation of why the job fits your profile. Not just a score — an insight you can act on.</p>
        </div>

        <div class="feature-card reveal">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
          </div>
          <div class="feature-title">Semantic understanding</div>
          <p class="feature-desc">Keyword filters miss "Node.js developer" matching "backend engineer." Our embedding model understands meaning, not just words.</p>
        </div>

        <div class="feature-card reveal">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div class="feature-title">Free tier, forever</div>
          <p class="feature-desc">Built entirely on free APIs — Gemini embeddings, Groq LLM, MySQL on Railway. Zero infrastructure cost at MVP scale.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ── CTA ── -->
  <section class="cta-section">
    <div class="cta-inner">
      <h2 class="cta-title reveal">Ready to find your <em>real</em> match?</h2>
      <p class="cta-sub reveal">Drop your resume and let the pipeline do the work. Takes under 30 seconds.</p>

      <div class="upload-zone reveal" onclick="window.location='/register'">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16,16 12,12 8,16"/><line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <div class="upload-text">Drop your resume here</div>
        <div class="upload-hint">PDF or DOCX · Max 5MB · Free analysis</div>
      </div>

      <div class="reveal">
        <a href="/register" class="btn-hero" style="display:inline-flex;">
          Or create an account
          <span class="btn-hero-arrow">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 5h8M5 1l4 4-4 4"/>
            </svg>
          </span>
        </a>
      </div>
    </div>
  </section>

  <!-- ── FOOTER ── -->
  <footer>
    <div class="footer-inner">
      <div class="footer-left">
        Built by <span>SkillSync AI</span> · RAG + Reranking architecture
      </div>
      <div class="footer-stack">
        <span class="stack-badge">Node.js</span>
        <span class="stack-badge">Prisma</span>
        <span class="stack-badge">Gemini</span>
        <span class="stack-badge">Groq</span>
        <span class="stack-badge">Vercel</span>
      </div>
    </div>
  </footer>

  <script>
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger siblings
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  </script>
</body>
</html>