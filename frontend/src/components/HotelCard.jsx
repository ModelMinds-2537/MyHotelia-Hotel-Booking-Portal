import React from 'react';
import { Star, MapPin, Wifi, Waves, Sparkles, Utensils, CloudSun, ArrowRight, BedSingle } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function HotelCard({ hotel, checkIn, checkOut, nights, onSelectHotel }) {
  const isAvailable = hotel.availableRooms > 0;
  const isLowCapacity = hotel.availableRooms > 0 && hotel.availableRooms <= 2;

  // Compute estimated total for the selected nights in INR (including 12% GST)
  const estimatedStayTotal = nights > 0 ? (hotel.pricePerNight * nights * 1.12) : null;

  return (
    <div className="white-card card-shadow-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      height: '100%',
    }}>
      {/* Hotel Image with Badges */}
      <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* City Badge (Top Left) */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          background: 'rgba(13, 39, 68, 0.88)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          {hotel.city}
        </div>

        {/* Rating Badge (Top Right) */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.82rem',
          fontWeight: 700,
          color: '#0d2744',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{hotel.rating.toFixed(1)}</span>
          <span style={{ color: '#64748b', fontSize: '0.74rem' }}>({hotel.reviewCount})</span>
        </div>

        {/* Live Availability Pill (Bottom Left over image) */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
        }}>
          {isAvailable ? (
            isLowCapacity ? (
              <span className="badge badge-gold" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                <Sparkles size={13} color="#b45309" />
                Only {hotel.availableRooms} room{hotel.availableRooms > 1 ? 's' : ''} left!
              </span>
            ) : (
              <span className="badge badge-green" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                <BedSingle size={13} color="#15803d" />
                {hotel.availableRooms} rooms available
              </span>
            )
          ) : (
            <span className="badge badge-red" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
              Sold out for dates
            </span>
          )}
        </div>
      </div>

      {/* Hotel Content */}
      <div style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Hotel Name */}
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#0d2744',
            marginBottom: '6px',
            lineHeight: 1.3
          }}>
            {hotel.name}
          </h3>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#64748b',
            fontSize: '0.85rem',
            marginBottom: '10px'
          }}>
            <MapPin size={14} color="#d97706" />
            <span>{hotel.location}</span>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: '0.88rem',
            color: '#526071',
            fontStyle: 'italic',
            marginBottom: '14px',
            lineHeight: 1.45
          }}>
            "{hotel.tagline}"
          </p>

          {/* Room Category */}
          <div style={{
            background: 'rgba(254, 243, 199, 0.45)',
            border: '1px solid rgba(254, 215, 170, 0.6)',
            padding: '8px 12px',
            borderRadius: '10px',
            marginBottom: '14px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
              Included Category
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0d2744' }}>
              {hotel.roomType}
            </div>
          </div>

          {/* Amenities tags */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '18px'
          }}>
            {hotel.amenities && hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities && hotel.amenities.length > 3 && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center' }}>
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer with Price & Action */}
        <div style={{
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d2744' }}>
                {formatINR(hotel.pricePerNight)}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>/ night</span>
            </div>

            {estimatedStayTotal && nights > 0 ? (
              <div style={{ fontSize: '0.76rem', color: '#15803d', fontWeight: 600 }}>
                Est. {formatINR(estimatedStayTotal)} for {nights} night{nights > 1 ? 's' : ''} (incl. GST)
              </div>
            ) : (
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                +12% GST applicable
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectHotel(hotel)}
            className={isAvailable ? "btn btn-gold" : "btn btn-outline"}
            style={{ padding: '10px 16px', fontSize: '0.88rem', fontWeight: 600 }}
          >
            <span>{isAvailable ? 'View & Book' : 'Details'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
