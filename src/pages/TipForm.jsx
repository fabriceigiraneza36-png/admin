import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

export default function TipForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ title: "", content: "", category: "", icon: "", sort_order: 0 });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/tips/${id}`).then((res) => setForm(res.data.data)).catch(() => toast.error("Failed")).finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title required");
    try {
      setLoading(true);
      if (isEdit) { await API.put(`/tips/${id}`, form); toast.success("Updated!"); }
      else { await API.post("/tips", form); toast.success("Created!"); }
      navigate("/tips");
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
    finally { setLoading(false); }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/tips")}><HiArrowLeft /></button>
          <h2>{isEdit ? "Edit Tip" : "New Tip"}</h2>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" name="title" value={form.title} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Content</label><textarea className="form-textarea" name="content" value={form.content || ""} onChange={handleChange} rows={5} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Category</label><input className="form-input" name="category" value={form.category || ""} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Icon</label><input className="form-input" name="icon" value={form.icon || ""} onChange={handleChange} /></div>
            </div>
            <div className="form-group"><label className="form-label">Sort Order</label><input className="form-input" name="sort_order" type="number" value={form.sort_order || 0} onChange={handleChange} /></div>
            <button className="btn btn-primary" type="submit" disabled={loading}><HiCheck /> {loading ? "Saving..." : "Save"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}