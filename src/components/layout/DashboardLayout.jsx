import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { logout as apiLogout } from "../../api/auth.api";
import "../../styles/dashboard.css";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth } = useAuthStore();
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser || JSON.parse(localStorage.getItem("user") || "{}");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const name = user.name || "User";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  async function handleLogout() {
    await apiLogout().catch(() => {});
    localStorage.clear();
    clearAuth();
    navigate("/login");
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  const currentPath = location.pathname.replace("/dashboard", "") || "/";

  const navItems = [
    { label: "Main", items: [
      { key: "/", icon: "home", text: "Home" },
      { key: "/upload", icon: "upload", text: "Upload Resume" },
      { key: "/matches", icon: "star", text: "My Matches" },
      { key: "/jobs", icon: "briefcase", text: "Explore Jobs" },
      { key: "/applications", icon: "clipboard", text: "Applications" },
    ]},
    { label: "Account", items: [
      { key: "/profile", icon: "user", text: "Profile" },
    ]},
  ];

  const pageTitles = {
    "/": "Home",
    "/upload": "Upload Resume",
    "/matches": "My Matches",
    "/jobs": "Explore Jobs",
    "/applications": "My Applications",
    "/profile": "Profile",
  };

  const topbarTitle = pageTitles[currentPath] || "Dashboard";

  const icons = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></>,
    upload: <><polyline points="16,16 12,12 8,16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></>,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  };

  return (
    <div className="dashboard">
      <div className="toast-container" id="toastContainer"></div>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>
      <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={closeSidebar}></div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="logo-text">SkillSync AI</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.label}>
              <span className="nav-section-label" style={section.label === "Account" ? { marginTop: "12px" } : {}}>{section.label}</span>
              {section.items.map((item) => (
                <button
                  key={item.key}
                  className={`nav-item ${currentPath === item.key ? "active" : ""}`}
                  onClick={() => { navigate(`/dashboard${item.key === "/" ? "" : item.key}`); closeSidebar(); }}
                >
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icons[item.icon]}
                  </svg>
                  {item.text}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user.profileImage ? <img src={user.profileImage} alt="" /> : initials}
          </div>
          <div className="user-info">
            <div className="user-name">{name}</div>
            <div className="user-role">Job Seeker</div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="dash-main">
        <header className="topbar">
          <span className="topbar-title">{topbarTitle}</span>
          <div className="topbar-right">
            <span className="topbar-greeting">{greeting} {"\uD83D\uDC4B"}</span>
          </div>
        </header>

        <div className="dash-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
