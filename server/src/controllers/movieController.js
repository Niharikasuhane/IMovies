const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Theatre = require('../models/Theatre');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination, pageMeta } = require('../utils/paginate');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/movies?search=&genre=&language=&theatre=&city=&date=&page=&limit=&sort=
exports.getMovies = asyncHandler(async (req, res) => {
  const { search, genre, language, theatre, city, date, sort } = req.query;
  const { page, limit, skip } = getPagination(req.query, 12);
  const filter = { isActive: true };

  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };
  if (genre) filter.genre = { $in: genre.split(',') };
  if (language) filter.language = { $in: language.split(',') };

  // Filters that depend on shows: theatre, city, date
  if (theatre || city || date) {
    const showFilter = { status: 'scheduled', startTime: { $gte: new Date() } };
    if (theatre) showFilter.theatre = theatre;
    if (city) {
      const ids = await Theatre.find({ city: new RegExp(`^${escapeRegex(city)}$`, 'i') }).distinct('_id');
      showFilter.theatre = theatre ? { $in: ids.filter((i) => String(i) === theatre) } : { $in: ids };
    }
    if (date) {
      const d = new Date(date);
      if (isNaN(d)) throw new AppError('Invalid date', 400);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      showFilter.startTime = { $gte: start > new Date() ? start : new Date(), $lte: end };
    }
    filter._id = { $in: await Show.find(showFilter).distinct('movie') };
  }

  const sortMap = { rating: { rating: -1 }, latest: { releaseDate: -1 }, title: { title: 1 } };
  const [movies, total] = await Promise.all([
    Movie.find(filter).sort(sortMap[sort] || sortMap.latest).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ]);
  res.json({ success: true, data: movies, pagination: pageMeta(total, page, limit) });
});

exports.getFilters = asyncHandler(async (req, res) => {
  const [genres, languages, cities] = await Promise.all([
    Movie.distinct('genre', { isActive: true }),
    Movie.distinct('language', { isActive: true }),
    Theatre.distinct('city', { isActive: true }),
  ]);
  res.json({ success: true, genres: genres.sort(), languages: languages.sort(), cities: cities.sort() });
});

exports.getMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new AppError('Movie not found', 404);
  res.json({ success: true, data: movie });
});

const body = (req) => {
  const b = { ...req.body };
  ['genre', 'cast'].forEach((k) => {
    if (typeof b[k] === 'string') b[k] = b[k].split(',').map((s) => s.trim()).filter(Boolean);
  });
  if (req.file) b.poster = `/uploads/${req.file.filename}`;
  return b;
};

exports.createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(body(req));
  res.status(201).json({ success: true, data: movie });
});

exports.updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, body(req), { new: true, runValidators: true });
  if (!movie) throw new AppError('Movie not found', 404);
  res.json({ success: true, data: movie });
});

// Soft delete when shows exist so booking history remains intact
exports.deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new AppError('Movie not found', 404);
  const hasShows = await Show.exists({ movie: movie._id });
  if (hasShows) {
    movie.isActive = false;
    await movie.save();
    return res.json({ success: true, message: 'Movie has shows; it was deactivated instead of deleted' });
  }
  await movie.deleteOne();
  res.json({ success: true, message: 'Movie deleted' });
});
