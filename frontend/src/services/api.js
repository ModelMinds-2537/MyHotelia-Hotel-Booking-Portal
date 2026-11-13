const API_BASE = '/api';

export async function fetchHotels(checkIn, checkOut) {
  const params = new URLSearchParams();
  if (checkIn) params.append('checkIn', checkIn);
  if (checkOut) params.append('checkOut', checkOut);
  const query = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(`${API_BASE}/hotels${query}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch hotels');
  }
  return json.data || [];
}

export async function searchHotels(location, checkIn, checkOut) {
  const params = new URLSearchParams();
  if (location && location.trim()) params.append('location', location.trim());
  if (checkIn) params.append('checkIn', checkIn);
  if (checkOut) params.append('checkOut', checkOut);
  const query = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(`${API_BASE}/hotels/search${query}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to search hotels');
  }
  return json.data || [];
}

export async function fetchHotelById(id, checkIn, checkOut) {
  const params = new URLSearchParams();
  if (checkIn) params.append('checkIn', checkIn);
  if (checkOut) params.append('checkOut', checkOut);
  const query = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(`${API_BASE}/hotels/${id}${query}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to fetch hotel details');
  }
  return json.data;
}

export async function fetchPriceQuote(hotelId, checkIn, checkOut, addOns = []) {
  const params = new URLSearchParams();
  params.append('checkIn', checkIn);
  params.append('checkOut', checkOut);
  if (addOns && addOns.length > 0) {
    params.append('addOns', addOns.join(','));
  }

  const res = await fetch(`${API_BASE}/hotels/${hotelId}/quote?${params.toString()}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to calculate price quote');
  }
  return json.data;
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const errorMsg = json.errors && json.errors.length > 0 ? json.errors.join(', ') : json.message;
    throw new Error(errorMsg || 'Booking creation failed');
  }
  return json.data;
}

export async function lookupBooking(reference, email) {
  const params = new URLSearchParams({ reference, email });
  const res = await fetch(`${API_BASE}/bookings/lookup?${params.toString()}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Booking lookup failed');
  }
  return json.data;
}

export async function cancelBooking(reference, email) {
  const params = new URLSearchParams({ email });
  const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(reference)}/cancel?${params.toString()}`, {
    method: 'POST',
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Booking cancellation failed');
  }
  return json.data;
}
