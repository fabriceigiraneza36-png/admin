import React, { useState } from "react";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiTrash, HiOutlineUsers } from "react-icons/hi";

export default function Subscribers() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const { mutate, loading: deleting } = useMutation();

  const { data, loading, pagination, refetch } = useApi(
    `/subscribers?page=${page}&limit=30${filter ? `&is_active=${filter}` : ""}`
  );

  const handleDelete = async () => {
    try { await mutate("delete", `/subscribers/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  const columns = [
    { key: "email", label: "Email", render: (row) => <span style={{ fontWeight: 500 }}>{row.email}</span> },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.is_active ? "active" : "inactive"} /> },
    { key: "subscribed", label: "Subscribed", render: (row) => new Date(row.subscribed_at).toLocaleDateString() },
    {
      key: "actions", label: "", style: { width: 50 },
      render: (row) => <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Subscribers</h2>
        <select className="filter-select" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Unsubscribed</option>
        </select>
      </div>
      <div className="card">
        <DataTable columns={columns} data={data} loading={loading} emptyMessage="No subscribers" emptyIcon={HiOutlineUsers} />
        {pagination && <div style={{ padding: "0 24px" }}><Pagination pagination={pagination} onPageChange={setPage} /></div>}
      </div>
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Subscriber?" />
    </div>
  );
}