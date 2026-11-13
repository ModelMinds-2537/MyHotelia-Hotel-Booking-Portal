import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Printer, Calendar, MapPin, User, Mail, Sparkles, X, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function BookingConfirmationModal({ booking, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffeedd 100%)',
          borderBottom: '1.5px solid #fed7aa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(21, 128, 61, 0.2)'
            }}>
              <CheckCircle2 size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0d2744', lineHeight: 1.2 }}>
                Booking Confirmed!
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Your room has been reserved. A confirmation email has been dispatched.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="no-print"
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

        {/* Printable Voucher & Body */}
        <div style={{ padding: '28px' }}>
          {/* Booking Reference Hero Box */}
          <div style={{
            background: 'linear-gradient(135deg, #0d2744 0%, #1e4a7a 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 25px -4px rgba(13, 39, 68, 0.2)'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#fed7aa', fontWeight: 700 }}>
                Unique Booking Reference
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff', marginTop: '2px' }}>
                {booking.bookingReference}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                Keep this reference and your email to manage or cancel your reservation anytime.
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="no-print"
              style={{
                background: copied ? '#15803d' : 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Reference</span>
                </>
              )}
            </button>
          </div>

          {/* Luxury Travel Pass Container (Printable) */}
          <div id="printable-voucher" style={{
            border: '2px dashed #fed7aa',
            borderRadius: '16px',
            padding: '22px 26px',
            background: '#ffffff',
            marginBottom: '24px',
            position: 'relative'
          }}>
            {/* Pass Brand Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '14px',
              borderBottom: '1.5px solid #f1f5f9',
              marginBottom: '16px'
            }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0d2744' }}>
                  My<span style={{ color: '#d97706' }}>Hotelia</span> Boarding Pass
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                  Making Every Stay Memorable.
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">
                  CONFIRMED RESERVATION
                </span>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                  Ref: {booking.bookingReference}
                </div>
              </div>
            </div>

            {/* Hotel & Guest Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                  Property
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0d2744' }}>
                  {booking.hotelName}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {booking.hotelLocation}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                  Guest Details
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0d2744' }}>
                  {booking.guestName}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {booking.guestEmail}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                  Room Category
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0d2744' }}>
                  {booking.roomType}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 600 }}>
                  1 Room, Standard Occupancy
                </div>
              </div>
            </div>

            {/* Dates & Times Banner */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              textAlign: 'center',
              marginBottom: '18px'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Check-in (After 2:00 PM)
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0d2744' }}>
                  {booking.checkInDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Duration
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#d97706' }}>
                  {booking.numberOfNights} Night{booking.numberOfNights > 1 ? 's' : ''}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Check-out (Before 11:00 AM)
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0d2744' }}>
                  {booking.checkOutDate}
                </div>
              </div>
            </div>

            {/* Add-ons & Amount */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <div>
                {booking.selectedAddOns ? (
                  <div style={{ fontSize: '0.82rem', color: '#0d2744' }}>
                    <span style={{ fontWeight: 700, color: '#d97706' }}>Included Add-ons:</span> {booking.selectedAddOns}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    No add-ons requested
                  </div>
                )}
                {booking.specialRequests && (
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                    Note: "{booking.specialRequests}"
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Amount Paid / Due
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d2744' }}>
                  {formatINR(booking.totalAmount, true)}
                </div>
              </div>
            </div>

            {/* Barcode styling aesthetic */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1.5px dashed #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                letterSpacing: '0.2em',
                color: '#64748b'
              }}>
                ||||| | |||| |||||| | || ||||| ||||||| ||| |||
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Present digital or printed pass at front desk upon arrival.
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="no-print" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={handlePrint}
              className="btn btn-outline"
              style={{ padding: '10px 18px' }}
            >
              <Printer size={16} />
              <span>Print / Save Voucher</span>
            </button>

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <span>Back to Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
