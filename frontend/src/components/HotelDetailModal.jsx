import React, { useState, useEffect } from 'react';
import { 
  X, Star, MapPin, Check, Sparkles, CloudSun, Compass, ShieldCheck, 
  Calendar, BedSingle, Coffee, Car, Clock, Bath, Loader2, AlertCircle 
} from 'lucide-react';
import { fetchPriceQuote, createBooking } from '../services/api';
import { formatINR, formatINRWithDecimals } from '../utils/currency';

const AVAILABLE_ADDONS = [
  {
    name: 'Gourmet Breakfast Buffet',
    description: 'Fresh farm-to-table breakfast spread served daily in royal dining hall',
    priceText: '₹850 / night',
    isPerNight: true,
    price: 850,
    icon: Coffee,
  },
  {
    name: 'Express Airport Chauffeur',
    description: 'Private luxury sedan pickup directly from arrivals terminal',
    priceText: '₹2,200 flat',
    isPerNight: false,
    price: 2200,
    icon: Car,
  },
  {
    name: 'Late Check-out (3:00 PM)',
    description: 'Enjoy a leisurely morning and check out at 3:00 PM instead of 11:00 AM',
    priceText: '₹1,500 flat',
    isPerNight: false,
    price: 1500,
    icon: Clock,
  },
  {
    name: 'Wellness Spa & Sauna Pass',
    description: 'Unlimited access to heated hydrotherapy pool, eucalyptus steam & sauna',
    priceText: '₹1,800 flat',
    isPerNight: false,
    price: 1800,
    icon: Bath,
  },
];

export default function HotelDetailModal({
  hotel,
  initialCheckIn,
  initialCheckOut,
  onClose,
  onBookingSuccess,
}) {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [selectedAddOns, setSelectedAddOns] = useState(['Gourmet Breakfast Buffet']);
  
  // Form fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Price quote & availability state
  const [priceQuote, setPriceQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // Booking submit state
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  // Recalculate price whenever dates or addons change
  useEffect(() => {
    if (!checkIn || !checkOut || checkIn >= checkOut) return;

    let isMounted = true;
    setLoadingQuote(true);
    setQuoteError(null);

    fetchPriceQuote(hotel.id, checkIn, checkOut, selectedAddOns)
      .then((data) => {
        if (isMounted) {
          setPriceQuote(data);
          setLoadingQuote(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setQuoteError(err.message);
          setLoadingQuote(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hotel.id, checkIn, checkOut, selectedAddOns]);

  const toggleAddOn = (addonName) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonName) ? prev.filter((item) => item !== addonName) : [...prev, addonName]
    );
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);

    if (!guestName.trim()) {
      setBookingError('Please enter your full name.');
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setBookingError('Please enter a valid email address.');
      return;
    }
    if (priceQuote && !priceQuote.available) {
      setBookingError('Sorry, no rooms are available for the selected dates.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        hotelId: hotel.id,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim() || null,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        selectedAddOns: selectedAddOns,
        specialRequests: specialRequests.trim() || null,
      };

      const result = await createBooking(payload);
      onBookingSuccess(result);
    } catch (err) {
      setBookingError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nights = priceQuote ? priceQuote.numberOfNights : 0;
  const isAvailable = priceQuote ? priceQuote.available : hotel.availableRooms > 0;
  const availableCount = priceQuote ? priceQuote.availableRooms : hotel.availableRooms;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px' }}
      >
        {/* Header Hero Image */}
        <div style={{ position: 'relative', width: '100%', height: '280px' }}>
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13,39,68,0.85) 0%, rgba(13,39,68,0.2) 60%, transparent 100%)'
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0d2744',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
            }}
          >
            <X size={20} />
          </button>

          {/* Title overlay */}
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: '#d97706',
                color: '#ffffff',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {hotel.city}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.8rem' }}>
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <span>{hotel.rating.toFixed(1)}</span>
                <span style={{ opacity: 0.8 }}>({hotel.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '4px' }}>
              {hotel.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', opacity: 0.9 }}>
              <MapPin size={15} color="#fed7aa" />
              <span>{hotel.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
            
            {/* Left Column: Details & Surprise Perks */}
            <div>
              {/* Tagline & Description */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: '#d97706',
                  marginBottom: '10px'
                }}>
                  "{hotel.tagline}"
                </div>
                <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.65 }}>
                  {hotel.description}
                </p>
              </div>

              {/* Room Specifications */}
              <div style={{
                background: 'rgba(254, 243, 199, 0.35)',
                border: '1.5px solid #fed7aa',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '22px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <BedSingle size={18} color="#b45309" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                    Included Room Category
                  </span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d2744', marginBottom: '6px' }}>
                  {hotel.roomType}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#526071', lineHeight: 1.5 }}>
                  {hotel.roomDescription}
                </p>
              </div>

              {/* Surprise Feature 1: Live Destination Weather Guide */}
              {hotel.weatherGuide && (
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
                  border: '1px solid #bfdbfe',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '10px',
                    color: '#0284c7',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.15)'
                  }}>
                    <CloudSun size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Stay Weather & Advisory (Surprise Feature)
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
                      {hotel.weatherGuide}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '3px' }}>
                      Pack light daytime clothing with an evening layer. Perfect weather for sightseeing & pool lounging.
                    </div>
                  </div>
                </div>
              )}

              {/* Surprise Feature 2: Curated Nearby Attractions */}
              {hotel.topAttractions && hotel.topAttractions.length > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Compass size={17} color="#d97706" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0d2744', textTransform: 'uppercase' }}>
                      Curated Nearby Attractions
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {hotel.topAttractions.map((attraction, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #fed7aa60',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }} />
                        <span>{attraction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Amenities */}
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0d2744', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  Property Amenities
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {hotel.amenities && hotel.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        padding: '5px 10px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Check size={13} color="#15803d" />
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Date Selection, Surprise Add-ons & Booking Form */}
            <div>
              {/* Stay Dates & Live Availability Status */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #fed7aa',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '18px',
                boxShadow: '0 4px 12px rgba(13, 39, 68, 0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0d2744' }}>
                    Select Your Stay Dates
                  </span>

                  {/* Availability Badge */}
                  <div>
                    {isAvailable ? (
                      <span className="badge badge-green">
                        <Check size={12} />
                        {availableCount} room{availableCount > 1 ? 's' : ''} available
                      </span>
                    ) : (
                      <span className="badge badge-red">
                        Sold Out for these dates
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Check-in</label>
                    <input
                      type="date"
                      className="form-input"
                      min={today}
                      value={checkIn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCheckIn(val);
                        if (val >= checkOut) {
                          const next = new Date(val);
                          next.setDate(next.getDate() + 1);
                          setCheckOut(next.toISOString().split('T')[0]);
                        }
                      }}
                      style={{ padding: '8px 10px', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Check-out</label>
                    <input
                      type="date"
                      className="form-input"
                      min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      style={{ padding: '8px 10px', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600, textAlign: 'center' }}>
                    Stay duration: {nights} night{nights > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Surprise Feature 3: Interactive Stay Add-Ons */}
              <div style={{
                background: '#fffbf5',
                border: '1px solid #fed7aa',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Sparkles size={16} color="#d97706" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                    Enhance Your Stay (Surprise Add-Ons)
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.name);
                    const Icon = addon.icon;
                    return (
                      <label
                        key={addon.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: isChecked ? 'rgba(254, 215, 170, 0.4)' : '#ffffff',
                          border: isChecked ? '1.5px solid #d97706' : '1px solid #fed7aa60',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddOn(addon.name)}
                            style={{ accentColor: '#d97706', width: '16px', height: '16px' }}
                          />
                          <Icon size={16} color={isChecked ? '#b45309' : '#64748b'} />
                          <div>
                            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0d2744' }}>
                              {addon.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {addon.description}
                            </div>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: isChecked ? '#b45309' : '#0d2744',
                          whiteSpace: 'nowrap',
                          marginLeft: '10px'
                        }}>
                          +{addon.priceText}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Breakdown Box (Core Requirement: "See total booking amount before confirming") */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #0d2744',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
                boxShadow: '0 6px 18px rgba(13, 39, 68, 0.06)'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d2744', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Booking Amount Breakdown
                </div>

                {loadingQuote ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', gap: '8px', color: '#d97706' }}>
                    <Loader2 size={18} className="animate-spin" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Calculating stay breakdown...</span>
                  </div>
                ) : priceQuote ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>
                        {formatINR(priceQuote.pricePerNight)} × {priceQuote.numberOfNights} night{priceQuote.numberOfNights > 1 ? 's' : ''}
                      </span>
                      <span style={{ fontWeight: 600, color: '#0d2744' }}>
                        {formatINR(priceQuote.roomSubtotal, true)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Hospitality GST (12%)</span>
                      <span style={{ fontWeight: 600, color: '#0d2744' }}>
                        {formatINR(priceQuote.taxAmount, true)}
                      </span>
                    </div>

                    {priceQuote.addOnsSubtotal > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                        <span>Selected Add-ons</span>
                        <span style={{ fontWeight: 600, color: '#d97706' }}>
                          +{formatINR(priceQuote.addOnsSubtotal, true)}
                        </span>
                      </div>
                    )}

                    <div style={{
                      marginTop: '6px',
                      paddingTop: '10px',
                      borderTop: '1.5px dashed #fed7aa',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline'
                    }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0d2744' }}>
                          Total Due:
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>
                          ✓ Guaranteed room rate in INR, all taxes included
                        </div>
                      </div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0d2744' }}>
                        {formatINR(priceQuote.totalAmount, true)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Select dates to view price calculation.
                  </div>
                )}
              </div>

              {/* Guest Details Form */}
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="form-input"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Email Address (for booking confirmation) *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. eleanor@example.com"
                    className="form-input"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Phone Number (optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 555-0199"
                    className="form-input"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Special Requests (optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Quiet room away from elevator, honeymoon setup"
                    className="form-input"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Error Banner */}
                {bookingError && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#b91c1c',
                    fontSize: '0.85rem'
                  }}>
                    <AlertCircle size={16} />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={!isAvailable || submitting || loadingQuote}
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '14px', fontSize: '1.02rem', fontWeight: 700, marginTop: '4px' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Confirming Reservation...</span>
                    </>
                  ) : !isAvailable ? (
                    <span>Sold Out for Selected Stay</span>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Confirm & Book Room</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
