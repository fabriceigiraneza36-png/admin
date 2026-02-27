// src/pages/FaqForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

export default function FaqForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ question: "", answer: "", category: "", sort_order: 0 });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      // Get all FAQs and find by ID since there's no single FAQ endpoint by ID in public
      API.get("/faqs").then((res) => {
        const faq = (res.data.data || []).find((f) => f.id === parseInt(id));
        if (faq) setForm(faq);
      }).finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question || !form.answer) return toast.error("Question and answer required");
    try {
      setLoading(true);
      if (isEdit) { await API.put(`/faqs/${id}`, form); toast.success("Updated!"); }
      else { await API.post("/faqs", form); toast.success("Created!"); }
      navigate("/faqs");
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
    finally { setLoading(false); }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/faqs")}><HiArrowLeft /></button>
          <h2>{isEdit ? "Edit FAQ" : "New FAQ"}</h2>
        </div>
      </div>
      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="form-label">Question *</label><input className="form-input" name="question" value={form.question} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label">Answer *</label><textarea className="form-textarea" name="answer" value={form.answer} onChange={handleChange} rows={5} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Category</label><input className="form-input" name="category" value={form.category || ""} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Sort Order</label><input className="form-input" name="sort_order" type="number" value={form.sort_order || 0} onChange={handleChange} /></div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}><HiCheck /> {loading ? "Saving..." : "Save"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}