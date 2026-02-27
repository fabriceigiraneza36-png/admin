// src/pages/Pages.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineDocument } from "react-icons/hi";

export default function Pages() {
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();
  const { data, loading, refetch } = useApi("/pages");

  const handleDelete = async () => {
    try { await mutate("delete", `/pages/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  const columns = [
    { key: "title", label: "Title", render: (row) => <span style={{ fontWeight: 600 }}>{row.title}</span> },
    { key: "slug", label: "Slug", render: (row) => <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--gray-500)" }}>/{row.slug}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.is_published ? "published" : "draft"} /> },
    { key: "updated", label: "Updated", render: (row) => new Date(row.updated_at).toLocaleDateString() },
    {
      key: "actions", label: "Actions", style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => navigate(`/pages/${row.id}/edit`)}><HiPencil /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header"><h2>Pages</h2><Link to="/pages/new" className="btn btn-primary"><HiPlus /> New Page</Link></div>
      <div className="card"><DataTable columns={columns} data={data} loading={loading} emptyMessage="No pages" emptyIcon={HiOutlineDocument} /></div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Page?" />
    </div>
  );
}