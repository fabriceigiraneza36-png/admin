// src/pages/VirtualTours.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineVideoCamera, HiEye } from "react-icons/hi";

export default function VirtualTours() {
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();
  const { data, loading, error, refetch } = useApi("/virtual-tours");

  const handleDelete = async () => {
    try {
      await mutate("delete", `/virtual-tours/${deleteId}`);
      toast.success("Deleted");
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete");
    }
  };

  const columns = [
    { 
      key: "title", 
      label: "Title", 
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.title || "Untitled"}</span>
      )
    },
    { 
      key: "destination", 
      label: "Destination", 
      render: (row) => row.destination_name || "—" 
    },
    { 
      key: "duration", 
      label: "Duration",
      render: (row) => row.duration || "—"
    },
    { 
      key: "views", 
      label: "Views", 
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <HiEye style={{ fontSize: 14, color: "var(--gray-400)" }} /> 
          {row.view_count || 0}
        </div>
      )
    },
    { 
      key: "featured", 
      label: "Featured", 
      render: (row) => (
        <StatusBadge status={row.is_featured ? "active" : "inactive"} />
      )
    },
    {
      key: "actions", 
      label: "Actions", 
      style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button 
            className="table-action-btn edit" 
            onClick={() => navigate(`/virtual-tours/${row.id}/edit`)}
          >
            <HiPencil />
          </button>
          <button 
            className="table-action-btn delete" 
            onClick={() => setDeleteId(row.id)}
          >
            <HiTrash />
          </button>
        </div>
      ),
    },
  ];

  // Handle error state
  if (error) {
    return (
      <div>
        <div className="page-header">
          <h2>Virtual Tours</h2>
          <Link to="/virtual-tours/new" className="btn btn-primary">
            <HiPlus /> Add Tour
          </Link>
        </div>
        <div className="card">
          <div className="card-body">
            <div style={{ textAlign: "center", padding: 40, color: "var(--gray-500)" }}>
              <p>Failed to load virtual tours: {error}</p>
              <button className="btn btn-secondary" onClick={() => refetch()}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Virtual Tours</h2>
        <Link to="/virtual-tours/new" className="btn btn-primary">
          <HiPlus /> Add Tour
        </Link>
      </div>
      <div className="card">
        <DataTable 
          columns={columns} 
          data={data || []}
          loading={loading} 
          emptyMessage="No virtual tours" 
          emptyIcon={HiOutlineVideoCamera} 
        />
      </div>
      <ConfirmDialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        loading={deleting} 
        title="Delete Tour?" 
      />
    </div>
  );
}