import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineLightBulb } from "react-icons/hi";

export default function Tips() {
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();
  const { data, loading, refetch } = useApi("/tips");

  const handleDelete = async () => {
    try { await mutate("delete", `/tips/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  const columns = [
    { key: "title", label: "Title", render: (row) => <span style={{ fontWeight: 600 }}>{row.title}</span> },
    { key: "category", label: "Category", render: (row) => row.category ? <span className="badge badge-blue">{row.category}</span> : "—" },
    { key: "sort_order", label: "Order" },
    {
      key: "actions", label: "Actions", style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => navigate(`/tips/${row.id}/edit`)}><HiPencil /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Travel Tips</h2>
        <Link to="/tips/new" className="btn btn-primary"><HiPlus /> Add Tip</Link>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} loading={loading} emptyMessage="No tips" emptyIcon={HiOutlineLightBulb} />
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Tip?" />
    </div>
  );
}