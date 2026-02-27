// src/pages/PageForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import RichTextEditor from "../components/RichTextEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

export default function PageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title: "", content: "", meta_title: "", meta_description: "", is_published: true });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get("/pages").then((res) => {
        const page = (res.data.data || []).find((p) => p.id === parseInt(id));
        if (page) setForm(page);
      }).finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title required");
    try {
      setLoading(true);
      if (isEdit) { await API.put(`/pages/${id}`, form); toast.success("Updated!"); }
      else { await API.post("/pages", form); toast.success("Created!"); }
      navigate("/pages");
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
    finally { setLoading(false); }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/pages")}><HiArrowLeft /></button>
          <h2>{isEdit ? "Edit Page" : "New Page"}</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" name="title" value={form.title} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Content</label><RichTextEditor value={form.content} onChange={(v) => setForm((p) => ({ ...p, content: v }))} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Meta Title</label><input className="form-input" name="meta_title" value={form.meta_title || ""} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Meta Description</label><input className="form-input" name="meta_description" value={form.meta_description || ""} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label className="form-checkbox"><input type="checkbox" name="is_published" checked={form.is_published !== false} onChange={handleChange} /> Published</label></div>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}><HiCheck /> {loading ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}