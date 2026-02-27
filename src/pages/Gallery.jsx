import React, { useState, useRef } from "react";
import { useApi, useMutation } from "../hooks/useApi";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import API from "../api/axios";
import { HiPlus, HiTrash, HiOutlinePhotograph } from "react-icons/hi";

export default function Gallery() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { mutate, loading: deleting } = useMutation();

  const { data, loading, pagination, refetch } = useApi(`/gallery?page=${page}&limit=24&category=${category}`);
  const { data: categories } = useApi("/gallery/categories");

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    try {
      setUploading(true);
      const formData = new FormData();
      for (const f of files) formData.append("images", f);
      if (category) formData.append("category", category);
      await API.post("/gallery/bulk", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`${files.length} image(s) uploaded`);
      refetch();
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleDelete = async () => {
    try { await mutate("delete", `/gallery/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Gallery</h2>
        <div className="page-header-actions">
          <select className="filter-select" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories?.map((c) => <option key={c.category} value={c.category}>{c.category} ({c.count})</option>)}
          </select>
          <input type="file" ref={fileRef} multiple accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <HiPlus /> {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : !data?.length ? (
        <div className="card"><div className="card-body"><EmptyState message="No images yet" icon={HiOutlinePhotograph} /></div></div>
      ) : (
        <>
          <div className="gallery-grid">
            {data.map((img) => (
              <div key={img.id} className="gallery-item">
                <img src={img.image_url} alt={img.title || ""} onError={(e) => { e.target.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect fill='%23e2e8f0' width='200' height='200'/></svg>"; }} />
                <div className="gallery-item-overlay">
                  <span style={{ color: "white", fontSize: 13 }}>{img.title || img.category || ""}</span>
                </div>
                <div className="gallery-item-actions">
                  <button className="table-action-btn delete" style={{ background: "rgba(0,0,0,0.6)", color: "white" }} onClick={() => setDeleteId(img.id)}><HiTrash /></button>
                </div>
              </div>
            ))}
          </div>
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </>
      )}

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Image?" />
    </div>
  );
}