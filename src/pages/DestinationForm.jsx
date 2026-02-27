import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import ImageUpload from "../components/ImageUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

const initialState = {
  country_id: "", name: "", description: "", short_description: "",
  category: "", latitude: "", longitude: "", rating: "",
  duration: "", difficulty: "", highlights: "", best_season: "", is_featured: false,
};

export default function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    API.get("/countries?limit=100").then((res) => setCountries(res.data.data || []));
    if (isEdit) {
      API.get(`/destinations/${id}`)
        .then((res) => {
          const d = res.data.data;
          setForm({
            ...d,
            highlights: Array.isArray(d.highlights) ? d.highlights.join(", ") : d.highlights || "",
          });
          setImage(d.image_url);
        })
        .catch(() => toast.error("Failed to load"))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.country_id) return toast.error("Name and country required");

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") {
          if (k === "highlights" && typeof v === "string") {
            formData.append(k, JSON.stringify(v.split(",").map((s) => s.trim()).filter(Boolean)));
          } else {
            formData.append(k, v);
          }
        }
      });
      if (image instanceof File) formData.append("image", image);

      if (isEdit) {
        await API.put(`/destinations/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Destination updated!");
      } else {
        await API.post("/destinations", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Destination created!");
      }
      navigate("/destinations");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/destinations")}><HiArrowLeft /></button>
          <h2>{isEdit ? "Edit Destination" : "New Destination"}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div className="card">
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <select className="form-select" name="country_id" value={form.country_id} onChange={handleChange}>
                    <option value="">Select Country</option>
                    {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input className="form-input" name="short_description" value={form.short_description || ""} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="description" value={form.description || ""} onChange={handleChange} rows={6} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category || ""} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Cultural</option><option>Nature</option><option>Adventure</option>
                    <option>Wildlife</option><option>Beach</option><option>Urban</option><option>Historical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" name="difficulty" value={form.difficulty || ""} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Easy</option><option>Moderate</option><option>Challenging</option><option>Extreme</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input className="form-input" name="latitude" type="number" step="any" value={form.latitude || ""} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input className="form-input" name="longitude" type="number" step="any" value={form.longitude || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input className="form-input" name="duration" value={form.duration || ""} onChange={handleChange} placeholder="e.g. 3-5 days" />
                </div>
                <div className="form-group">
                  <label className="form-label">Best Season</label>
                  <input className="form-input" name="best_season" value={form.best_season || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Highlights (comma separated)</label>
                <input className="form-input" name="highlights" value={form.highlights || ""} onChange={handleChange} placeholder="Hiking, Wildlife, Photography" />
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
                  <label className="form-label">Rating (0-5)</label>
                  <input className="form-input" name="rating" type="number" step="0.01" min="0" max="5" value={form.rating || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" name="is_featured" checked={form.is_featured || false} onChange={handleChange} />
                    Featured Destination
                  </label>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: "100%" }}>
              <HiCheck /> {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}