import React, { useState } from 'react';
import { 
  X, Search, Calendar, MapPin, User, Mail, AlertTriangle, 
  CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, Printer 
} from 'lucide-react';
import { lookupBooking, cancelBooking } from '../services/api';
import { formatINR } from '../utils/currency';

export default function ManageBookingModal({ onClose, onBookingCancelled }) {
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setShowCancelConfirm(false);

    if (!reference.trim() || !email.trim()) {
      setError('Please provide both your Booking Reference and Email Address.');
      return;
    }

    setLoading(true);
    try {
      const data = await lookupBooking(reference.trim(), email.trim());
      setBooking(data);
    } catch (err) {
      setError(err.message || 'No reservation found matching these details. Please check your reference code and email.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setCancelling(true);
    setError(null);

    try {
      const updated = await cancelBooking(booking.bookingReference, booking.guestEmail);
      setBooking(updated);
      setSuccessMsg('Booking cancelled successfully. Reserved rooms have been released back to availability.');
      setShowCancelConfirm(false);
      if (onBookingCancelled) {
        onBookingCancelled();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffeedd 100%)',
          borderBottom: '1px solid #fed7aa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d2744' }}>
              Manage / Cancel Reservation
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Retrieve your booking using your reference code and email address.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#ffffff',
              border: '1px solid #fed7aa',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0d2744'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Lookup Form */}
          <form onSubmit={handleLookup} style={{
            background: '#ffffff',
            border: '1.5px solid #fed7aa',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label className="form-label">Booking Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-2026-XXXXXX"
                  className="form-input"
                  value={reference}
                  onChange={(e) => setReference(e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. guest@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{ width: '100%', padding: '11px', fontWeight: 700 }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Searching Reservation...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Find My Booking</span>
                </>
              )}
            </button>
          </form>

          {/* Feedback Messages */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '12px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#b91c1c',
              fontSize: '0.88rem',
              marginBottom: '18px'
            }}>
              <XCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #bbf7d0',
              padding: '12px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#15803d',
              fontSize: '0.88rem',
              marginBottom: '18px'
            }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Booking Found Card */}
          {booking && (
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #0d2744',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(13, 39, 68, 0.08)'
            }}>
              {/* Reference & Status Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '14px',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '14px'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                    Booking Reference
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d2744' }}>
                    {booking.bookingReference}
                  </div>
                </div>

                <div>
                  {booking.status === 'CONFIRMED' ? (
                    <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                      <CheckCircle2 size={14} />
                      CONFIRMED
                    </span>
                  ) : (
                    <span className="badge badge-red" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                      <XCircle size={14} />
                      CANCELLED
                    </span>
                  )}
                </div>
              </div>

              {/* Hotel & Guest Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Hotel
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0d2744' }}>
                    {booking.hotelName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {booking.hotelLocation}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#d97706', fontWeight: 600, marginTop: '3px' }}>
                    {booking.roomType}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Guest Information
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0d2744' }}>
                    {booking.guestName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {booking.guestEmail}
                  </div>
                  {booking.guestPhone && (
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {booking.guestPhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates & Amount */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '8px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Check-in
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0d2744' }}>
                    {booking.checkInDate}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Check-out
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0d2744' }}>
                    {booking.checkOutDate}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Amount
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d2744' }}>
                    {formatINR(booking.totalAmount, true)}
                  </div>
                </div>
              </div>

              {/* Addons if any */}
              {booking.selectedAddOns && (
                <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 700, color: '#d97706' }}>Add-ons:</span> {booking.selectedAddOns}
                </div>
              )}

              {/* Status Note or Cancellation Actions */}
              {booking.status === 'CONFIRMED' ? (
                <div>
                  {!showCancelConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="btn btn-danger"
                      style={{ width: '100%', padding: '11px', fontWeight: 700 }}
                    >
                      <span>Cancel This Reservation</span>
                    </button>
                  ) : (
                    <div style={{
                      background: '#fff1f2',
                      border: '1.5px solid #fecdd3',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <AlertTriangle size={24} color="#e11d48" style={{ margin: '0 auto 8px auto' }} />
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#9f1239', marginBottom: '4px' }}>
                        Confirm Cancellation?
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '14px' }}>
                        Cancelling will release your reserved room back to the hotel inventory immediately.
                      </p>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setShowCancelConfirm(false)}
                          className="btn btn-outline"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Keep Reservation
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={cancelling}
                          className="btn btn-danger"
                          style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 700 }}
                        >
                          {cancelling ? 'Cancelling...' : 'Yes, Cancel Stay'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '0.84rem',
                  color: '#991b1b',
                  fontWeight: 600
                }}>
                  This reservation is cancelled. The reserved room has been released.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
