// src/pages/Team.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineUserGroup } from "react-icons/hi";

export default function Team() {
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();
  const { data, loading, refetch } = useApi("/team");

  const handleDelete = async () => {
    try { await mutate("delete", `/team/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  const columns = [
    {
      key: "image", label: "", style: { width: 50 },
      render: (row) => <div className="user-avatar" style={{ width: 40, height: 40 }}>{row.name?.charAt(0)}</div>,
    },
    { key: "name", label: "Name", render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
    { key: "role", label: "Role" },
    { key: "email", label: "Email" },
    { key: "sort_order", label: "Order" },
    {
      key: "actions", label: "Actions", style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => navigate(`/team/${row.id}/edit`)}><HiPencil /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header"><h2>Team Members</h2><Link to="/team/new" className="btn btn-primary"><HiPlus /> Add Member</Link></div>
      <div className="card"><DataTable columns={columns} data={data} loading={loading} emptyMessage="No team members" emptyIcon={HiOutlineUserGroup} /></div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Member?" />
    </div>
  );
}