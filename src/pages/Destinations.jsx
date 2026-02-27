import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineMap, HiStar } from "react-icons/hi";

export default function Destinations() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();

  const { data, loading, pagination, refetch } = useApi(
    `/destinations?page=${page}&limit=10&search=${search}&category=${category}`
  );

  const { data: categories } = useApi("/destinations/categories");

  const handleDelete = async () => {
    try {
      await mutate("delete", `/destinations/${deleteId}`);
      toast.success("Destination deleted");
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    {
      key: "image", label: "", style: { width: 60 },
      render: (row) => (
        <img src={row.image_url || ""} alt="" className="table-image"
          onError={(e) => { e.target.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect fill='%23e2e8f0' width='44' height='44' rx='8'/><text x='22' y='26' text-anchor='middle' fill='%2394a3b8' font-size='16'>📍</text></svg>"; }}
        />
      ),
    },
    {
      key: "name", label: "Name",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{row.country_name}</div>
        </div>
      ),
    },
    {
      key: "category", label: "Category",
      render: (row) => row.category ? <span className="badge badge-blue">{row.category}</span> : "—",
    },
    {
      key: "rating", label: "Rating",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <HiStar style={{ color: "#eab308", fontSize: 14 }} />
          <span style={{ fontWeight: 600 }}>{row.rating || 0}</span>
        </div>
      ),
    },
    {
      key: "is_featured", label: "Featured",
      render: (row) => <StatusBadge status={row.is_featured ? "active" : "inactive"} />,
    },
    {
      key: "actions", label: "Actions", style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button className="table-action-btn edit" onClick={() => navigate(`/destinations/${row.id}/edit`)}><HiPencil /></button>
          <button className="table-action-btn delete" onClick={() => setDeleteId(row.id)}><HiTrash /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Destinations</h2>
        <Link to="/destinations/new" className="btn btn-primary"><HiPlus /> Add Destination</Link>
      </div>

      <div className="card">
        <div className="card-header">
          <SearchBar onSearch={setSearch} placeholder="Search destinations..." />
          <select className="filter-select" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories?.map((c) => <option key={c.category} value={c.category}>{c.category} ({c.count})</option>)}
          </select>
        </div>
        <DataTable columns={columns} data={data} loading={loading} emptyMessage="No destinations found" emptyIcon={HiOutlineMap} />
        {pagination && <div style={{ padding: "0 24px" }}><Pagination pagination={pagination} onPageChange={setPage} /></div>}
      </div>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Destination?" message="This will permanently delete this destination." />
    </div>
  );
}