import React from 'react';
import { CalendarCheck, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenManageBooking }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(254, 215, 170, 0.5)',
      boxShadow: '0 4px 20px -2px rgba(13, 39, 68, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        paddingBottom: '12px',
      }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="MyHotelia Logo"
              style={{
                height: '52px',
                width: 'auto',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </a>
          <div style={{ borderLeft: '1.5px solid #fed7aa', paddingLeft: '14px' }}>
            <span style={{
              display: 'block',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#d97706',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontStyle: 'italic'
            }}>
              Making Every Stay Memorable.
            </span>
          </div>
        </div>

        {/* Right Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: '#0d2744',
            background: '#ffffff',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: '1px solid #fed7aa',
            fontWeight: 700
          }}>
            <span style={{ color: '#d97706' }}>₹</span>
            <span>INR</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            color: '#526071',
            background: 'rgba(254, 243, 199, 0.6)',
            padding: '6px 12px',
            borderRadius: '9999px',
            border: '1px solid #fde68a'
          }}>
            <Sparkles size={14} color="#d97706" />
            <span style={{ fontWeight: 600, color: '#92400e' }}>Surprise Perks Included</span>
          </div>

          <button
            onClick={onOpenManageBooking}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.88rem' }}
          >
            <CalendarCheck size={16} />
            <span>Manage / Cancel Booking</span>
          </button>
        </div>
      </div>
    </header>
  );
}
