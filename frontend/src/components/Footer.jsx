import React from 'react';
import { Heart, ShieldCheck, Database, Server, Smartphone, Sparkles } from 'lucide-react';

export default function Footer({ onOpenManageBooking }) {
  return (
    <footer style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderTop: '1.5px solid rgba(254, 215, 170, 0.6)',
      marginTop: '60px',
      padding: '48px 0 28px 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          paddingBottom: '36px',
          borderBottom: '1px solid #f1f5f9'
        }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <img
                src="/logo.png"
                alt="MyHotelia"
                style={{ height: '46px', width: 'auto', borderRadius: '6px' }}
              />
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#d97706', fontStyle: 'italic', marginBottom: '8px' }}>
              Making Every Stay Memorable.
            </div>
            <p style={{ fontSize: '0.84rem', color: '#526071', lineHeight: 1.6 }}>
              A modern, full-stack hotel booking platform offering transparent nightly calculations, strict capacity enforcement, instant room release on cancellations, and surprise stay enhancers.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0d2744', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.04em' }}>
              Quick Navigation
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <a href="#hotels-section" style={{ color: '#526071', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Browse All Hotels
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenManageBooking}
                  style={{ background: 'none', border: 'none', color: '#d97706', fontWeight: 600, cursor: 'pointer', padding: 0, font: 'inherit' }}
                >
                  Manage / Cancel Booking
                </button>
              </li>
              <li>
                <span style={{ color: '#64748b' }}>Surprise Stay Perks & Add-ons</span>
              </li>
              <li>
                <span style={{ color: '#64748b' }}>Digital Boarding Passes</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Tech Stack Highlights */}
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0d2744', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.04em' }}>
              Architecture & Stack
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#526071' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={15} color="#d97706" />
                <span><strong>Backend:</strong> Java 21, Spring Boot REST APIs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={15} color="#0d2744" />
                <span><strong>Frontend:</strong> React 19, Vite, Lucide</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={15} color="#15803d" />
                <span><strong>Database:</strong> MySQL 8.0 with JPA/Hibernate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={15} color="#0284c7" />
                <span><strong>Rules:</strong> Strict Capacity & Date Validations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>MyHotelia</strong>. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Crafted with</span>
            <Heart size={13} fill="#e11d48" color="#e11d48" />
            <span>for seamless hospitality experiences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
