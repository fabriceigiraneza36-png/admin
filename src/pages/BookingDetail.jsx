import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck, HiExternalLink } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get(`/bookings/${id}`)
      .then((res) => setBooking(res.data.data))
      .catch(() => toast.error("Not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = async (field, value) => {
    try {
      setSaving(true);
      await API.put(`/bookings/${id}`, { [field]: value });
      setBooking((p) => ({ ...p, [field]: value }));
      toast.success("Updated");
    } catch { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  const openWhatsApp = () => {
    const phone = booking.whatsapp || booking.phone;
    if (!phone) return toast.error("No WhatsApp number");
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${booking.full_name}! This is regarding your booking inquiry #${booking.booking_number}. How can I help you today?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  if (loading) return <LoadingSpinner />;
  if (!booking) return <div>Not found</div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate("/bookings")}><HiArrowLeft /></button>
          <div>
            <h2>Booking {booking.booking_number}</h2>
            <p style={{ fontSize: 13, color: "var(--gray-400)" }}>Created {new Date(booking.created_at).toLocaleString()}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <StatusBadge status={booking.status} />
          <button className="btn btn-primary" onClick={openWhatsApp} style={{ background: "#25D366" }}>
            <FaWhatsapp /> Chat on WhatsApp
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-header"><h3>Customer Info</h3></div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item"><label>Full Name</label><span>{booking.full_name}</span></div>
              <div className="detail-item"><label>Email</label><span>{booking.email}</span></div>
              <div className="detail-item"><label>Phone</label><span>{booking.phone || "—"}</span></div>
              <div className="detail-item"><label>WhatsApp</label><span>{booking.whatsapp || "—"}</span></div>
              <div className="detail-item"><label>Nationality</label><span>{booking.nationality || "—"}</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Trip Details</h3></div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item"><label>Destination</label><span>{booking.destination_name || "—"}</span></div>
              <div className="detail-item"><label>Service</label><span>{booking.service_name || "—"}</span></div>
              <div className="detail-item"><label>Travel Date</label><span>{booking.travel_date ? new Date(booking.travel_date).toLocaleDateString() : "—"}</span></div>
              <div className="detail-item"><label>Return Date</label><span>{booking.return_date ? new Date(booking.return_date).toLocaleDateString() : "—"}</span></div>
              <div className="detail-item"><label>Travelers</label><span>{booking.number_of_travelers}</span></div>
              <div className="detail-item"><label>Accommodation</label><span>{booking.accommodation_type || "—"}</span></div>
            </div>
            {booking.special_requests && (
              <div className="detail-item" style={{ marginTop: 16 }}>
                <label>Special Requests</label>
                <span style={{ whiteSpace: "pre-wrap" }}>{booking.special_requests}</span>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Update Status</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Booking Status</label>
              <select 
                className="form-select" 
                value={booking.status} 
                onChange={(e) => updateField("status", e.target.value)} 
                disabled={saving}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <p style={{ fontSize: 12, color: "var(--gray-400)", marginTop: 8 }}>
              💡 Use WhatsApp to negotiate pricing and finalize details with the customer.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Admin Notes</h3></div>
          <div className="card-body">
            <textarea 
              className="form-textarea" 
              value={booking.admin_notes || ""} 
              onChange={(e) => setBooking((p) => ({ ...p, admin_notes: e.target.value }))} 
              rows={4} 
              placeholder="Add internal notes about pricing, negotiations, etc..." 
            />
            <button 
              className="btn btn-primary btn-sm" 
              style={{ marginTop: 12 }} 
              onClick={() => updateField("admin_notes", booking.admin_notes)} 
              disabled={saving}
            >
              <HiCheck /> Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}