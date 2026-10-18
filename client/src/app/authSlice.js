import { createSlice } from '@reduxjs/toolkit';

const stored = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persist = (state, { token, user }) => {
  state.token = token;
  state.user = user;
  state.loading = false;
  localStorage.setItem('token', token || 'demo-jwt-token');
  localStorage.setItem('user', JSON.stringify(user));
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: stored(),
    token: localStorage.getItem('token') || null,
    loading: false,
  },
  reducers: {
    demoLogin(state, action) {
      persist(state, {
        token: action.payload?.token || 'demo-token-' + Date.now(),
        user: action.payload?.user || action.payload,
      });
    },
    demoRegister(state, action) {
      persist(state, {
        token: action.payload?.token || 'demo-token-' + Date.now(),
        user: action.payload?.user || action.payload,
      });
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { demoLogin, demoRegister, logout } = authSlice.actions;
export default authSlice.reducer;
