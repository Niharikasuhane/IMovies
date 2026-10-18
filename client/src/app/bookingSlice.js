import { createSlice } from '@reduxjs/toolkit';

// Holds the in-progress booking between seat selection -> payment -> confirmation
const slice = createSlice({
  name: 'booking',
  initialState: { show: null, selectedSeats: [], booking: null, lockedUntil: null },
  reducers: {
    setShow: (s, a) => { s.show = a.payload; },
    setSelectedSeats: (s, a) => { s.selectedSeats = a.payload; },
    setBooking: (s, a) => { s.booking = a.payload.booking; s.lockedUntil = a.payload.lockedUntil; },
    resetBooking: () => ({ show: null, selectedSeats: [], booking: null, lockedUntil: null }),
  },
});
export const { setShow, setSelectedSeats, setBooking, resetBooking } = slice.actions;
export default slice.reducer;
