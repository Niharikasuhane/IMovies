const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Clients join a room per show: socket.emit('show:join', showId)
// Server broadcasts 'seats:update' { showId, seatIds, status } whenever seat state changes.
module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (token) {
      try { socket.user = jwt.verify(token, process.env.JWT_SECRET); } catch (e) { /* guest */ }
    }
    next();
  });

  io.on('connection', (socket) => {
    socket.on('show:join', (showId) => socket.join(`show:${showId}`));
    socket.on('show:leave', (showId) => socket.leave(`show:${showId}`));
    socket.on('disconnect', () => logger.debug(`socket disconnected ${socket.id}`));
  });
  return io;
};
