import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import ImageUpload from "../components/ImageUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

const initialState = {
  name: "", description: "", short_description: "", continent: "",
  capital: "", currency: "", language: "", timezone: "",
  best_time_to_visit: "", visa_info: "", latitude: "", longitude: "",
  is_featured: false,
};

export default function CountryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/countries/${id}`)
        .then((res) => {
          setForm(res.data.data);
          setImage(res.data.data.image_url);
        })
        .catch(() => toast.error("Failed to load country"))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Name is required");

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") formData.append(k, v);
      });
      if (image instanceof File) formData.append("image", image);

      if (isEdit) {
        await API.put(`/countries/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Country updated!");
      } else {
        await API.post("/countries", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Country created!");
      }
      navigate("/countries");
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
          <button className="btn btn-ghost" onClick={() => navigate("/countries")}>
            <HiArrowLeft />
          </button>
          <h2>{isEdit ? "Edit Country" : "New Country"}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Country name" />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input className="form-input" name="short_description" value={form.short_description || ""} onChange={handleChange} placeholder="Brief tagline" />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="description" value={form.description || ""} onChange={handleChange} rows={5} placeholder="Full description" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Continent</label>
                  <select className="form-select" name="continent" value={form.continent || ""} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Africa</option><option>Asia</option><option>Europe</option>
                    <option>North America</option><option>South America</option><option>Oceania</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capital</label>
                  <input className="form-input" name="capital" value={form.capital || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <input className="form-input" name="currency" value={form.currency || ""} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <input className="form-input" name="language" value={form.language || ""} onChange={handleChange} />
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

              <div className="form-group">
                <label className="form-label">Best Time to Visit</label>
                <input className="form-input" name="best_time_to_visit" value={form.best_time_to_visit || ""} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Visa Info</label>
                <textarea className="form-textarea" name="visa_info" value={form.visa_info || ""} onChange={handleChange} rows={3} />
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <ImageUpload
                    value={image}
                    onChange={setImage}
                    onRemove={() => setImage(null)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" name="is_featured" checked={form.is_featured || false} onChange={handleChange} />
                    Featured Country
                  </label>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: "100%" }}>
              <HiCheck />
              {loading ? "Saving..." : isEdit ? "Update Country" : "Create Country"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}