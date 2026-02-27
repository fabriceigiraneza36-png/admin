import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi, useMutation } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiPlus, HiPencil, HiTrash, HiOutlineGlobe } from "react-icons/hi";

export default function Countries() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const { mutate, loading: deleting } = useMutation();

  const { data, loading, pagination, refetch } = useApi(
    `/countries?page=${page}&limit=10&search=${search}`
  );

  const handleDelete = async () => {
    try {
      await mutate("delete", `/countries/${deleteId}`);
      toast.success("Country deleted");
      setDeleteId(null);
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    {
      key: "image",
      label: "",
      style: { width: 60 },
      render: (row) => (
        <img
          src={row.image_url || "/placeholder.svg"}
          alt=""
          className="table-image"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'><rect fill='%23e2e8f0' width='44' height='44' rx='8'/><text x='22' y='26' text-anchor='middle' fill='%2394a3b8' font-size='16'>🌍</text></svg>";
          }}
        />
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--gray-800)" }}>{row.name}</div>
          <div style={{ fontSize: 12, color: "var(--gray-400)" }}>{row.continent}</div>
        </div>
      ),
    },
    { key: "capital", label: "Capital" },
    {
      key: "destination_count",
      label: "Destinations",
      render: (row) => (
        <span className="badge badge-green">{row.destination_count || 0}</span>
      ),
    },
    {
      key: "is_featured",
      label: "Featured",
      render: (row) => (
        <StatusBadge status={row.is_featured ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      style: { width: 100 },
      render: (row) => (
        <div className="table-actions">
          <button
            className="table-action-btn edit"
            onClick={() => navigate(`/countries/${row.id}/edit`)}
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

  return (
    <div>
      <div className="page-header">
        <h2>Countries</h2>
        <Link to="/countries/new" className="btn btn-primary">
          <HiPlus /> Add Country
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <SearchBar onSearch={setSearch} placeholder="Search countries..." />
        </div>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          emptyMessage="No countries found"
          emptyIcon={HiOutlineGlobe}
        />
        {pagination && (
          <div style={{ padding: "0 24px" }}>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Country?"
        message="All destinations under this country will also be deleted."
      />
    </div>
  );
}