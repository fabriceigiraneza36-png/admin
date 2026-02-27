// src/pages/TeamForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import ImageUpload from "../components/ImageUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

export default function TeamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: "", role: "", bio: "", email: "", phone: "", sort_order: 0 });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/team/${id}`).then((res) => { setForm(res.data.data); setImage(res.data.data.image_url); })
        .catch(() => toast.error("Failed")).finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Name required");
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== "") formData.append(k, v); });
      if (image instanceof File) formData.append("image", image);
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (isEdit) { await API.put(`/team/${id}`, formData, config); toast.success("Updated!"); }
      else { await API.post("/team", formData, config); toast.success("Created!"); }
      navigate("/team");
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
    finally { setLoading(false); }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/team")}><HiArrowLeft /></button>
          <h2>{isEdit ? "Edit Member" : "New Member"}</h2>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, maxWidth: 900 }}>
        <div className="card"><div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" name="name" value={form.name} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Role</label><input className="form-input" name="role" value={form.role || ""} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" name="bio" value={form.bio || ""} onChange={handleChange} rows={4} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" name="email" value={form.email || ""} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" name="phone" value={form.phone || ""} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label className="form-label">Sort Order</label><input className="form-input" name="sort_order" type="number" value={form.sort_order || 0} onChange={handleChange} /></div>
            <button className="btn btn-primary" type="submit" disabled={loading}><HiCheck /> {loading ? "Saving..." : "Save"}</button>
          </form>
        </div></div>
        <div className="card"><div className="card-body">
          <label className="form-label">Photo</label>
          <ImageUpload value={image} onChange={setImage} onRemove={() => setImage(null)} />
        </div></div>
      </div>
    </div>
  );
}