import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import HotelCard from './components/HotelCard';
import HotelDetailModal from './components/HotelDetailModal';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import ManageBookingModal from './components/ManageBookingModal';
import Footer from './components/Footer';
import { fetchHotels, searchHotels } from './services/api';
import { Sparkles, AlertCircle, Building2, SlidersHorizontal, Loader2 } from 'lucide-react';

export default function App() {
  // Date setup: checkIn = tomorrow, checkOut = 3 days after tomorrow
  const getInitialDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkOutDate = new Date(tomorrow);
    checkOutDate.setDate(checkOutDate.getDate() + 3);

    return {
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
    };
  };

  const initialDates = getInitialDates();
  const [checkIn, setCheckIn] = useState(initialDates.checkIn);
  const [checkOut, setCheckOut] = useState(initialDates.checkOut);
  const [location, setLocation] = useState('');

  // Data & loading states
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isManageBookingOpen, setIsManageBookingOpen] = useState(false);

  // Load hotels
  const loadHotels = useCallback(async (loc = location, inDate = checkIn, outDate = checkOut) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (loc && loc.trim()) {
        data = await searchHotels(loc.trim(), inDate, outDate);
      } else {
        data = await fetchHotels(inDate, outDate);
      }
      setHotels(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  }, [location, checkIn, checkOut]);

  // Initial fetch on mount
  useEffect(() => {
    loadHotels('', initialDates.checkIn, initialDates.checkOut);
  }, []);

  const handleSearch = (overrideLoc) => {
    const searchLoc = overrideLoc !== undefined ? overrideLoc : location;
    loadHotels(searchLoc, checkIn, checkOut);
  };

  const handleBookingSuccess = (booking) => {
    setSelectedHotel(null);
    setConfirmedBooking(booking);
    // Refresh hotels availability in background
    loadHotels(location, checkIn, checkOut);
  };

  const handleBookingCancelled = () => {
    // Refresh hotels availability so cancelled room is instantly visible
    loadHotels(location, checkIn, checkOut);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Navbar onOpenManageBooking={() => setIsManageBookingOpen(true)} />

      {/* Hero & Search Bar */}
      <HeroSearch
        location={location}
        setLocation={setLocation}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        onSearch={handleSearch}
        totalHotelsCount={hotels.length}
        loading={loading}
      />

      {/* Main Content: Hotel Listings */}
      <main id="hotels-section" style={{ flexGrow: 1, padding: '32px 0 48px 0' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '28px',
            paddingBottom: '16px',
            borderBottom: '1.5px solid rgba(254, 215, 170, 0.6)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Building2 size={16} />
                <span>Featured Destinations</span>
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0d2744', marginTop: '4px' }}>
                {location ? `Hotels in "${location}"` : 'Handpicked Luxury & Boutique Hotels'}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-navy" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                {hotels.length} {hotels.length === 1 ? 'property' : 'properties'} available
              </span>

              {nights > 0 && (
                <span className="badge badge-gold" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  {nights} Nights: {checkIn} → {checkOut}
                </span>
              )}
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '64px 20px',
              gap: '16px',
              color: '#d97706'
            }}>
              <Loader2 size={36} className="animate-spin" />
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0d2744' }}>
                Checking real-time room availability across MySQL...
              </div>
            </div>
          )}

          {/* Error Banner */}
          {!loading && error && (
            <div style={{
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '32px auto',
              color: '#991b1b'
            }}>
              <AlertCircle size={32} style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
                Unable to load hotels
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#7f1d1d', marginBottom: '16px' }}>
                {error}
              </p>
              <button
                onClick={() => loadHotels(location, checkIn, checkOut)}
                className="btn btn-primary"
                style={{ padding: '8px 20px' }}
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Hotels Grid */}
          {!loading && !error && hotels.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '28px'
            }}>
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  nights={nights}
                  onSelectHotel={(h) => setSelectedHotel(h)}
                />
              ))}
            </div>
          )}

          {/* Empty Results */}
          {!loading && !error && hotels.length === 0 && (
            <div className="glass-card" style={{
              padding: '48px 24px',
              textAlign: 'center',
              maxWidth: '540px',
              margin: '40px auto'
            }}>
              <Building2 size={40} color="#d97706" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0d2744', marginBottom: '8px' }}>
                No hotels found matching your search
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '20px' }}>
                We couldn't find any hotels matching "{location}". Try searching for popular destinations like "Jaipur", "Goa", or "Mumbai".
              </p>
              <button
                onClick={() => {
                  setLocation('');
                  loadHotels('', checkIn, checkOut);
                }}
                className="btn btn-gold"
              >
                Clear Filters & View All Hotels
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Hotel Detail & Booking Modal */}
      {selectedHotel && (
        <HotelDetailModal
          hotel={selectedHotel}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          onClose={() => setSelectedHotel(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Booking Confirmation Modal with Luxury Travel Pass */}
      {confirmedBooking && (
        <BookingConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}

      {/* Manage / Cancel Booking Modal */}
      {isManageBookingOpen && (
        <ManageBookingModal
          onClose={() => setIsManageBookingOpen(false)}
          onBookingCancelled={handleBookingCancelled}
        />
      )}

      {/* Footer */}
      <Footer onOpenManageBooking={() => setIsManageBookingOpen(true)} />
    </div>
  );
}
