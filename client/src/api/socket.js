import { io } from 'socket.io-client';
import { API_ORIGIN } from './axios';

let socket;
export const getSocket = () => {
  if (!socket) {
    socket = io(API_ORIGIN || '/', { auth: { token: localStorage.getItem('token') } });
  }
  return socket;
};
