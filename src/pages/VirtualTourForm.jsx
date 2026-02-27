// src/pages/VirtualTourForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

export default function VirtualTourForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    destination_id: "", 
    video_url: "", 
    thumbnail_url: "", 
    panorama_url: "", 
    duration: "", 
    is_featured: false, 
    sort_order: 0 
  });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load destinations
    API.get("/destinations?limit=100")
      .then((res) => setDestinations(res.data.data || []))
      .catch((err) => console.error("Failed to load destinations:", err));
    
    // Load virtual tour if editing
    if (isEdit) {
      API.get(`/virtual-tours/${id}`)
        .then((res) => {
          if (res.data.data) {
            setForm({
              title: res.data.data.title || "",
              description: res.data.data.description || "",
              destination_id: res.data.data.destination_id || "",
              video_url: res.data.data.video_url || "",
              thumbnail_url: res.data.data.thumbnail_url || "",
              panorama_url: res.data.data.panorama_url || "",
              duration: res.data.data.duration || "",
              is_featured: res.data.data.is_featured || false,
              sort_order: res.data.data.sort_order || 0,
            });
          }
        })
        .catch((err) => {
          console.error("Failed to load virtual tour:", err);
          const errorMsg = err.response?.data?.error || "Failed to load virtual tour";
          setError(errorMsg);
          toast.error(errorMsg);
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        title: form.title.trim(),
        description: form.description?.trim() || null,
        destination_id: form.destination_id || null,
        video_url: form.video_url?.trim() || null,
        thumbnail_url: form.thumbnail_url?.trim() || null,
        panorama_url: form.panorama_url?.trim() || null,
        duration: form.duration?.trim() || null,
        is_featured: Boolean(form.is_featured),
        sort_order: parseInt(form.sort_order) || 0,
      };
      
      if (isEdit) {
        await API.put(`/virtual-tours/${id}`, payload);
        toast.success("Virtual tour updated!");
      } else {
        await API.post("/virtual-tours", payload);
        toast.success("Virtual tour created!");
      }
      
      navigate("/virtual-tours");
    } catch (err) {
      console.error("Save error:", err);
      const errorMsg = err.response?.data?.error || "Failed to save";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => navigate("/virtual-tours")}
            type="button"
          >
            <HiArrowLeft />
          </button>
          <h2>{isEdit ? "Edit Virtual Tour" : "New Virtual Tour"}</h2>
        </div>
      </div>
      
      {error && (
        <div style={{ 
          padding: "12px 16px", 
          background: "#fef2f2", 
          color: "#dc2626", 
          borderRadius: 8, 
          marginBottom: 20 
        }}>
          {error}
        </div>
      )}
      
      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input 
                className="form-input" 
                name="title" 
                value={form.title} 
                onChange={handleChange}
                placeholder="Enter tour title"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-textarea" 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                rows={4}
                placeholder="Describe the virtual tour"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Destination</label>
              <select 
                className="form-select" 
                name="destination_id" 
                value={form.destination_id} 
                onChange={handleChange}
              >
                <option value="">Select (optional)</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Video URL</label>
              <input 
                className="form-input" 
                name="video_url" 
                value={form.video_url} 
                onChange={handleChange} 
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Thumbnail URL</label>
                <input 
                  className="form-input" 
                  name="thumbnail_url" 
                  value={form.thumbnail_url} 
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input 
                  className="form-input" 
                  name="duration" 
                  value={form.duration} 
                  onChange={handleChange} 
                  placeholder="e.g. 12 min"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Panorama URL (optional)</label>
              <input 
                className="form-input" 
                name="panorama_url" 
                value={form.panorama_url} 
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input 
                  className="form-input" 
                  name="sort_order" 
                  type="number" 
                  value={form.sort_order} 
                  onChange={handleChange}
                />
              </div>
              <div className="form-group" style={{ display: "flex", alignItems: "flex-end" }}>
                <label className="form-checkbox">
                  <input 
                    type="checkbox" 
                    name="is_featured" 
                    checked={form.is_featured} 
                    onChange={handleChange}
                  />
                  Featured
                </label>
              </div>
            </div>
            
            <div style={{ marginTop: 24 }}>
              <button 
                className="btn btn-primary" 
                type="submit" 
                disabled={loading}
              >
                <HiCheck /> {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}