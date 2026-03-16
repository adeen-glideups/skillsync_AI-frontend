import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { updateProfile, updatePassword, getProfile, logout as apiLogout } from "../../api/auth.api";

export default function DashProfilePage() {
  const navigate = useNavigate();
  const { clearAuth, setUser } = useAuthStore();
  const user = useAuthStore((s) => s.user) || JSON.parse(localStorage.getItem("user") || "{}");
  const name = user.name || "User";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const [editName, setEditName] = useState(name);
  const [editGender, setEditGender] = useState(user.gender || "other");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const photoInputRef = useRef(null);

  function toast(msg, type = "default") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  async function refreshProfile() {
    try {
      const { data } = await getProfile();
      const fresh = data?.data || data;
      setUser(fresh);
      setEditName(fresh.name || "");
      setEditGender(fresh.gender || "other");
    } catch { /* silent — user still sees stale data */ }
  }

  async function handleLogout() {
    apiLogout().catch(() => {});
    localStorage.clear();
    clearAuth();
    navigate("/login");
  }

  async function saveProfile() {
    if (!editName.trim()) { toast("Name cannot be empty", "error"); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("gender", editGender);
      await updateProfile(formData);
      await refreshProfile();
      toast("Profile updated!", "success");
    } catch (err) {
      toast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (!oldPw || newPw.length < 8) { toast("Check password fields", "error"); return; }
    setChangingPw(true);
    try {
      const { data } = await updatePassword({ oldPassword: oldPw, newPassword: newPw });
      if (data.success || data.data) {
        toast("Password updated! Please log in again.", "success");
        setTimeout(() => handleLogout(), 1500);
      }
    } catch (err) {
      toast(err.response?.data?.message || err.message, "error");
    } finally {
      setChangingPw(false);
    }
  }

  async function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("name", editName);
      formData.append("gender", editGender);
      await updateProfile(formData);
      await refreshProfile();
      toast("Profile photo updated!", "success");
    } catch (err) {
      toast(err.message || "Failed to update photo", "error");
    }
  }

  return (
    <div className="profile-grid">
      <div>
        <div className="profile-card" style={{ marginBottom: 16 }}>
          <div className="profile-avatar-large" onClick={() => photoInputRef.current?.click()} style={{ cursor: "pointer" }}>
            {user.profileImage ? (
              <img src={user.profileImage} alt="" />
            ) : (
              <span>{initials}</span>
            )}
            <div className="profile-avatar-overlay">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
          <input type="file" ref={photoInputRef} accept="image/*" style={{ display: "none" }} onChange={handlePhotoSelect} />

          <div className="profile-name">{name}</div>
          <div className="profile-email">{user.email || ""}</div>
          {user.isEmailVerified && (
            <div className="profile-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12" /></svg>
              Email Verified
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="danger-zone">
          <div className="danger-text">
            <h4>Sign out</h4>
            <p>Log out of your account</p>
          </div>
          <button className="btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Edit profile */}
        <div className="profile-form">
          <h3>Edit Profile</h3>
          <div className="form-row">
            <div className="dash-input-group">
              <label className="dash-input-label">Full name</label>
              <div className="dash-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input className="dash-input" placeholder="Your name" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
            </div>
            <div className="dash-input-group">
              <label className="dash-input-label">Gender</label>
              <select className="dash-select" value={editGender} onChange={(e) => setEditGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <button className="dash-btn dash-btn-dark" onClick={saveProfile} disabled={saving}>
            {saving ? <span className="spinner"></span> : "Save changes"}
          </button>
        </div>

        {/* Change password */}
        <div className="profile-form">
          <h3>Change Password</h3>
          <div className="dash-input-group">
            <label className="dash-input-label">Current password</label>
            <div className="dash-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <input className="dash-input" type="password" placeholder="Current password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
            </div>
          </div>
          <div className="dash-input-group">
            <label className="dash-input-label">New password</label>
            <div className="dash-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <input className="dash-input" type="password" placeholder="Min. 8 characters" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            </div>
          </div>
          <button className="dash-btn dash-btn-ghost" onClick={changePassword} disabled={changingPw}>
            {changingPw ? <span className="spinner dark"></span> : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}
