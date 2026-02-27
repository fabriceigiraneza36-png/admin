import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";
import { HiCheck, HiLockClosed } from "react-icons/hi";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ full_name: user?.full_name || "" });
  const [passwords, setPasswords] = useState({ current_password: "", new_password: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await API.put("/admin/auth/me", profile);
      updateUser(res.data.user);
      toast.success("Profile updated");
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm) return toast.error("Passwords don't match");
    if (passwords.new_password.length < 6) return toast.error("Min 6 characters");
    try {
      setChangingPw(true);
      await API.put("/admin/auth/change-password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      toast.success("Password changed");
      setPasswords({ current_password: "", new_password: "", confirm: "" });
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
    finally { setChangingPw(false); }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><h3>Profile</h3></div>
        <div className="card-body">
          <form onSubmit={handleProfile}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" value={user?.username || ""} disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user?.email || ""} disabled style={{ opacity: 0.6 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              <HiCheck /> {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Change Password</h3></div>
        <div className="card-body">
          <form onSubmit={handlePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={changingPw}>
              <HiLockClosed /> {changingPw ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
