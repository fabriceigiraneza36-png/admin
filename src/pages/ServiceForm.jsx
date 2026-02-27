import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import ImageUpload from "../components/ImageUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ 
    title: "", description: "", short_description: "", 
    icon: "", features: "", is_featured: false, sort_order: 0 
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/services/${id}`).then((res) => {
        const s = res.data.data;
        setForm({ 
          ...s, 
          features: Array.isArray(s.features) ? s.features.join(", ") : s.features || "" 
        });
        setImage(s.image_url);
      }).catch(() => toast.error("Failed")).finally(() => setFetching(false));
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
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") {
          if (k === "features" && typeof v === "string") {
            formData.append(k, JSON.stringify(v.split(",").map((s) => s.trim()).filter(Boolean)));
          } else {
            formData.append(k, v);
          }
        }
      });
      if (image instanceof File) formData.append("image", image);

      const config = { headers: { "Content-Type": "multipart/form-data" } };
      
      if (isEdit) { 
        await API.put(`/services/${id}`, formData, config); 
        toast.success("Updated!"); 
      } else { 
        await API.post("/services", formData, config); 
        toast.success("Created!"); 
      }
      navigate("/services");
    } catch (err) { 
      toast.error(err.response?.data?.error || "Failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/services")}><HiArrowLeft /></button>
          <h2>{isEdit ? "Edit Service" : "New Service"}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input className="form-input" name="short_description" value={form.short_description || ""} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="description" value={form.description || ""} onChange={handleChange} rows={6} />
              </div>

              <div className="form-group">
                <label className="form-label">Features (comma separated)</label>
                <input className="form-input" name="features" value={form.features || ""} onChange={handleChange} placeholder="Feature 1, Feature 2, Feature 3" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Icon</label>
                  <input className="form-input" name="icon" value={form.icon || ""} onChange={handleChange} placeholder="e.g. binoculars, car, mountain" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input className="form-input" name="sort_order" type="number" value={form.sort_order || 0} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <ImageUpload value={image} onChange={setImage} onRemove={() => setImage(null)} />
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" name="is_featured" checked={form.is_featured || false} onChange={handleChange} />
                    Featured Service
                  </label>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: "100%" }}>
              <HiCheck /> {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}