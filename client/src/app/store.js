import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';

export default configureStore({ reducer: { auth: authReducer, booking: bookingReducer } });
