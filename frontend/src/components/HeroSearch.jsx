import React from 'react';
import { Search, Calendar, MapPin, Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';

const CITIES = ['All Destinations', 'Jaipur', 'Goa', 'Mumbai', 'Manali', 'Udaipur', 'Munnar'];

export default function HeroSearch({
  location,
  setLocation,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onSearch,
  totalHotelsCount,
  loading
}) {
  const today = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    // If checkOut is not after newCheckIn, set checkOut to newCheckIn + 1 day
    if (newCheckIn >= checkOut) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <section style={{
      padding: '48px 0 32px 0',
      position: 'relative',
    }}>
      <div className="container">
        {/* Title & Tagline */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(254, 215, 170, 0.45)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: '#b45309',
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(217, 119, 6, 0.08)'
          }}>
            <Sparkles size={15} color="#d97706" />
            <span>EXCLUSIVE BOUTIQUE & LUXURY HOTELS</span>
          </div>

          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            lineHeight: 1.18,
            color: '#0d2744',
            marginBottom: '14px',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.02em'
          }}>
            Where Comfort Meets Elegance
          </h1>

          <p style={{
            fontSize: '1.18rem',
            color: '#526071',
            fontWeight: 400,
            lineHeight: 1.6
          }}>
            Discover handpicked heritage palaces, coastal retreats, and alpine chalets with transparent pricing, instant booking, and delightful stay enhancers.
          </p>
        </div>

        {/* Search Widget Glass Card */}
        <div className="glass-card" style={{
          padding: '24px 28px',
          maxWidth: '1100px',
          margin: '0 auto 28px auto',
          boxShadow: '0 16px 36px -4px rgba(13, 39, 68, 0.1), 0 6px 16px -2px rgba(217, 119, 6, 0.06)'
        }}>
          <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) 160px',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            {/* Location input */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#d97706" />
                <span>Destination / Hotel</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jaipur, Goa, Palace..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Check-in Date */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#d97706" />
                <span>Check-in Date</span>
              </label>
              <input
                type="date"
                className="form-input"
                min={today}
                value={checkIn}
                onChange={handleCheckInChange}
                required
              />
            </div>

            {/* Check-out Date */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#d97706" />
                <span>Check-out Date ({nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : 'Select'})</span>
              </label>
              <input
                type="date"
                className="form-input"
                min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="btn btn-gold"
                disabled={loading}
                style={{ width: '100%', height: '48px', fontSize: '1rem', fontWeight: 700 }}
              >
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick city filter chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(254, 215, 170, 0.5)'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Popular:
            </span>
            {CITIES.map((city) => {
              const isSelected = city === 'All Destinations' ? !location : location.toLowerCase() === city.toLowerCase();
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    const newLoc = city === 'All Destinations' ? '' : city;
                    setLocation(newLoc);
                    onSearch(newLoc);
                  }}
                  style={{
                    background: isSelected ? '#0d2744' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: isSelected ? '1px solid #0d2744' : '1px solid #fed7aa',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confidence highlights bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.75)',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(254, 215, 170, 0.4)'
          }}>
            <ShieldCheck size={20} color="#15803d" />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0d2744' }}>Live Capacity Tracking</div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Guaranteed rooms, no overbooking</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.75)',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(254, 215, 170, 0.4)'
          }}>
            <Clock size={20} color="#d97706" />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0d2744' }}>Instant Room Release</div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Cancelled stays immediately freed</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.75)',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(254, 215, 170, 0.4)'
          }}>
            <Award size={20} color="#0d2744" />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0d2744' }}>Curated Weather & Add-ons</div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Local guides, breakfast & chauffeur</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
