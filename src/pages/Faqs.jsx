// src/pages/Faqs.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineQuestionMarkCircle } from "react-icons/hi";

export default function Faqs() {
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();
  const { data, loading, refetch } = useApi("/faqs");

  const handleDelete = async () => {
    try { await mutate("delete", `/faqs/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  const columns = [
    { key: "question", label: "Question", render: (row) => <span style={{ fontWeight: 600 }}>{row.question}</span> },
    { key: "category", label: "Category", render: (row) => row.category ? <span className="badge badge-blue">{row.category}</span> : "—" },
    { key: "sort_order", label: "Order" },
    {
      key: "actions", label: "Actions", style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => navigate(`/faqs/${row.id}/edit`)}><HiPencil /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header"><h2>FAQs</h2><Link to="/faqs/new" className="btn btn-primary"><HiPlus /> Add FAQ</Link></div>
      <div className="card"><DataTable columns={columns} data={data} loading={loading} emptyMessage="No FAQs" emptyIcon={HiOutlineQuestionMarkCircle} /></div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete FAQ?" />
    </div>
  );
}