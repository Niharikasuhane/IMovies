const request = require('supertest');
const db = require('./setup');
const app = require('../src/app');
const User = require('../src/models/User');
const Movie = require('../src/models/Movie');
const Theatre = require('../src/models/Theatre');

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const auth = (t) => ({ Authorization: `Bearer ${t}` });

async function setup() {
  await User.create({ name: 'Admin', email: 'admin@x.com', password: 'secret1', role: 'admin' });
  const admin = (await request(app).post('/api/auth/login').send({ email: 'admin@x.com', password: 'secret1' })).body.token;
  const u1 = (await request(app).post('/api/auth/register').send({ name: 'U1', email: 'u1@x.com', password: 'secret1' })).body.token;
  const u2 = (await request(app).post('/api/auth/register').send({ name: 'U2', email: 'u2@x.com', password: 'secret1' })).body.token;
  const movie = await Movie.create({ title: 'T', description: 'd', language: 'English', genre: ['Action'], duration: 100, releaseDate: new Date() });
  const theatre = await Theatre.create({ name: 'Th', city: 'Gwalior', address: 'a', screens: [{ name: 'S1', rows: 3, seatsPerRow: 4, premiumRows: 1 }] });
  const start = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  const showRes = await request(app).post('/api/shows').set(auth(admin)).send({
    movie: movie._id, theatre: theatre._id, screenName: 'S1', startTime: start, price: { regular: 100, premium: 200 },
  });
  const seats = (await request(app).get(`/api/shows/${showRes.body.data._id}/seats`)).body.data;
  return { admin, u1, u2, show: showRes.body.data, seats, movie, theatre };
}

describe('Shows & seats', () => {
  test('creating a show generates seats; overlapping show rejected', async () => {
    const { show, seats, admin, movie, theatre } = await setup();
    expect(seats).toHaveLength(12);
    const clash = await request(app).post('/api/shows').set(auth(admin)).send({
      movie: movie._id, theatre: theatre._id, screenName: 'S1', startTime: show.startTime, price: { regular: 1, premium: 1 },
    });
    expect(clash.status).toBe(409);
  });
});

describe('Booking flow', () => {
  test('lock -> book -> pay -> cancel', async () => {
    const { u1, show, seats } = await setup();
    const ids = [seats[0]._id, seats[1]._id];
    expect((await request(app).post('/api/seats/lock').set(auth(u1)).send({ showId: show._id, seatIds: ids })).status).toBe(200);

    const b = await request(app).post('/api/bookings').set(auth(u1)).send({ showId: show._id, seatIds: ids });
    expect(b.status).toBe(201);
    expect(b.body.data.totalAmount).toBe(seats[0].price + seats[1].price);

    const pay = await request(app).post('/api/payments/pay').set(auth(u1)).send({ bookingId: b.body.data._id, method: 'card', cardNumber: '4111111111111111' });
    expect(pay.status).toBe(200);
    expect(pay.body.data.booking.status).toBe('confirmed');

    const cancel = await request(app).put(`/api/bookings/${b.body.data._id}/cancel`).set(auth(u1));
    expect(cancel.status).toBe(200);
    const after = (await request(app).get(`/api/shows/${show._id}/seats`)).body.data;
    expect(after.filter((s) => s.status === 'available')).toHaveLength(12);
  });

  test('two users cannot lock the same seat', async () => {
    const { u1, u2, show, seats } = await setup();
    const ids = [seats[2]._id];
    await request(app).post('/api/seats/lock').set(auth(u1)).send({ showId: show._id, seatIds: ids });
    const res = await request(app).post('/api/seats/lock').set(auth(u2)).send({ showId: show._id, seatIds: ids });
    expect(res.status).toBe(409);
  });

  test('payment failure keeps booking pending and seats not booked', async () => {
    const { u1, show, seats } = await setup();
    const ids = [seats[3]._id];
    await request(app).post('/api/seats/lock').set(auth(u1)).send({ showId: show._id, seatIds: ids });
    const b = await request(app).post('/api/bookings').set(auth(u1)).send({ showId: show._id, seatIds: ids });
    const pay = await request(app).post('/api/payments/pay').set(auth(u1)).send({ bookingId: b.body.data._id, method: 'card', cardNumber: '4111111111110000' });
    expect(pay.status).toBe(402);
    const seat = (await request(app).get(`/api/shows/${show._id}/seats`)).body.data.find((s) => s._id === ids[0]);
    expect(seat.status).not.toBe('booked');
  });

  test("cannot book seats you haven't locked; cannot cancel others' booking", async () => {
    const { u1, u2, show, seats } = await setup();
    const ids = [seats[4]._id];
    expect((await request(app).post('/api/bookings').set(auth(u1)).send({ showId: show._id, seatIds: ids })).status).toBe(409);
    await request(app).post('/api/seats/lock').set(auth(u1)).send({ showId: show._id, seatIds: ids });
    const b = await request(app).post('/api/bookings').set(auth(u1)).send({ showId: show._id, seatIds: ids });
    await request(app).post('/api/payments/pay').set(auth(u1)).send({ bookingId: b.body.data._id, cardNumber: '4111111111111111' });
    expect((await request(app).put(`/api/bookings/${b.body.data._id}/cancel`).set(auth(u2))).status).toBe(403);
  });
});

describe('Movie search & filters', () => {
  test('filters by search, genre, city and paginates', async () => {
    const { u1 } = await setup();
    expect((await request(app).get('/api/movies?search=T')).body.data.length).toBe(1);
    expect((await request(app).get('/api/movies?genre=Comedy')).body.data.length).toBe(0);
    expect((await request(app).get('/api/movies?city=Gwalior')).body.data.length).toBe(1);
    expect((await request(app).get('/api/movies?city=Delhi')).body.data.length).toBe(0);
    expect((await request(app).get('/api/movies?page=1&limit=5')).body.pagination.limit).toBe(5);
    expect(u1).toBeDefined();
  });
});
