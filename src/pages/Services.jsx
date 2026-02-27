// src/pages/Services.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineBriefcase } from "react-icons/hi";

export default function Services() {
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();
  const { data, loading, refetch } = useApi("/services");

  const handleDelete = async () => {
    try { await mutate("delete", `/services/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  const columns = [
    { key: "title", label: "Service", render: (row) => <span style={{ fontWeight: 600 }}>{row.title}</span> },
    { key: "price", label: "Price", render: (row) => row.price ? `$${row.price}/${row.price_unit}` : "Custom" },
    { key: "is_featured", label: "Featured", render: (row) => <StatusBadge status={row.is_featured ? "active" : "inactive"} /> },
    { key: "sort_order", label: "Order" },
    {
      key: "actions", label: "Actions", style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => navigate(`/services/${row.id}/edit`)}><HiPencil /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header"><h2>Services</h2><Link to="/services/new" className="btn btn-primary"><HiPlus /> Add Service</Link></div>
      <div className="card"><DataTable columns={columns} data={data} loading={loading} emptyMessage="No services" emptyIcon={HiOutlineBriefcase} /></div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Service?" />
    </div>
  );
}