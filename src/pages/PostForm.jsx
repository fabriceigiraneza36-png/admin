import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import ImageUpload from "../components/ImageUpload";
import RichTextEditor from "../components/RichTextEditor";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck } from "react-icons/hi";

const initial = {
  title: "", content: "", excerpt: "", author_name: "", category: "",
  tags: "", is_published: false, is_featured: false, meta_title: "", meta_description: "",
};

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initial);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      API.get(`/posts/${id}`).then((res) => {
        // Since we fetch by id but our API uses slug, we need the admin endpoint
        // For now let's handle by getting all posts and finding by id
      }).catch(() => {});

      // Workaround: get all posts and find by id
      API.get("/posts?limit=100").then((res) => {
        const post = (res.data.data || []).find((p) => p.id === parseInt(id));
        if (post) {
          setForm({
            ...post,
            tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "",
          });
          setImage(post.image_url);
        }
      }).finally(() => setFetching(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title is required");

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") {
          if (k === "tags" && typeof v === "string") {
            formData.append(k, JSON.stringify(v.split(",").map((s) => s.trim()).filter(Boolean)));
          } else {
            formData.append(k, v);
          }
        }
      });
      if (image instanceof File) formData.append("image", image);

      if (isEdit) {
        await API.put(`/posts/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Post updated!");
      } else {
        await API.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Post created!");
      }
      navigate("/posts");
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
          <button className="btn btn-ghost" onClick={() => navigate("/posts")}><HiArrowLeft /></button>
          <h2>{isEdit ? "Edit Post" : "New Post"}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" name="title" value={form.title} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Excerpt</label>
                  <textarea className="form-textarea" name="excerpt" value={form.excerpt || ""} onChange={handleChange} rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <RichTextEditor value={form.content} onChange={(v) => setForm((p) => ({ ...p, content: v }))} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>SEO</h3>
                <div className="form-group">
                  <label className="form-label">Meta Title</label>
                  <input className="form-input" name="meta_title" value={form.meta_title || ""} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Meta Description</label>
                  <textarea className="form-textarea" name="meta_description" value={form.meta_description || ""} onChange={handleChange} rows={2} />
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
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input className="form-input" name="category" value={form.category || ""} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author</label>
                    <input className="form-input" name="author_name" value={form.author_name || ""} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-input" name="tags" value={form.tags || ""} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" name="is_published" checked={form.is_published || false} onChange={handleChange} />
                    Published
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-checkbox">
                    <input type="checkbox" name="is_featured" checked={form.is_featured || false} onChange={handleChange} />
                    Featured
                  </label>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: "100%" }}>
              <HiCheck /> {loading ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}