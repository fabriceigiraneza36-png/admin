import React, { useState } from "react";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import API from "../api/axios";
import { HiEye, HiTrash, HiOutlineMail } from "react-icons/hi";

export default function ContactMessages() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { mutate, loading: deleting } = useMutation();

  const { data, loading, pagination, refetch } = useApi(
    `/contact?page=${page}&limit=15${filter ? `&is_read=${filter}` : ""}`
  );

  const handleView = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await API.patch(`/contact/${msg.id}/read`).catch(() => {});
      refetch();
    }
  };

  const handleDelete = async () => {
    try { await mutate("delete", `/contact/${deleteId}`); toast.success("Deleted"); setDeleteId(null); refetch(); }
    catch { toast.error("Failed"); }
  };

  const columns = [
    {
      key: "name", label: "From",
      render: (row) => (
        <div>
          <div style={{ fontWeight: row.is_read ? 400 : 700, color: row.is_read ? "var(--gray-600)" : "var(--gray-900)" }}>{row.full_name}</div>
          <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{row.email}</div>
        </div>
      ),
    },
    { key: "subject", label: "Subject", render: (row) => row.subject || "No subject" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.is_read ? "read" : "pending"} /> },
    { key: "date", label: "Date", render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      key: "actions", label: "", style: { width: 80 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => handleView(row)}><HiEye /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header"><h2>Messages</h2></div>
      <div className="card">
        <div className="card-header">
          <SearchBar onSearch={() => {}} placeholder="Filter messages..." />
          <select className="filter-select" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>
        <DataTable columns={columns} data={data} loading={loading} emptyMessage="No messages" emptyIcon={HiOutlineMail} />
        {pagination && <div style={{ padding: "0 24px" }}><Pagination pagination={pagination} onPageChange={setPage} /></div>}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message Details" size="md">
        {selected && (
          <div>
            <div className="detail-grid">
              <div className="detail-item"><label>From</label><span>{selected.full_name}</span></div>
              <div className="detail-item"><label>Email</label><span>{selected.email}</span></div>
              <div className="detail-item"><label>Phone</label><span>{selected.phone || "—"}</span></div>
              <div className="detail-item"><label>Date</label><span>{new Date(selected.created_at).toLocaleString()}</span></div>
            </div>
            <div className="detail-item" style={{ marginTop: 16 }}>
              <label>Subject</label><span>{selected.subject || "No subject"}</span>
            </div>
            <div style={{ marginTop: 16, padding: 16, background: "var(--gray-50)", borderRadius: "var(--radius-sm)", fontSize: 14, lineHeight: 1.7 }}>
              {selected.message}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Message?" />
    </div>
  );
}