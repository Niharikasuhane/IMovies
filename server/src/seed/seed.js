// Usage: node src/seed/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const generateSeats = require('../utils/seatGenerator');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Imovies';

(async () => {
  console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB.');

  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    try {
      await c.drop();
    } catch (e) {
      // ignore
    }
  }


  // Seed Admin matching screenshot 2
  await Admin.create({
    username: 'admin',
    email: 'admin@imovies.com',
    password: 'Admin@123',
  });

  // Seed Users matching screenshot 1
  await User.create([
    {
      username: 'adminuser',
      name: 'Admin',
      email: 'admin@imovies.com',
      password: 'Admin@123',
      role: 'admin',
      city: 'Hyderabad',
    },
    {
      username: 'demouser',
      name: 'Demo User',
      email: 'user@imovies.com',
      password: 'User@123',
      role: 'user',
      city: 'Hyderabad',
    },
  ]);

  // Seed Movies matching screenshot 3 and reference screenshots
  const movies = await Movie.insertMany([
    {
      movieName: 'RRR',
      title: 'RRR',
      description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
      genres: ['Action', 'Drama'],
      genre: ['Action', 'Drama'],
      language: 'Telugu',
      duration: 187,
      releaseDate: new Date('2022-03-25'),
      rating: 9.2,
      certificate: 'UA',
      director: 'S. S. Rajamouli',
      cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
      movieImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    },
    {
      movieName: 'Baahubali 2: The Conclusion',
      title: 'Baahubali 2: The Conclusion',
      description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
      genres: ['Action', 'Fantasy'],
      genre: ['Action', 'Fantasy'],
      language: 'Telugu',
      duration: 167,
      releaseDate: new Date('2017-04-28'),
      rating: 9.0,
      certificate: 'UA',
      director: 'S. S. Rajamouli',
      cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty', 'Tamannaah'],
      movieImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80',
      poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80',
    },
    {
      movieName: 'OG (They Call Him OG)',
      title: 'OG (They Call Him OG)',
      description: 'A ruthless gangster named Ojas Gambheera returns to Mumbai after ten years to seek vengeance against his former crime associates.',
      genres: ['Action', 'Crime'],
      genre: ['Action', 'Crime'],
      language: 'Telugu',
      duration: 155,
      releaseDate: new Date('2025-09-25'),
      rating: 8.8,
      certificate: 'UA',
      director: 'Sujeeth',
      cast: ['Pawan Kalyan', 'Emraan Hashmi', 'Priyanka Arul Mohan'],
      movieImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    },
    {
      movieName: 'Kalki 2898 AD',
      title: 'Kalki 2898 AD',
      description: 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to the earth to protect the world from evil forces.',
      genres: ['Sci-Fi', 'Action'],
      genre: ['Sci-Fi', 'Action'],
      language: 'Telugu',
      duration: 181,
      releaseDate: new Date('2024-06-27'),
      rating: 8.9,
      certificate: 'UA',
      director: 'Nag Ashwin',
      cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
      movieImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    },
  ]);

  // Seed Theatres matching screenshot 4
  const theatres = await Theatre.insertMany([
    {
      theatreName: 'Srinivasa 4K Dolby Atmos',
      theatreId: 'TH_SRINIVASA_01',
      location: 'Hyderabad',
      balconySeatPrice: 250,
      middleSeatPrice: 180,
      lowerSeatPrice: 120,
      balconySeats: { rows: 2, seatsPerRow: 12, total: 24 },
      middleSeats: { rows: 5, seatsPerRow: 12, total: 60 },
      lowerSeats: { rows: 3, seatsPerRow: 12, total: 36 },
      name: 'Srinivasa 4K Dolby Atmos',
      city: 'Hyderabad',
      address: 'RTC X Roads, Hyderabad',
      amenities: ['4K Dolby Atmos', 'Recliner Seats', 'Snack Bar'],
      screens: [{ name: 'Screen 1', rows: 10, seatsPerRow: 12, premiumRows: 2 }],
    },
    {
      theatreName: 'Gokul Theatre',
      theatreId: 'TH_GOKUL_02',
      location: 'Hyderabad',
      balconySeatPrice: 200,
      middleSeatPrice: 150,
      lowerSeatPrice: 100,
      balconySeats: { rows: 2, seatsPerRow: 10, total: 20 },
      middleSeats: { rows: 4, seatsPerRow: 10, total: 40 },
      lowerSeats: { rows: 3, seatsPerRow: 10, total: 30 },
      name: 'Gokul Theatre',
      city: 'Hyderabad',
      address: 'Erramanzil, Hyderabad',
      amenities: ['Dolby 7.1', 'Parking'],
      screens: [{ name: 'Audi 1', rows: 9, seatsPerRow: 10, premiumRows: 2 }],
    },
  ]);

  // Seed Shows matching screenshot 5
  const slots = ['10:00', '14:00', '18:00', '21:30'];
  for (let d = 1; d <= 3; d++) {
    for (const [ti, t] of theatres.entries()) {
      for (const [sl, timeStr] of slots.entries()) {
        const movie = movies[(d + ti + sl) % movies.length];
        const showDateObj = new Date();
        showDateObj.setDate(showDateObj.getDate() + d);
        const dateStr = showDateObj.toISOString().slice(0, 10);
        const [hour, minute] = timeStr.split(':').map(Number);
        const startTime = new Date(showDateObj);
        startTime.setHours(hour, minute, 0, 0);

        const show = await Show.create({
          adminEmail: 'admin@imovies.com',
          showId: `SH_${Date.now()}_${ti}_${sl}`,
          movieId: String(movie._id),
          theatreName: t.theatreName || t.name,
          showdate: dateStr,
          showtime: timeStr,
          tickets: { available: 100, booked: [] },
          movie: movie._id,
          theatre: t._id,
          screenName: 'Screen 1',
          startTime,
          endTime: new Date(startTime.getTime() + (movie.duration + 15) * 60000),
          price: { regular: t.middleSeatPrice || 180, premium: t.balconySeatPrice || 250 },
          totalSeats: 100,
          availableSeats: 100,
        });

        const screen = t.screens[0];
        if (screen) {
          await Seat.insertMany(generateSeats(show._id, screen, show.price));
        }
      }
    }
  }

  console.log('Seeding successfully completed for Imovies database!');
  console.log('Collections created and populated:');
  console.log('  - users (Admin & User accounts)');
  console.log('  - admins');
  console.log('  - movies (with movieName, description, genres, releaseDate, movieImage)');
  console.log('  - theatres (with theatreName, location, balcony/middle/lower seat pricing)');
  console.log('  - shows (with adminEmail, showId, movieId, theatreName, showdate, showtime, tickets)');
  console.log('Admin login: admin@imovies.com / Admin@123');
  console.log('User login:  user@imovies.com / User@123');

  await mongoose.disconnect();
})().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
