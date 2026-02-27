import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import DataTable from "../components/DataTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import { HiOutlineCalendar, HiEye } from "react-icons/hi";

export default function Bookings() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { data, loading, pagination } = useApi(
    `/bookings?page=${page}&limit=15&search=${search}&status=${status}`
  );

  const columns = [
    { key: "booking_number", label: "Booking #", render: (row) => <span style={{ fontWeight: 600, color: "var(--green-600)" }}>{row.booking_number}</span> },
    { key: "full_name", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "destination_name", label: "Destination", render: (row) => row.destination_name || "—" },
    { key: "travel_date", label: "Travel Date", render: (row) => row.travel_date ? new Date(row.travel_date).toLocaleDateString() : "—" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "payment_status", label: "Payment", render: (row) => <StatusBadge status={row.payment_status} /> },
    {
      key: "actions", label: "", style: { width: 50 },
      render: (row) => <button className="table-action-btn edit" onClick={() => navigate(`/bookings/${row.id}`)}><HiEye /></button>,
    },
  ];

  return (
    <div>
      <div className="page-header"><h2>Bookings</h2></div>
      <div className="card">
        <div className="card-header">
          <SearchBar onSearch={setSearch} placeholder="Search bookings..." />
          <select className="filter-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <DataTable columns={columns} data={data} loading={loading} emptyMessage="No bookings" emptyIcon={HiOutlineCalendar} />
        {pagination && <div style={{ padding: "0 24px" }}><Pagination pagination={pagination} onPageChange={setPage} /></div>}
      </div>
    </div>
  );
}