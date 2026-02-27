import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineNewspaper, HiEye } from "react-icons/hi";

export default function Posts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();

  const { data, loading, pagination, refetch } = useApi(
    `/posts?page=${page}&limit=10&search=${search}`
  );

  const handleDelete = async () => {
    try {
      await mutate("delete", `/posts/${deleteId}`);
      toast.success("Post deleted");
      setDeleteId(null);
      refetch();
    } catch { toast.error("Failed to delete"); }
  };

  const columns = [
    {
      key: "image", label: "", style: { width: 60 },
      render: (row) => <img src={row.image_url || ""} alt="" className="table-image" onError={(e) => { e.target.style.display = "none"; }} />,
    },
    {
      key: "title", label: "Title",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.title}</div>
          <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{row.category || "Uncategorized"}</div>
        </div>
      ),
    },
    { key: "author_name", label: "Author" },
    {
      key: "status", label: "Status",
      render: (row) => <StatusBadge status={row.is_published ? "published" : "draft"} />,
    },
    {
      key: "views", label: "Views",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--gray-500)" }}>
          <HiEye style={{ fontSize: 14 }} /> {row.view_count || 0}
        </div>
      ),
    },
    {
      key: "read_time", label: "Read",
      render: (row) => <span>{row.read_time || 0} min</span>,
    },
    {
      key: "actions", label: "Actions", style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => navigate(`/posts/${row.id}/edit`)}><HiPencil /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Blog Posts</h2>
        <Link to="/posts/new" className="btn btn-primary"><HiPlus /> New Post</Link>
      </div>
      <div className="card">
        <div className="card-header">
          <SearchBar onSearch={setSearch} placeholder="Search posts..." />
        </div>
        <DataTable columns={columns} data={data} loading={loading} emptyMessage="No posts yet" emptyIcon={HiOutlineNewspaper} />
        {pagination && <div style={{ padding: "0 24px" }}><Pagination pagination={pagination} onPageChange={setPage} /></div>}
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Post?" />
    </div>
  );
}