import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import StatsCard from "../components/StatsCard";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import {
  HiOutlineGlobe,
  HiOutlineMap,
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlineUsers,
  HiOutlineNewspaper,
  HiOutlineEye,
} from "react-icons/hi";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [countries, destinations, bookings, messages, subscribers, posts] =
        await Promise.all([
          API.get("/countries?limit=1"),
          API.get("/destinations?limit=1"),
          API.get("/bookings?limit=5"),
          API.get("/contact?limit=5"),
          API.get("/subscribers?limit=1"),
          API.get("/posts?limit=1"),
        ]);

      setStats({
        countries: countries.data.pagination?.totalItems || countries.data.data?.length || 0,
        destinations: destinations.data.pagination?.totalItems || destinations.data.data?.length || 0,
        bookings: bookings.data.pagination?.totalItems || bookings.data.data?.length || 0,
        messages: messages.data.pagination?.totalItems || messages.data.data?.length || 0,
        subscribers: subscribers.data.pagination?.totalItems || subscribers.data.data?.length || 0,
        posts: posts.data.pagination?.totalItems || posts.data.data?.length || 0,
      });
      setRecentBookings(bookings.data.data || []);
      setRecentMessages(messages.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="stats-grid">
        <StatsCard title="Countries" value={stats?.countries || 0} icon={HiOutlineGlobe} color="green" />
        <StatsCard title="Destinations" value={stats?.destinations || 0} icon={HiOutlineMap} color="blue" />
        <StatsCard title="Bookings" value={stats?.bookings || 0} icon={HiOutlineCalendar} color="yellow" />
        <StatsCard title="Messages" value={stats?.messages || 0} icon={HiOutlineMail} color="red" />
        <StatsCard title="Subscribers" value={stats?.subscribers || 0} icon={HiOutlineUsers} color="green" />
        <StatsCard title="Blog Posts" value={stats?.posts || 0} icon={HiOutlineNewspaper} color="blue" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Bookings */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Bookings</h3>
            <Link to="/bookings" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentBookings.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--gray-400)" }}>
                No bookings yet
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.slice(0, 5).map((b) => (
                    <tr key={b.id}>
                      <td>
                        <Link
                          to={`/bookings/${b.id}`}
                          style={{ color: "var(--green-600)", fontWeight: 600 }}
                        >
                          {b.booking_number}
                        </Link>
                      </td>
                      <td>{b.full_name}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ fontSize: 12, color: "var(--gray-400)" }}>
                        {new Date(b.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Messages</h3>
            <Link to="/messages" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentMessages.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--gray-400)" }}>
                No messages yet
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMessages.slice(0, 5).map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 500 }}>{m.full_name}</td>
                      <td>{m.subject || "No subject"}</td>
                      <td>
                        <StatusBadge status={m.is_read ? "read" : "pending"} />
                      </td>
                      <td style={{ fontSize: 12, color: "var(--gray-400)" }}>
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}